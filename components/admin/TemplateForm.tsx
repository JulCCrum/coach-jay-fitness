'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, Loader2 } from 'lucide-react'

interface TemplateData {
  id?: string
  name: string
  customerType: string
  description: string
  calorieRange: {
    min: number
    max: number
  }
  macroSplit: {
    protein: number
    carbs: number
    fat: number
  }
  mealsPerDay: number
  guidelines: string
  sampleMeals: string
  isActive: boolean
}

interface TemplateFormProps {
  initialData?: TemplateData
  isEditing?: boolean
}

const CUSTOMER_TYPES = [
  { value: 'weight-loss-sedentary', label: 'Weight Loss - Sedentary' },
  { value: 'weight-loss-active', label: 'Weight Loss - Active' },
  { value: 'weight-loss-athlete', label: 'Weight Loss - Athlete' },
  { value: 'muscle-gain-beginner', label: 'Muscle Gain - Beginner' },
  { value: 'muscle-gain-intermediate', label: 'Muscle Gain - Intermediate' },
  { value: 'muscle-gain-advanced', label: 'Muscle Gain - Advanced' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'busy-professional', label: 'Busy Professional' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'low-carb', label: 'Low Carb' },
]

const defaultData: TemplateData = {
  name: '',
  customerType: '',
  description: '',
  calorieRange: { min: 1500, max: 2500 },
  macroSplit: { protein: 30, carbs: 40, fat: 30 },
  mealsPerDay: 3,
  guidelines: '',
  sampleMeals: '',
  isActive: true,
}

export default function TemplateForm({ initialData, isEditing }: TemplateFormProps) {
  const router = useRouter()
  const [data, setData] = useState<TemplateData>(initialData || defaultData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const macroTotal = data.macroSplit.protein + data.macroSplit.carbs + data.macroSplit.fat

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isEditing
        ? `/api/admin/templates/${data.id}`
        : '/api/admin/templates'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save template')
      }

      router.push('/admin/templates')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-bold text-white mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Template Name *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., Weight Loss - Active Lifestyle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer Type *
            </label>
            <select
              value={data.customerType}
              onChange={(e) => setData({ ...data, customerType: e.target.value })}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value="">Select type...</option>
              {CUSTOMER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              placeholder="Brief description of who this template is for..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={data.isActive}
              onChange={(e) => setData({ ...data, isActive: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-background text-accent focus:ring-accent"
            />
            <label htmlFor="isActive" className="text-gray-300">
              Template is active
            </label>
          </div>
        </div>
      </div>

      {/* Nutrition Targets */}
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-bold text-white mb-6">Nutrition Targets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Calories
            </label>
            <input
              type="number"
              value={data.calorieRange.min}
              onChange={(e) =>
                setData({
                  ...data,
                  calorieRange: { ...data.calorieRange, min: parseInt(e.target.value) || 0 },
                })
              }
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Calories
            </label>
            <input
              type="number"
              value={data.calorieRange.max}
              onChange={(e) =>
                setData({
                  ...data,
                  calorieRange: { ...data.calorieRange, max: parseInt(e.target.value) || 0 },
                })
              }
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meals Per Day
            </label>
            <select
              value={data.mealsPerDay}
              onChange={(e) => setData({ ...data, mealsPerDay: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              <option value={2}>2 meals</option>
              <option value={3}>3 meals</option>
              <option value={4}>4 meals</option>
              <option value={5}>5 meals</option>
              <option value={6}>6 meals</option>
            </select>
          </div>
        </div>

        {/* Macro Split */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-300">Macro Split (%)</h3>
            <span
              className={`text-sm ${
                Math.abs(macroTotal - 100) > 1 ? 'text-red-400' : 'text-green-400'
              }`}
            >
              Total: {macroTotal}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Protein</label>
              <input
                type="number"
                min={0}
                max={100}
                value={data.macroSplit.protein}
                onChange={(e) =>
                  setData({
                    ...data,
                    macroSplit: { ...data.macroSplit, protein: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Carbs</label>
              <input
                type="number"
                min={0}
                max={100}
                value={data.macroSplit.carbs}
                onChange={(e) =>
                  setData({
                    ...data,
                    macroSplit: { ...data.macroSplit, carbs: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Fat</label>
              <input
                type="number"
                min={0}
                max={100}
                value={data.macroSplit.fat}
                onChange={(e) =>
                  setData({
                    ...data,
                    macroSplit: { ...data.macroSplit, fat: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guidelines & Sample Meals */}
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-bold text-white mb-6">Guidelines & Sample Meals</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meal Plan Guidelines
            </label>
            <textarea
              value={data.guidelines}
              onChange={(e) => setData({ ...data, guidelines: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              placeholder="Enter guidelines for AI to follow when generating plans...

Example:
- Focus on high-protein foods
- Include lean meats, fish, and legumes
- Limit processed foods
- Emphasize whole grains"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sample Meals (for AI reference)
            </label>
            <textarea
              value={data.sampleMeals}
              onChange={(e) => setData({ ...data, sampleMeals: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              placeholder="Enter sample meals that represent your style...

Example:
BREAKFAST:
- Scrambled eggs with spinach and whole grain toast (400 cal)
- Greek yogurt parfait with berries and granola (350 cal)

LUNCH:
- Grilled chicken salad with quinoa (450 cal)
- Turkey and avocado wrap (400 cal)"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg font-semibold text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || Math.abs(macroTotal - 100) > 1}
          className="flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {isEditing ? 'Update Template' : 'Create Template'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
