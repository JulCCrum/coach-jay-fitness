'use client'

import { useEffect, useState, use } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import TemplateForm from '@/components/admin/TemplateForm'

interface TemplateData {
  id: string
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

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [template, setTemplate] = useState<TemplateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const response = await fetch(`/api/admin/templates/${id}`)
        if (!response.ok) {
          throw new Error('Template not found')
        }
        const data = await response.json()
        setTemplate(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplate()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error || 'Template not found'}</p>
        <a
          href="/admin/templates"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <a
          href="/admin/templates"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </a>
        <h1 className="text-3xl font-black text-white">Edit Template</h1>
        <p className="text-gray-400 mt-1">Update the meal plan template details</p>
      </div>

      <TemplateForm initialData={template} isEditing />
    </div>
  )
}
