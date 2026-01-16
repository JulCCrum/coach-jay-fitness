'use client'

import { useState } from 'react'
import ChatWidget from '@/components/ChatWidget'
import {
  User,
  Utensils,
  ClipboardList,
  Calendar,
  Star,
  ArrowRight,
  ChevronDown,
  Target,
  Apple,
  Scale,
  MessageCircle,
  Instagram,
  Menu,
  X
} from 'lucide-react'

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [prefilledMessage, setPrefilledMessage] = useState<string | undefined>(undefined)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const openChatWithBooking = () => {
    setPrefilledMessage("I'd like to book a consultation")
    setIsChatOpen(true)
    // Scroll to chat section
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openChat = () => {
    setIsChatOpen(true)
  }

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">LESSONS NOT</span>
            <span className="text-xl font-black text-accent">LOSSES</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('results')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Results
            </button>
            <a
              href="https://instagram.com/billionaire_jayyyy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>

          <button
            onClick={openChatWithBooking}
            className="hidden md:flex items-center gap-2 bg-accent text-background px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border px-6 py-4 space-y-4">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-gray-400 hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left text-gray-400 hover:text-white transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('results')}
              className="block w-full text-left text-gray-400 hover:text-white transition-colors"
            >
              Results
            </button>
            <a
              href="https://instagram.com/billionaire_jayyyy"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </a>
            <button
              onClick={openChatWithBooking}
              className="flex items-center gap-2 bg-accent text-background px-5 py-2.5 rounded-full font-semibold text-sm"
            >
              <Calendar className="w-4 h-4" />
              Book Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section with Chat */}
      <section id="chat" className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            Custom <span className="text-accent">Meal Plans</span><br />
            Built For You
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            Chat with us to get started on your personalized nutrition journey.
          </p>
          {!isChatOpen && (
            <button
              onClick={openChat}
              className="inline-flex items-center gap-3 bg-accent text-background px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-hover transition-all"
            >
              <MessageCircle className="w-6 h-6" />
              Start Your Consultation
            </button>
          )}
        </div>

        {/* Chat Widget - Centered and Main Focus */}
        <ChatWidget
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          prefilledMessage={prefilledMessage}
          onPrefilledMessageUsed={() => setPrefilledMessage(undefined)}
        />

        {!isChatOpen && (
          <div className="mt-12 flex items-center gap-2 text-gray-500">
            <ChevronDown className="w-5 h-5 animate-bounce" />
            <span className="text-sm">Scroll to learn more</span>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-surface-light to-background rounded-3xl overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-background rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="w-12 h-12 text-accent" />
                    </div>
                    <p className="text-sm">Add Jay's photo here</p>
                    <p className="text-xs text-gray-700 mt-1">public/jay-about.jpg</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Meet <span className="text-accent">Your Coach</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                I believe nutrition is the foundation of every transformation. You can't out-train a bad diet, and that's where I come in.
              </p>
              <p className="text-lg text-gray-500 mb-8">
                I create personalized meal plans that fit your lifestyle, your preferences, and your goals. No cookie-cutter templates — every plan is built specifically for you.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-accent">500+</div>
                  <div className="text-sm text-gray-500">Meal Plans Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-accent">5+</div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-accent">100%</div>
                  <div className="text-sm text-gray-500">Personalized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Getting your custom meal plan is simple. Here's what to expect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="group bg-surface rounded-3xl p-8 border border-border hover:border-accent/50 transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Consultation</h3>
              <p className="text-gray-400 mb-6">
                Start a conversation with me to discuss your goals, dietary preferences, allergies, and lifestyle. The more I know, the better your plan.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" /> Define your goals
                </li>
                <li className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-accent" /> Share your preferences
                </li>
                <li className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-accent" /> Assess current habits
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="group bg-surface rounded-3xl p-8 border border-accent relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-accent text-background text-xs font-bold px-3 py-1 rounded-full">
                CORE SERVICE
              </div>
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Utensils className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. Custom Meal Plan</h3>
              <p className="text-gray-400 mb-6">
                Receive a fully personalized meal plan with recipes, portions, and shopping lists. Everything you need to succeed.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-accent" /> Tailored recipes
                </li>
                <li className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-accent" /> Shopping lists
                </li>
                <li className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-accent" /> Macro breakdowns
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="group bg-surface rounded-3xl p-8 border border-border hover:border-accent/50 transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Ongoing Support</h3>
              <p className="text-gray-400 mb-6">
                I'm here to adjust your plan as you progress. Check-ins, modifications, and guidance whenever you need it.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-accent" /> Regular check-ins
                </li>
                <li className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-accent" /> Plan adjustments
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" /> Progress tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-3xl md:text-4xl font-bold leading-relaxed mb-8">
            "You can't out-train a <span className="text-accent">bad diet</span>. The right nutrition plan is the foundation of every successful transformation."
          </blockquote>
          <cite className="text-gray-500 not-italic">— Coach Jay</cite>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Real People. <span className="text-accent">Real Results.</span>
            </h2>
            <p className="text-xl text-gray-500">
              See what clients are saying about their custom meal plans.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-surface rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-400 mb-6">
                "The meal plan Jay created for me was a game-changer. It fit my schedule, my taste preferences, and I actually enjoy eating healthy now. Down 25 lbs and feeling amazing."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold">Marcus T.</div>
                  <div className="text-sm text-gray-500">Lost 25 lbs</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-400 mb-6">
                "I've tried so many diets before but nothing stuck. Jay's approach is different — it's sustainable. The recipes are easy and I never feel like I'm missing out."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold">Ashley R.</div>
                  <div className="text-sm text-gray-500">Sustainable Results</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-gray-400 mb-6">
                "As someone with dietary restrictions, I was skeptical. But Jay worked around everything and gave me a plan that actually works. Best investment I've made."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold">David K.</div>
                  <div className="text-sm text-gray-500">Custom Dietary Plan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to <span className="text-accent">Transform?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start a conversation and let's build your personalized meal plan. No pressure — just a real conversation about your goals.
          </p>

          <button
            onClick={openChatWithBooking}
            className="inline-flex items-center gap-3 bg-accent text-background px-10 py-5 rounded-full font-bold text-xl hover:bg-accent-hover transition-all"
          >
            <Calendar className="w-6 h-6" />
            Book Your Consultation
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white">LESSONS NOT</span>
              <span className="text-lg font-black text-accent">LOSSES</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/billionaire_jayyyy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              <button
                onClick={openChatWithBooking}
                className="text-gray-400 hover:text-accent transition-colors"
              >
                Book Now
              </button>
            </div>

            <p className="text-sm text-gray-600">
              © 2024 Lessons Not Losses Fitness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
