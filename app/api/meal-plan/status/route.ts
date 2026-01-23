import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Find the order by Stripe session ID
    const orderQuery = await adminDb
      .collection('orders')
      .where('stripeSessionId', '==', sessionId)
      .limit(1)
      .get()

    if (orderQuery.empty) {
      return NextResponse.json({ mealPlan: null })
    }

    const order = orderQuery.docs[0].data()
    const mealPlanId = order.mealPlanId

    if (!mealPlanId) {
      return NextResponse.json({
        mealPlan: { status: 'generating' },
      })
    }

    // Get the meal plan
    const mealPlanDoc = await adminDb.collection('mealPlans').doc(mealPlanId).get()

    if (!mealPlanDoc.exists) {
      return NextResponse.json({
        mealPlan: { status: 'generating' },
      })
    }

    const mealPlan = mealPlanDoc.data()

    return NextResponse.json({
      mealPlan: {
        id: mealPlanDoc.id,
        status: mealPlan?.status || 'generating',
        planContent: mealPlan?.planContent || null,
      },
    })
  } catch (error: any) {
    console.error('Meal plan status error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meal plan status' },
      { status: 500 }
    )
  }
}
