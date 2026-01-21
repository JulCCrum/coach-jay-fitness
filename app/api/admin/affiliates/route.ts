import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// GET - List all affiliates
export async function GET(request: NextRequest) {
  try {
    const affiliatesRef = adminDb.collection('affiliates')
    const snapshot = await affiliatesRef.orderBy('createdAt', 'desc').get()

    const affiliates: any[] = []
    snapshot.forEach((doc) => {
      affiliates.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return NextResponse.json({ affiliates })
  } catch (error: any) {
    console.error('Error fetching affiliates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch affiliates' },
      { status: 500 }
    )
  }
}

// POST - Create new affiliate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, code, commissionRate } = body

    if (!name || !email || !code) {
      return NextResponse.json(
        { error: 'Name, email, and code are required' },
        { status: 400 }
      )
    }

    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '')

    // Check if code already exists
    const existingCode = await adminDb
      .collection('affiliates')
      .where('code', '==', normalizedCode)
      .limit(1)
      .get()

    if (!existingCode.empty) {
      return NextResponse.json(
        { error: 'This affiliate code is already taken' },
        { status: 400 }
      )
    }

    const affiliateData = {
      name,
      email,
      code: normalizedCode,
      commissionRate: commissionRate || 0.1, // Default 10%
      status: 'active',
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      pendingCommission: 0,
      paidCommission: 0,
      createdAt: new Date(),
    }

    const docRef = await adminDb.collection('affiliates').add(affiliateData)

    return NextResponse.json({
      id: docRef.id,
      ...affiliateData,
    })
  } catch (error: any) {
    console.error('Error creating affiliate:', error)
    return NextResponse.json(
      { error: 'Failed to create affiliate' },
      { status: 500 }
    )
  }
}
