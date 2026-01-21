'use client'

import { useEffect, useState, use } from 'react'
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface CustomerData {
  customer: {
    id: string
    name: string
    email: string
    phone?: string
    hasPurchased: boolean
    affiliateCode?: string
    createdAt: string
    purchasedAt?: string
  }
  chatSession?: {
    id: string
    messages: { role: string; content: string }[]
    extractedData?: any
    messageCount: number
    createdAt: string
  }
  orders: {
    id: string
    amount: number
    status: string
    mealPlanId?: string
    paidAt: string
    createdAt: string
  }[]
  mealPlans: {
    id: string
    status: string
    planContent?: any
    createdAt: string
    generatedAt?: string
  }[]
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await fetch(`/api/admin/customers/${id}`)
        if (!response.ok) {
          throw new Error('Customer not found')
        }
        const result = await response.json()
        setData(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [id])

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error || 'Customer not found'}</p>
        <a
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </a>
      </div>
    )
  }

  const { customer, chatSession, orders, mealPlans } = data

  return (
    <div>
      <a
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </a>

      {/* Customer Header */}
      <div className="bg-surface rounded-2xl p-6 border border-border mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{customer.name || 'Unknown'}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {customer.email}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          {customer.hasPurchased ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-400/10 text-green-400 rounded-full">
              <CheckCircle className="w-4 h-4" />
              Purchased
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-400/10 text-yellow-400 rounded-full">
              <Clock className="w-4 h-4" />
              Lead
            </span>
          )}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border text-sm">
          <div>
            <span className="text-gray-500">Joined:</span>{' '}
            <span className="text-white">{formatDate(customer.createdAt)}</span>
          </div>
          {customer.affiliateCode && (
            <div>
              <span className="text-gray-500">Referral:</span>{' '}
              <code className="px-2 py-0.5 bg-background rounded text-accent">
                {customer.affiliateCode}
              </code>
            </div>
          )}
          {customer.purchasedAt && (
            <div>
              <span className="text-gray-500">Purchased:</span>{' '}
              <span className="text-white">{formatDate(customer.purchasedAt)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chat Session */}
        <div className="bg-surface rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-white">Chat History</h2>
          </div>

          {chatSession && chatSession.messages.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {chatSession.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-background text-gray-300 ml-8'
                      : 'bg-accent/10 text-white mr-8'
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1 capitalize">{msg.role}</div>
                  {msg.content}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No chat history</p>
          )}

          {chatSession?.extractedData && (
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Extracted Data</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(chatSession.extractedData).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null
                  return (
                    <div key={key}>
                      <span className="text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>{' '}
                      <span className="text-white">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Orders & Meal Plans */}
        <div className="space-y-6">
          {/* Orders */}
          <div className="bg-surface rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-white">Orders</h2>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {formatCurrency(order.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(order.paidAt || order.createdAt)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === 'paid'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-gray-400/10 text-gray-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No orders yet</p>
            )}
          </div>

          {/* Meal Plans */}
          <div className="bg-surface rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-white">Meal Plans</h2>
            </div>

            {mealPlans.length > 0 ? (
              <div className="space-y-3">
                {mealPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-400">
                        {formatDate(plan.createdAt)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          plan.status === 'ready'
                            ? 'bg-green-400/10 text-green-400'
                            : plan.status === 'generating'
                            ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-red-400/10 text-red-400'
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>
                    {plan.planContent?.overview && (
                      <p className="text-sm text-gray-300">{plan.planContent.overview}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No meal plans yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
