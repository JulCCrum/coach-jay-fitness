'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function AffiliateRefPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  useEffect(() => {
    // Set affiliate cookie (30 days)
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    document.cookie = `affiliate_code=${code}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`

    // Track the click
    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, type: 'click' }),
    }).catch(console.error)

    // Redirect to home page
    router.push('/')
  }, [code, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  )
}
