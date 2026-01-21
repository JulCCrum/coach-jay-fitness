import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

const MEAL_PLAN_PROMPT = `You are a professional nutritionist creating a personalized 7-day meal plan. Based on the customer data and template guidelines provided, create a detailed, practical meal plan.

IMPORTANT RULES:
1. Generate exactly 7 days of meals
2. Each day should have the specified number of meals
3. Include specific portion sizes (in oz, cups, or grams)
4. Stay within the calorie range specified
5. Match the macro split as closely as possible
6. Respect all dietary preferences and restrictions
7. Make meals practical and easy to prepare
8. Include variety throughout the week

OUTPUT FORMAT (respond with valid JSON only, no markdown):
{
  "overview": "A brief 2-3 sentence summary of the meal plan approach",
  "dailyTargets": {
    "calories": number,
    "protein": number (grams),
    "carbs": number (grams),
    "fat": number (grams)
  },
  "weeklyMeals": {
    "monday": {
      "breakfast": { "name": "meal name", "description": "brief description with portions", "calories": number },
      "lunch": { "name": "meal name", "description": "brief description with portions", "calories": number },
      "dinner": { "name": "meal name", "description": "brief description with portions", "calories": number }
    },
    "tuesday": { ... },
    "wednesday": { ... },
    "thursday": { ... },
    "friday": { ... },
    "saturday": { ... },
    "sunday": { ... }
  },
  "shoppingList": {
    "proteins": ["item 1", "item 2", ...],
    "vegetables": ["item 1", "item 2", ...],
    "fruits": ["item 1", "item 2", ...],
    "grains": ["item 1", "item 2", ...],
    "dairy": ["item 1", "item 2", ...],
    "pantryStaples": ["item 1", "item 2", ...]
  },
  "tips": ["tip 1", "tip 2", "tip 3"]
}

If there are snacks in the plan, add them as "snack1", "snack2" etc in each day.`

async function generateMealPlan(
  customerId: string,
  chatSessionToken: string | null
): Promise<any> {
  // Get customer data
  const customerDoc = await adminDb.collection('customers').doc(customerId).get()
  const customer = customerDoc.data()

  // Get chat session for extracted data
  let extractedData: any = {}
  if (chatSessionToken) {
    const sessionDoc = await adminDb.collection('chatSessions').doc(chatSessionToken).get()
    if (sessionDoc.exists) {
      extractedData = sessionDoc.data()?.extractedData || {}
    }
  }

  // Find the best matching template
  const templatesQuery = await adminDb
    .collection('mealPlanTemplates')
    .where('isActive', '==', true)
    .get()

  let selectedTemplate: any = null
  let bestScore = -1

  templatesQuery.forEach((doc) => {
    const template = doc.data()
    let score = 0

    // Score based on goal match
    const goal = extractedData.primaryGoal?.toLowerCase() || ''
    const templateType = template.customerType?.toLowerCase() || ''

    if (goal.includes('weight') && goal.includes('loss') && templateType.includes('weight-loss')) {
      score += 10
    }
    if (goal.includes('muscle') && templateType.includes('muscle-gain')) {
      score += 10
    }
    if (goal.includes('energy') && templateType.includes('maintenance')) {
      score += 5
    }

    // Score based on lifestyle match
    const lifestyle = extractedData.lifestyleType?.toLowerCase() || ''
    if (lifestyle === 'busy' && templateType.includes('busy')) {
      score += 5
    }

    // Score based on dietary preferences
    const prefs = extractedData.dietaryPreferences || []
    if (prefs.includes('vegan') && templateType.includes('vegan')) {
      score += 10
    }
    if (prefs.includes('vegetarian') && templateType.includes('vegetarian')) {
      score += 10
    }
    if (prefs.includes('keto') && templateType.includes('keto')) {
      score += 10
    }

    if (score > bestScore) {
      bestScore = score
      selectedTemplate = { id: doc.id, ...template }
    }
  })

  // If no template found, use default values
  if (!selectedTemplate) {
    selectedTemplate = {
      name: 'General Balanced Plan',
      calorieRange: { min: 1800, max: 2200 },
      macroSplit: { protein: 30, carbs: 40, fat: 30 },
      mealsPerDay: 3,
      guidelines: 'Focus on whole foods, lean proteins, and plenty of vegetables.',
      sampleMeals: '',
    }
  }

  // Calculate target calories based on goals
  let targetCalories = Math.round(
    (selectedTemplate.calorieRange.min + selectedTemplate.calorieRange.max) / 2
  )

  // Adjust based on activity level
  const activity = extractedData.activityLevel || 'moderately-active'
  if (activity === 'sedentary') {
    targetCalories = selectedTemplate.calorieRange.min
  } else if (activity === 'very-active' || activity === 'athlete') {
    targetCalories = selectedTemplate.calorieRange.max
  }

  // Build the prompt context
  const context = `
CUSTOMER PROFILE:
- Name: ${customer?.name || extractedData.name || 'Customer'}
- Primary Goal: ${extractedData.primaryGoal || 'general health'}
- Dietary Preferences: ${(extractedData.dietaryPreferences || []).join(', ') || 'none specified'}
- Allergies: ${(extractedData.allergies || []).join(', ') || 'none'}
- Disliked Foods: ${(extractedData.dislikedFoods || []).join(', ') || 'none'}
- Lifestyle: ${extractedData.lifestyleType || 'moderate'}
- Cooking Preference: ${extractedData.cookingPreference || 'willing to cook'}
- Activity Level: ${extractedData.activityLevel || 'moderately active'}

TEMPLATE GUIDELINES:
- Template: ${selectedTemplate.name}
- Target Calories: ${targetCalories} per day
- Macro Split: ${selectedTemplate.macroSplit.protein}% protein, ${selectedTemplate.macroSplit.carbs}% carbs, ${selectedTemplate.macroSplit.fat}% fat
- Meals Per Day: ${selectedTemplate.mealsPerDay}
- Additional Guidelines: ${selectedTemplate.guidelines || 'None'}
${selectedTemplate.sampleMeals ? `\nSample Meals for Reference:\n${selectedTemplate.sampleMeals}` : ''}

Create a personalized 7-day meal plan following these guidelines exactly.`

  // Call OpenAI to generate the meal plan
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: MEAL_PLAN_PROMPT },
        { role: 'user', content: context },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content.trim()

  // Parse the JSON response
  try {
    // Try direct parse
    return JSON.parse(content)
  } catch {
    // Try to extract from markdown code block
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim())
    }
    throw new Error('Failed to parse meal plan response')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { mealPlanId, customerId, chatSessionToken } = await request.json()

    if (!mealPlanId || !customerId) {
      return NextResponse.json(
        { error: 'Meal plan ID and customer ID required' },
        { status: 400 }
      )
    }

    console.log(`Generating meal plan ${mealPlanId} for customer ${customerId}`)

    // Update status to generating
    await adminDb.collection('mealPlans').doc(mealPlanId).update({
      status: 'generating',
      generationStartedAt: new Date(),
    })

    try {
      // Generate the meal plan
      const planContent = await generateMealPlan(customerId, chatSessionToken)

      // Save the generated plan
      await adminDb.collection('mealPlans').doc(mealPlanId).update({
        status: 'ready',
        planContent,
        generatedAt: new Date(),
      })

      console.log(`Meal plan ${mealPlanId} generated successfully`)

      return NextResponse.json({ success: true, mealPlanId })
    } catch (genError: any) {
      console.error(`Meal plan generation failed for ${mealPlanId}:`, genError)

      // Update status to failed
      await adminDb.collection('mealPlans').doc(mealPlanId).update({
        status: 'failed',
        error: genError.message,
        failedAt: new Date(),
      })

      return NextResponse.json(
        { error: 'Meal plan generation failed' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Meal plan generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate meal plan' },
      { status: 500 }
    )
  }
}
