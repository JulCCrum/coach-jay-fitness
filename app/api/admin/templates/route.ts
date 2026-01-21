import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export interface MealPlanTemplate {
  id?: string
  name: string
  customerType: string
  description: string
  calorieRange: {
    min: number
    max: number
  }
  macroSplit: {
    protein: number
    carbs: number
    fat: number
  }
  mealsPerDay: number
  guidelines: string
  sampleMeals: string
  isActive: boolean
  createdAt?: any
  updatedAt?: any
}

// GET - List all templates
export async function GET(request: NextRequest) {
  try {
    const templatesRef = adminDb.collection('mealPlanTemplates')
    const snapshot = await templatesRef.orderBy('createdAt', 'desc').get()

    const templates: MealPlanTemplate[] = []
    snapshot.forEach((doc) => {
      templates.push({
        id: doc.id,
        ...doc.data(),
      } as MealPlanTemplate)
    })

    return NextResponse.json({ templates })
  } catch (error: any) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      customerType,
      description,
      calorieRange,
      macroSplit,
      mealsPerDay,
      guidelines,
      sampleMeals,
      isActive,
    } = body

    // Validate required fields
    if (!name || !customerType || !description) {
      return NextResponse.json(
        { error: 'Name, customer type, and description are required' },
        { status: 400 }
      )
    }

    // Validate macro split adds up to 100
    if (macroSplit) {
      const total = macroSplit.protein + macroSplit.carbs + macroSplit.fat
      if (Math.abs(total - 100) > 1) {
        return NextResponse.json(
          { error: 'Macro percentages must add up to 100%' },
          { status: 400 }
        )
      }
    }

    const templateData: Omit<MealPlanTemplate, 'id'> = {
      name,
      customerType,
      description,
      calorieRange: calorieRange || { min: 1500, max: 2500 },
      macroSplit: macroSplit || { protein: 30, carbs: 40, fat: 30 },
      mealsPerDay: mealsPerDay || 3,
      guidelines: guidelines || '',
      sampleMeals: sampleMeals || '',
      isActive: isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const docRef = await adminDb.collection('mealPlanTemplates').add(templateData)

    return NextResponse.json({
      id: docRef.id,
      ...templateData,
    })
  } catch (error: any) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
