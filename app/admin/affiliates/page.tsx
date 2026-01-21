'use client'

import { useEffect, useState } from 'react'
import { Plus, Users, MousePointer, DollarSign, TrendingUp, Copy, CheckCircle } from 'lucide-react'

interface Affiliate {
  id: string
  name: string
  email: string
  code: string
  commissionRate: number
  status: string
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  pendingCommission: number
  paidCommission: number
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchAffiliates()
  }, [])

  async function fetchAffiliates() {
    try {
      const response = await fetch('/api/admin/affiliates')
      const data = await response.json()
      setAffiliates(data.affiliates || [])
    } catch (error) {
      console.error('Error fetching affiliates:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = (code: string) => {
    const baseUrl = window.location.origin
    navigator.clipboard.writeText(`${baseUrl}/ref/${code}`)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Affiliates</h1>
          <p className="text-gray-400 mt-1">
            Manage affiliates and track referral performance
          </p>
        </div>
        <a
          href="/admin/affiliates/new"
          className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Affiliate
        </a>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading affiliates...</div>
      ) : affiliates.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 border border-border text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No affiliates yet</h3>
          <p className="text-gray-400 mb-6">
            Add your first affiliate to start tracking referrals
          </p>
          <a
            href="/admin/affiliates/new"
            className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Affiliate
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {affiliates.map((affiliate) => (
            <div
              key={affiliate.id}
              className="bg-surface rounded-xl p-6 border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{affiliate.name}</h3>
                  <p className="text-gray-400 text-sm">{affiliate.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-1 bg-background rounded text-accent font-mono text-sm">
                    {affiliate.code}
                  </code>
                  <button
                    onClick={() => copyLink(affiliate.code)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                    title="Copy referral link"
                  >
                    {copiedCode === affiliate.code ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <MousePointer className="w-4 h-4" />
                    Clicks
                  </div>
                  <div className="text-xl font-bold text-white">
                    {affiliate.totalClicks.toLocaleString()}
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Conversions
                  </div>
                  <div className="text-xl font-bold text-white">
                    {affiliate.totalConversions.toLocaleString()}
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Revenue
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(affiliate.totalRevenue)}
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Pending
                  </div>
                  <div className="text-xl font-bold text-accent">
                    {formatCurrency(affiliate.pendingCommission)}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Commission rate: {(affiliate.commissionRate * 100).toFixed(0)}%
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    affiliate.status === 'active'
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-gray-400/10 text-gray-400'
                  }`}
                >
                  {affiliate.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
