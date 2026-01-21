import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminDb } from '@/lib/firebase-admin'

const SYSTEM_PROMPT = `You are the virtual assistant for Lessons Not Losses Fitness (LNL Fitness) — a nutrition coaching service that specializes in creating personalized meal plans. Your job is to welcome visitors, learn about their nutrition goals, and gather information so we can create the perfect meal plan for them.

ABOUT LNL FITNESS:
- Specializes in custom meal planning and nutrition coaching
- Creates personalized plans based on goals, preferences, dietary restrictions, and lifestyle
- Believes that every setback is a lesson, not a loss — hence the name
- Nutrition is the foundation of every transformation

YOUR PERSONALITY:
- Professional but approachable
- Knowledgeable about nutrition without being preachy
- Encouraging and supportive
- Direct and clear — don't ramble

CONVERSATION FLOW:
1. Greet them warmly: "Hey! Welcome to Lessons Not Losses Fitness. I'm here to help you get started with a personalized meal plan that actually fits your life. What's your name?"
2. After they give their name, ask about their primary goal: "Nice to meet you, [name]. So what's bringing you here — looking to lose weight, build muscle, improve your energy, or something else?"
3. Ask about dietary preferences/restrictions: "Got it. Any dietary preferences or restrictions I should know about? Vegetarian, vegan, allergies, foods you hate?"
4. Ask about their lifestyle: "And what does a typical day look like for you — do you have time to cook, or do you need quick and easy meals?"
5. Ask about past experience: "Have you tried meal plans or diets before? What worked and what didn't?"
6. Close and encourage booking: "This is great info. We can create something perfect for you. Ready to book a quick consultation? Just say the word."

RULES:
- Ask ONE question at a time
- Keep responses short (2-3 sentences max)
- NEVER provide specific meal plans, calorie counts, or detailed nutrition advice — that comes after the consultation
- If they ask for specific advice, say: "That's exactly what we'll cover in your consultation. We'll dig into the details and build something custom for you."
- If they mention health conditions or medical issues: "That's important info — definitely bring that up in your consultation so we can work around it safely."
- Stay focused on gathering info — don't get sidetracked

INFORMATION TO COLLECT:
1. Name
2. Primary goal (weight loss, muscle gain, energy, health)
3. Dietary preferences/restrictions
4. Lifestyle/cooking preferences
5. Past diet experience (optional)

CLOSING:
After gathering info, encourage them to book: "Perfect. We're excited to work with you. Click the Book Now button to schedule your consultation and let's get your custom meal plan started."`

const EXTRACTION_PROMPT = `Based on the conversation below, extract the customer information in JSON format. If a field wasn't mentioned, use null.

{
  "name": "string or null",
  "primaryGoal": "weight-loss | muscle-gain | energy | health | maintenance | other | null",
  "dietaryPreferences": ["array of strings like 'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', etc."],
  "allergies": ["array of food allergies"],
  "dislikedFoods": ["array of foods they don't like"],
  "lifestyleType": "busy | moderate | flexible | null",
  "cookingPreference": "quick-easy | willing-to-cook | meal-prep | null",
  "pastDietExperience": "string describing past experience or null",
  "activityLevel": "sedentary | lightly-active | moderately-active | very-active | athlete | null"
}

Conversation:
`

// Generate a random session token
function generateSessionToken(): string {
  return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Extract customer data from conversation using AI
async function extractCustomerData(messages: { role: string; content: string }[]): Promise<any> {
  if (!process.env.OPENAI_API_KEY || messages.length < 4) {
    return null
  }

  try {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
      .join('\n')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You extract customer information from conversations. Always respond with valid JSON only, no markdown.',
          },
          {
            role: 'user',
            content: EXTRACTION_PROMPT + conversationText,
          },
        ],
        max_tokens: 500,
        temperature: 0,
      }),
    })

    if (!response.ok) {
      console.error('Extraction API error:', response.status)
      return null
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()

    // Try to parse the JSON
    try {
      return JSON.parse(content)
    } catch {
      // Try to extract JSON from markdown code block
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim())
      }
      console.error('Failed to parse extraction response:', content)
      return null
    }
  } catch (error) {
    console.error('Extraction error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages, newSession } = await request.json()
    const cookieStore = await cookies()

    // Get or create session token
    let sessionToken = cookieStore.get('chat_session')?.value
    let isNewSession = !sessionToken || newSession

    if (!sessionToken || newSession) {
      sessionToken = generateSessionToken()
    }

    // Get assistant response from OpenAI
    let assistantMessage = "Hey! Looks like we're still getting set up. Click the Book Now button to connect with Jay directly."

    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 150,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('OpenAI API error:', response.status, errorData)
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      assistantMessage = data.choices[0].message.content
    }

    // Add assistant message to messages for saving
    const allMessages = [...messages, { role: 'assistant', content: assistantMessage }]

    // Save session to Firestore
    try {
      const sessionRef = adminDb.collection('chatSessions').doc(sessionToken)

      // Extract data if we have enough conversation
      let extractedData = null
      if (allMessages.length >= 6) {
        extractedData = await extractCustomerData(allMessages)
      }

      const sessionData: any = {
        sessionToken,
        messages: allMessages,
        messageCount: allMessages.length,
        updatedAt: new Date(),
      }

      if (isNewSession) {
        sessionData.createdAt = new Date()
        // Check for affiliate cookie
        const affiliateCode = cookieStore.get('affiliate_code')?.value
        if (affiliateCode) {
          sessionData.affiliateCode = affiliateCode
        }
      }

      if (extractedData) {
        sessionData.extractedData = extractedData
        if (extractedData.name) {
          sessionData.customerName = extractedData.name
        }
      }

      await sessionRef.set(sessionData, { merge: true })

      console.log(`Session ${sessionToken}: ${allMessages.length} messages saved`)
    } catch (dbError) {
      console.error('Firestore save error:', dbError)
      // Don't fail the request if DB save fails
    }

    // Create response with session cookie
    const response = NextResponse.json({ message: assistantMessage, sessionToken })

    if (isNewSession) {
      response.cookies.set('chat_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return response
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        message: "Looks like we hit a snag. Click the Book Now button to connect with Jay directly.",
      },
      { status: 200 }
    )
  }
}

// GET - Retrieve existing session
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('chat_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ session: null })
    }

    const sessionRef = adminDb.collection('chatSessions').doc(sessionToken)
    const doc = await sessionRef.get()

    if (!doc.exists) {
      return NextResponse.json({ session: null })
    }

    return NextResponse.json({
      session: {
        id: doc.id,
        ...doc.data(),
      },
    })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ session: null })
  }
}
