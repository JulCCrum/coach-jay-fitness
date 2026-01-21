'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react'

export default function NewAffiliatePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [commissionRate, setCommissionRate] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          code,
          commissionRate: commissionRate / 100,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create affiliate')
      }

      router.push('/admin/affiliates')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const randomCode = name
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 6)
      .padEnd(4, Math.random().toString(36).substring(2, 8).toUpperCase())
      .slice(0, 8)
    setCode(randomCode)
  }

  return (
    <div>
      <div className="mb-8">
        <a
          href="/admin/affiliates"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Affiliates
        </a>
        <h1 className="text-3xl font-black text-white">Add Affiliate</h1>
        <p className="text-gray-400 mt-1">Create a new affiliate partner</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="bg-surface rounded-2xl p-6 border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Affiliate Code *
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  maxLength={12}
                  className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent uppercase"
                  placeholder="FITJOHN"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="px-4 py-3 bg-background border border-border rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                >
                  Generate
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                This will be used in referral links: /ref/{code || 'CODE'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Commission Rate (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className="w-32 px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <p className="text-gray-500 text-sm mt-2">
                Percentage of each sale that goes to the affiliate
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Affiliate
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
