'use client'

import { useEffect, useState } from 'react'
import { Search, Users, Mail, Phone, CheckCircle, Clock, ExternalLink } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  hasPurchased: boolean
  affiliateCode?: string
  createdAt: string
  purchasedAt?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/admin/customers')
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower)
    )
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Customers</h1>
          <p className="text-gray-400 mt-1">
            View and manage customer information
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading customers...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 border border-border text-center">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {search ? 'No customers found' : 'No customers yet'}
          </h3>
          <p className="text-gray-400">
            {search
              ? 'Try a different search term'
              : 'Customers will appear here after they complete the chat'}
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Referral
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-border last:border-0 hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{customer.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.hasPurchased ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Purchased
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded-full">
                        <Clock className="w-3 h-3" />
                        Lead
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {customer.affiliateCode ? (
                      <code className="px-2 py-1 bg-background rounded text-accent text-xs">
                        {customer.affiliateCode}
                      </code>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/admin/customers/${customer.id}`}
                      className="inline-flex items-center gap-1 text-accent hover:text-accent-hover text-sm font-medium transition-colors"
                    >
                      View
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
