import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { adminDb } from '@/lib/firebase-admin'
import Stripe from 'stripe'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    if (!WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract metadata
        const { customerId, chatSessionToken, affiliateCode } = session.metadata || {}

        if (!customerId) {
          console.error('No customerId in checkout session metadata')
          break
        }

        // Create order record
        const orderRef = await adminDb.collection('orders').add({
          customerId,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          amount: session.amount_total || 0,
          currency: session.currency,
          status: 'paid',
          affiliateCode: affiliateCode || null,
          chatSessionToken: chatSessionToken || null,
          paidAt: new Date(),
          createdAt: new Date(),
        })

        console.log(`Order created: ${orderRef.id} for customer ${customerId}`)

        // Update customer with order reference
        await adminDb.collection('customers').doc(customerId).update({
          latestOrderId: orderRef.id,
          hasPurchased: true,
          purchasedAt: new Date(),
        })

        // Create affiliate commission if applicable
        if (affiliateCode) {
          const affiliateQuery = await adminDb
            .collection('affiliates')
            .where('code', '==', affiliateCode)
            .where('status', '==', 'active')
            .limit(1)
            .get()

          if (!affiliateQuery.empty) {
            const affiliate = affiliateQuery.docs[0]
            const affiliateData = affiliate.data()
            const commissionRate = affiliateData.commissionRate || 0.1 // Default 10%
            const commissionAmount = Math.round((session.amount_total || 0) * commissionRate)

            await adminDb.collection('affiliateCommissions').add({
              affiliateId: affiliate.id,
              orderId: orderRef.id,
              customerId,
              orderAmount: session.amount_total || 0,
              commissionRate,
              commissionAmount,
              status: 'pending',
              createdAt: new Date(),
            })

            // Update affiliate stats
            await adminDb.collection('affiliates').doc(affiliate.id).update({
              totalConversions: (affiliateData.totalConversions || 0) + 1,
              totalRevenue: (affiliateData.totalRevenue || 0) + (session.amount_total || 0),
              pendingCommission: (affiliateData.pendingCommission || 0) + commissionAmount,
            })

            console.log(`Commission created for affiliate ${affiliateCode}: $${commissionAmount / 100}`)
          }
        }

        // Create pending meal plan
        const mealPlanRef = await adminDb.collection('mealPlans').add({
          customerId,
          orderId: orderRef.id,
          chatSessionToken: chatSessionToken || null,
          status: 'generating',
          createdAt: new Date(),
        })

        console.log(`Meal plan ${mealPlanRef.id} queued for generation`)

        // Update order with meal plan reference
        await adminDb.collection('orders').doc(orderRef.id).update({
          mealPlanId: mealPlanRef.id,
        })

        // Trigger meal plan generation (async, don't wait)
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
        fetch(`${baseUrl}/api/meal-plan/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mealPlanId: mealPlanRef.id,
            customerId,
            chatSessionToken,
          }),
        }).catch((err) => console.error('Meal plan generation trigger error:', err))

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
