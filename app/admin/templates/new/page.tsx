'use client'

import { ArrowLeft } from 'lucide-react'
import TemplateForm from '@/components/admin/TemplateForm'

export default function NewTemplatePage() {
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
        <h1 className="text-3xl font-black text-white">Create Template</h1>
        <p className="text-gray-400 mt-1">
          Create a new meal plan template for AI-generated plans
        </p>
      </div>

      <TemplateForm />
    </div>
  )
}
