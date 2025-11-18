import Hero from './components/Hero'

function App() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <Hero />
      {/* Placeholder for next sections so scroll behavior is visible */}
      <section id="framework" className="relative z-10 bg-[#121212] text-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6 py-32">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Framework
          </h2>
          <p className="text-[#A3A3A3] leading-relaxed max-w-2xl">
            Every pixel serves a purpose. Below the surface, our systems sequence attention, prime emotion, and lower friction to action. Scroll to continue — the interaction itself demonstrates our approach.
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
