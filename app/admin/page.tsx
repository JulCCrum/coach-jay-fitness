'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react'

interface Stats {
  totalRevenue: number
  totalCustomers: number
  totalOrders: number
  pendingPlans: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingPlans: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch customers count
        const customersSnap = await getDocs(collection(db, 'customers'))
        const totalCustomers = customersSnap.size

        // Fetch orders and calculate revenue
        const ordersSnap = await getDocs(
          query(collection(db, 'orders'), where('status', '==', 'paid'))
        )
        const totalOrders = ordersSnap.size
        let totalRevenue = 0
        ordersSnap.forEach((doc) => {
          totalRevenue += doc.data().amount || 0
        })

        // Fetch pending meal plans
        const pendingPlansSnap = await getDocs(
          query(collection(db, 'mealPlans'), where('status', '==', 'generating'))
        )
        const pendingPlans = pendingPlansSnap.size

        setStats({
          totalRevenue: totalRevenue / 100, // Convert cents to dollars
          totalCustomers,
          totalOrders,
          pendingPlans,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Orders',
      value: stats.totalOrders.toString(),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      label: 'Pending Plans',
      value: stats.pendingPlans.toString(),
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back to LNL Fitness Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-surface rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {loading ? '...' : stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/templates/new"
            className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-accent/50 transition-colors"
          >
            <div className="p-2 bg-accent/10 rounded-lg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="font-medium text-white">New Template</div>
              <div className="text-sm text-gray-500">Create meal plan template</div>
            </div>
          </a>

          <a
            href="/admin/affiliates"
            className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-accent/50 transition-colors"
          >
            <div className="p-2 bg-accent/10 rounded-lg">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="font-medium text-white">Manage Affiliates</div>
              <div className="text-sm text-gray-500">Add or edit affiliates</div>
            </div>
          </a>

          <a
            href="/admin/customers"
            className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-accent/50 transition-colors"
          >
            <div className="p-2 bg-accent/10 rounded-lg">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="font-medium text-white">View Customers</div>
              <div className="text-sm text-gray-500">See all customers</div>
            </div>
          </a>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-bold text-white mb-4">Setup Checklist</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
            </div>
            <span>Firebase configured</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-6 h-6 rounded-full border-2 border-border"></div>
            <span>Create meal plan templates</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-6 h-6 rounded-full border-2 border-border"></div>
            <span>Configure Stripe payments</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-6 h-6 rounded-full border-2 border-border"></div>
            <span>Add affiliates</span>
          </div>
        </div>
      </div>
    </div>
  )
}
