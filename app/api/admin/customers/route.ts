import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search') || ''

    const customersRef = adminDb.collection('customers')
    let query = customersRef.orderBy('createdAt', 'desc').limit(100)

    const snapshot = await query.get()

    const customers: any[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()

      // Filter by search term if provided
      if (search) {
        const searchLower = search.toLowerCase()
        const nameMatch = data.name?.toLowerCase().includes(searchLower)
        const emailMatch = data.email?.toLowerCase().includes(searchLower)
        if (!nameMatch && !emailMatch) {
          return
        }
      }

      customers.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        hasPurchased: data.hasPurchased || false,
        affiliateCode: data.affiliateCode,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        purchasedAt: data.purchasedAt?.toDate?.() || data.purchasedAt,
      })
    })

    return NextResponse.json({ customers })
  } catch (error: any) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
