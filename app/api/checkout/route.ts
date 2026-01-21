import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { stripe, PRICE_ID } from '@/lib/stripe'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (!PRICE_ID) {
      console.error('STRIPE_PRICE_ID not configured')
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('chat_session')?.value
    const affiliateCode = cookieStore.get('affiliate_code')?.value

    // Create or get customer in Firestore
    let customerId: string
    const customerQuery = await adminDb
      .collection('customers')
      .where('email', '==', email)
      .limit(1)
      .get()

    if (customerQuery.empty) {
      // Create new customer
      const customerRef = await adminDb.collection('customers').add({
        name,
        email,
        phone: phone || null,
        affiliateCode: affiliateCode || null,
        chatSessionToken: sessionToken || null,
        createdAt: new Date(),
      })
      customerId = customerRef.id
    } else {
      // Update existing customer
      customerId = customerQuery.docs[0].id
      await adminDb.collection('customers').doc(customerId).update({
        name,
        phone: phone || null,
        chatSessionToken: sessionToken || null,
        updatedAt: new Date(),
      })
    }

    // Link chat session to customer
    if (sessionToken) {
      await adminDb.collection('chatSessions').doc(sessionToken).update({
        customerId,
        customerName: name,
        customerEmail: email,
      })
    }

    // Create Stripe Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        customerId,
        chatSessionToken: sessionToken || '',
        affiliateCode: affiliateCode || '',
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,
    })

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
