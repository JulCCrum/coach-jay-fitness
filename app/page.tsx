import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">COACH</span>
            <span className="text-2xl font-black text-accent">JAY</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#programs" className="text-sm text-gray-400 hover:text-white transition-colors">Programs</a>
            <a href="#results" className="text-sm text-gray-400 hover:text-white transition-colors">Results</a>
            <a
              href="https://instagram.com/billionaire_jayyyy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
          <a
            href="#book"
            className="bg-accent text-background px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-surface px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400">Gymshark Athlete • Code: JAYYY</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Train Like a<br />
              <span className="text-accent">Fighter.</span><br />
              Live Like a<br />
              <span className="text-accent">King.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-lg">
              Boxing • Functional Training • Strength & Conditioning<br />
              <span className="text-gray-500">Miami & Arizona</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#book"
                className="inline-flex items-center justify-center gap-2 bg-accent text-background px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-hover transition-all glow-accent"
              >
                Start Your Journey
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="https://instagram.com/billionaire_jayyyy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border text-white px-8 py-4 rounded-full font-semibold hover:bg-surface transition-colors"
              >
                @billionaire_jayyyy
              </a>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[3/4] bg-gradient-to-br from-surface to-surface-light rounded-3xl overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <div className="w-32 h-32 bg-surface-light rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-5xl">💪</span>
                  </div>
                  <p className="text-sm">Add Jay's photo here</p>
                  <p className="text-xs text-gray-700 mt-1">public/jay-hero.jpg</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-surface border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-background font-bold">
                  10K+
                </div>
                <div>
                  <p className="text-white font-semibold">Followers</p>
                  <p className="text-xs text-gray-500">& Growing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                      <span className="text-4xl">🥊</span>
                    </div>
                    <p className="text-sm">Add Jay's photo here</p>
                    <p className="text-xs text-gray-700 mt-1">public/jay-about.jpg</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-background px-6 py-3 rounded-2xl font-bold">
                Billionaire Mindset
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Meet <span className="text-accent">Coach Jay</span>
              </h2>
              <p className="text-xl text-gray-400 mb-6 leading-relaxed">
                I'm not just a coach — I'm proof that discipline changes everything. From boxing rings in Miami to building multiple businesses, I've learned that the body follows the mind.
              </p>
              <p className="text-lg text-gray-500 mb-8">
                When you train with me, you're not just getting workouts — you're getting a blueprint for winning at life. No excuses, just results.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-accent">500+</div>
                  <div className="text-sm text-gray-500">Clients Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-accent">5+</div>
                  <div className="text-sm text-gray-500">Years Coaching</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-accent">100%</div>
                  <div className="text-sm text-gray-500">Commitment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Training <span className="text-accent">Programs</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Whether you're just starting out or ready to compete, I've got a program that fits your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="group bg-surface rounded-3xl p-8 border border-border hover:border-accent/50 transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">1-on-1 Coaching</h3>
              <p className="text-gray-400 mb-6">
                Custom training built around YOUR goals, YOUR schedule, YOUR life. Weekly check-ins, form corrections, and real accountability.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Personalized workout plans
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Weekly video check-ins
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> 24/7 text support
                </li>
              </ul>
              <a href="#book" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                Get Started <span>→</span>
              </a>
            </div>

            {/* Program 2 */}
            <div className="group bg-surface rounded-3xl p-8 border border-accent relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-accent text-background text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <span className="text-3xl">🥊</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Boxing & Muay Thai</h3>
              <p className="text-gray-400 mb-6">
                Learn to move like a fighter. Build explosive power, razor-sharp reflexes, and unshakeable confidence.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Striking fundamentals
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Conditioning & footwork
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Pad work & sparring
                </li>
              </ul>
              <a href="#book" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                Get Started <span>→</span>
              </a>
            </div>

            {/* Program 3 */}
            <div className="group bg-surface rounded-3xl p-8 border border-border hover:border-accent/50 transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Online Programs</h3>
              <p className="text-gray-400 mb-6">
                Can't train in person? No problem. Get my complete workout systems delivered to your phone. Real programming, real results.
              </p>
              <ul className="space-y-2 mb-8 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Video exercise library
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Progressive programs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">✓</span> Train anywhere
                </li>
              </ul>
              <a href="#book" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                Get Started <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mindset Quote Section */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="text-8xl text-accent/20 font-serif">"</span>
          <blockquote className="text-3xl md:text-4xl font-bold leading-relaxed -mt-12 mb-8">
            The Billionaire Mindset isn't about money — it's about{' '}
            <span className="text-accent">never settling</span>, always growing, and building an{' '}
            <span className="text-accent">empire</span> out of yourself.
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
              Don't just take my word for it — see what the team has to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-surface rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent">★</span>
                ))}
              </div>
              <p className="text-gray-400 mb-6">
                "Jay doesn't just train you — he transforms your whole mindset. Lost 30 lbs and gained confidence I never knew I had. The accountability is real."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center text-xl">
                  M
                </div>
                <div>
                  <div className="font-semibold">Marcus T.</div>
                  <div className="text-sm text-gray-500">Lost 30 lbs</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-surface rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent">★</span>
                ))}
              </div>
              <p className="text-gray-400 mb-6">
                "The boxing training is unreal. I came in with zero experience and now I feel like I can actually defend myself. Plus the workouts are addictive."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center text-xl">
                  A
                </div>
                <div>
                  <div className="font-semibold">Ashley R.</div>
                  <div className="text-sm text-gray-500">Boxing Student</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-surface rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-accent">★</span>
                ))}
              </div>
              <p className="text-gray-400 mb-6">
                "Best investment I've made in myself. Jay keeps it real, pushes you hard, but makes you believe you can do it. Results speak for themselves."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-light rounded-full flex items-center justify-center text-xl">
                  D
                </div>
                <div>
                  <div className="font-semibold">David K.</div>
                  <div className="text-sm text-gray-500">Gained 15 lbs muscle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="book" className="py-24 bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to <span className="text-accent">Level Up?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Book your free consultation and let's build your game plan. No pressure, no BS — just a real conversation about your goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-background px-10 py-5 rounded-full font-bold text-xl hover:bg-accent-hover transition-all glow-accent"
            >
              Book Free Consultation
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <p className="text-sm text-gray-600">
            Use code <span className="text-accent font-bold">JAYYY</span> for 10% off at Gymshark
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">COACH</span>
              <span className="text-xl font-black text-accent">JAY</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/billionaire_jayyyy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://gymshark.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-accent transition-colors"
              >
                Gymshark
              </a>
              <a href="#book" className="text-gray-400 hover:text-accent transition-colors">
                Book Now
              </a>
            </div>

            <p className="text-sm text-gray-600">
              © 2024 Coach Jay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  )
}
