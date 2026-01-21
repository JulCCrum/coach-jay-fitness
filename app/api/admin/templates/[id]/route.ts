import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// GET - Get single template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = adminDb.collection('mealPlanTemplates').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
    })
  } catch (error: any) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}

// PUT - Update template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const docRef = adminDb.collection('mealPlanTemplates').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    const updateData = {
      name,
      customerType,
      description,
      calorieRange,
      macroSplit,
      mealsPerDay,
      guidelines,
      sampleMeals,
      isActive,
      updatedAt: new Date(),
    }

    await docRef.update(updateData)

    return NextResponse.json({
      id: doc.id,
      ...doc.data(),
      ...updateData,
    })
  } catch (error: any) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const docRef = adminDb.collection('mealPlanTemplates').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    await docRef.delete()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
