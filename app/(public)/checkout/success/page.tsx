'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, Home, FileText, AlertCircle } from 'lucide-react'

interface MealPlan {
  id: string
  status: 'generating' | 'ready' | 'failed'
  planContent?: any
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [error, setError] = useState('')
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session')
      setLoading(false)
      return
    }

    // Poll for meal plan status
    const checkMealPlan = async () => {
      try {
        const response = await fetch(`/api/meal-plan/status?session_id=${sessionId}`)
        const data = await response.json()

        if (data.mealPlan) {
          setMealPlan(data.mealPlan)
          if (data.mealPlan.status === 'ready' || data.mealPlan.status === 'failed') {
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Error checking meal plan status:', err)
      }
    }

    checkMealPlan()

    // Poll every 3 seconds for up to 2 minutes
    const interval = setInterval(() => {
      setPollCount((prev) => {
        if (prev >= 40) {
          // 40 * 3 = 120 seconds = 2 minutes
          clearInterval(interval)
          setLoading(false)
          return prev
        }
        checkMealPlan()
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [sessionId])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12 pt-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-400">
            Thank you for your purchase. Your custom meal plan is being prepared.
          </p>
        </div>

        {/* Meal Plan Status */}
        <div className="bg-surface rounded-2xl p-8 border border-border">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                Generating Your Meal Plan...
              </h2>
              <p className="text-gray-400">
                Our AI is creating your personalized 7-day meal plan based on your
                goals and preferences. This usually takes about 30 seconds.
              </p>
              <div className="mt-6 w-full max-w-xs mx-auto bg-background rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${Math.min(pollCount * 2.5, 100)}%` }}
                />
              </div>
            </div>
          ) : mealPlan?.status === 'ready' && mealPlan.planContent ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-white">Your Meal Plan</h2>
              </div>

              {/* Render meal plan content */}
              <div className="space-y-6">
                {/* Overview */}
                {mealPlan.planContent.overview && (
                  <div className="bg-background rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-white mb-3">Overview</h3>
                    <p className="text-gray-300">{mealPlan.planContent.overview}</p>
                    {mealPlan.planContent.dailyTargets && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-3 bg-surface rounded-lg">
                          <div className="text-2xl font-bold text-accent">
                            {mealPlan.planContent.dailyTargets.calories}
                          </div>
                          <div className="text-xs text-gray-500">Calories/day</div>
                        </div>
                        <div className="text-center p-3 bg-surface rounded-lg">
                          <div className="text-2xl font-bold text-accent">
                            {mealPlan.planContent.dailyTargets.protein}g
                          </div>
                          <div className="text-xs text-gray-500">Protein</div>
                        </div>
                        <div className="text-center p-3 bg-surface rounded-lg">
                          <div className="text-2xl font-bold text-accent">
                            {mealPlan.planContent.dailyTargets.carbs}g
                          </div>
                          <div className="text-xs text-gray-500">Carbs</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Weekly Meals */}
                {mealPlan.planContent.weeklyMeals && (
                  <div>
                    <h3 className="font-semibold text-white mb-4">Weekly Meal Plan</h3>
                    <div className="space-y-4">
                      {Object.entries(mealPlan.planContent.weeklyMeals).map(
                        ([day, meals]: [string, any]) => (
                          <div
                            key={day}
                            className="bg-background rounded-xl p-6 border border-border"
                          >
                            <h4 className="font-semibold text-accent mb-3 capitalize">
                              {day}
                            </h4>
                            <div className="grid gap-3">
                              {Object.entries(meals).map(([mealType, meal]: [string, any]) => (
                                <div key={mealType} className="flex gap-3">
                                  <span className="text-gray-500 capitalize w-24 flex-shrink-0">
                                    {mealType}:
                                  </span>
                                  <span className="text-gray-300">
                                    {typeof meal === 'string' ? meal : meal.name || meal.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Shopping List */}
                {mealPlan.planContent.shoppingList && (
                  <div className="bg-background rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-white mb-4">Shopping List</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(mealPlan.planContent.shoppingList).map(
                        ([category, items]: [string, any]) => (
                          <div key={category}>
                            <h4 className="text-accent text-sm font-medium mb-2 capitalize">
                              {category}
                            </h4>
                            <ul className="space-y-1">
                              {(Array.isArray(items) ? items : [items]).map(
                                (item: string, i: number) => (
                                  <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                Plan Generation In Progress
              </h2>
              <p className="text-gray-400 mb-6">
                Your meal plan is still being generated. Check your email or come back
                in a few minutes.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
