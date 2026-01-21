import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get customer
    const customerDoc = await adminDb.collection('customers').doc(id).get()

    if (!customerDoc.exists) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = customerDoc.data()

    // Get chat session
    let chatSession = null
    if (customer?.chatSessionToken) {
      const sessionDoc = await adminDb
        .collection('chatSessions')
        .doc(customer.chatSessionToken)
        .get()
      if (sessionDoc.exists) {
        const sessionData = sessionDoc.data()
        chatSession = {
          id: sessionDoc.id,
          messages: sessionData?.messages || [],
          extractedData: sessionData?.extractedData || null,
          messageCount: sessionData?.messageCount || 0,
          createdAt: sessionData?.createdAt?.toDate?.() || sessionData?.createdAt,
        }
      }
    }

    // Get orders
    const ordersQuery = await adminDb
      .collection('orders')
      .where('customerId', '==', id)
      .orderBy('createdAt', 'desc')
      .get()

    const orders: any[] = []
    ordersQuery.forEach((doc) => {
      const data = doc.data()
      orders.push({
        id: doc.id,
        amount: data.amount,
        status: data.status,
        mealPlanId: data.mealPlanId,
        paidAt: data.paidAt?.toDate?.() || data.paidAt,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      })
    })

    // Get meal plans
    const mealPlansQuery = await adminDb
      .collection('mealPlans')
      .where('customerId', '==', id)
      .orderBy('createdAt', 'desc')
      .get()

    const mealPlans: any[] = []
    mealPlansQuery.forEach((doc) => {
      const data = doc.data()
      mealPlans.push({
        id: doc.id,
        status: data.status,
        planContent: data.planContent || null,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        generatedAt: data.generatedAt?.toDate?.() || data.generatedAt,
      })
    })

    return NextResponse.json({
      customer: {
        id: customerDoc.id,
        ...customer,
        createdAt: customer?.createdAt?.toDate?.() || customer?.createdAt,
        purchasedAt: customer?.purchasedAt?.toDate?.() || customer?.purchasedAt,
      },
      chatSession,
      orders,
      mealPlans,
    })
  } catch (error: any) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}
