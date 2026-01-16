import { NextResponse } from 'next/server'

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

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json(
        { message: "Hey! Looks like we're still getting set up. Click the Book Now button to connect with Jay directly." },
        { status: 200 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
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

    // Log conversation for review
    console.log('--- Chat Message ---')
    console.log('Messages:', messages.length)
    if (messages.length > 0) {
      console.log('User:', messages[messages.length - 1]?.content)
    }
    console.log('Assistant:', data.choices[0].message.content)
    console.log('--------------------')

    return NextResponse.json({
      message: data.choices[0].message.content,
    })
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
