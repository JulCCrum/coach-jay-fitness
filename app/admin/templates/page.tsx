'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, FileText, CheckCircle, XCircle } from 'lucide-react'

interface Template {
  id: string
  name: string
  customerType: string
  description: string
  isActive: boolean
  calorieRange: {
    min: number
    max: number
  }
  mealsPerDay: number
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    try {
      const response = await fetch('/api/admin/templates')
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTemplates(templates.filter((t) => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting template:', error)
    } finally {
      setDeleting(null)
    }
  }

  const formatCustomerType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Meal Plan Templates</h1>
          <p className="text-gray-400 mt-1">
            Create and manage templates for AI-generated meal plans
          </p>
        </div>
        <a
          href="/admin/templates/new"
          className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Template
        </a>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 border border-border text-center">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No templates yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first meal plan template to get started
          </p>
          <a
            href="/admin/templates/new"
            className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Template
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-surface rounded-xl p-6 border border-border hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{template.name}</h3>
                    {template.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded-full">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Type: {formatCustomerType(template.customerType)}</span>
                    <span>
                      Calories: {template.calorieRange.min} - {template.calorieRange.max}
                    </span>
                    <span>Meals/day: {template.mealsPerDay}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <a
                    href={`/admin/templates/${template.id}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(template.id)}
                    disabled={deleting === template.id}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
