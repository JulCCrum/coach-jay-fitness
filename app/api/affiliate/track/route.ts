import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { code, type } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 })
    }

    // Find the affiliate
    const affiliateQuery = await adminDb
      .collection('affiliates')
      .where('code', '==', code.toUpperCase())
      .limit(1)
      .get()

    if (affiliateQuery.empty) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }

    const affiliate = affiliateQuery.docs[0]

    // Track the click
    if (type === 'click') {
      await adminDb.collection('affiliates').doc(affiliate.id).update({
        totalClicks: (affiliate.data().totalClicks || 0) + 1,
        lastClickAt: new Date(),
      })

      // Log the click
      await adminDb.collection('affiliateClicks').add({
        affiliateId: affiliate.id,
        affiliateCode: code.toUpperCase(),
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent') || '',
        referrer: request.headers.get('referer') || '',
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Affiliate track error:', error)
    return NextResponse.json(
      { error: 'Failed to track affiliate' },
      { status: 500 }
    )
  }
}
