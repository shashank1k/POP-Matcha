import MatchaCanvas from "@/components/MatchaCanvas";

export default function Home() {
  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#050505]">
      {/* Navigation */}
      <nav
        suppressHydrationWarning
        className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#050505]/80 px-8 py-4 backdrop-blur-md border-b border-white/5"
      >
        <div className="text-2xl font-black tracking-tighter text-white">
          POP <span className="text-[#98FF98]">MATCHA</span>
        </div>
        <div className="hidden space-x-8 text-xs font-bold uppercase tracking-widest text-white/60 md:flex">
          <a
            href="#benefits"
            className="transition-colors hover:text-[#98FF98]"
          >
            Benefits
          </a>
          <a
            href="#ingredients"
            className="transition-colors hover:text-[#98FF98]"
          >
            Ingredients
          </a>
          <a href="#reviews" className="transition-colors hover:text-[#98FF98]">
            Reviews
          </a>
          <a href="#hero" className="transition-colors hover:text-[#98FF98]">
            Shop
          </a>
        </div>
        <button
          suppressHydrationWarning
          className="rounded-full border border-white/20 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-[#98FF98] hover:text-[#98FF98]"
        >
          Account
        </button>
      </nav>

      {/* Main Scrollytelling Canvas */}
      <MatchaCanvas />

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 bg-[#050505] px-8 py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-20 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
            Why <span className="text-[#98FF98]">Pop Matcha?</span>
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                title: "Clean Energy",
                desc: "L-Theanine provides a steady release of caffeine for 4-6 hours of focused energy without the jitters.",
                icon: "⚡",
              },
              {
                title: "Antioxidant Power",
                desc: "Packed with EGCG catechins that support metabolism and cellular health more than green tea.",
                icon: "🌿",
              },
              {
                title: "Mental Clarity",
                desc: "Enhances alpha brain waves to promote a state of relaxed alertness and improved cognitive function.",
                icon: "🧠",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group rounded-3xl border border-white/5 bg-white/5 p-10 transition-all hover:border-[#98FF98]/30 hover:bg-white/10"
              >
                <div className="mb-6 text-4xl">{benefit.icon}</div>
                <h3 className="mb-4 text-2xl font-bold uppercase tracking-tight text-[#98FF98]">
                  {benefit.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section
        id="ingredients"
        className="relative z-10 border-y border-white/5 bg-[#080808] px-8 py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <h2 className="mb-8 text-5xl font-black uppercase tracking-tighter md:text-7xl">
                Ceremonial <br />
                <span className="text-[#98FF98]">Grade Only.</span>
              </h2>
              <p className="mb-8 text-lg text-white/60 leading-relaxed">
                We source our matcha exclusively from Uji, Japan. Stone-ground
                and vibrant green, our ceremonial grade matcha is the highest
                quality available, ensuring a smooth, non-bitter taste in every
                pop.
              </p>
              <ul className="space-y-4">
                {[
                  "100% Organic Matcha",
                  "Pure Spring Water",
                  "Zero Added Sugar",
                  "Natural Fruit Essence",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 text-sm font-bold uppercase tracking-widest text-white/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#98FF98] text-[10px] text-black">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[3rem] border border-white/10 bg-white/5">
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 grayscale">
                🍃
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="mb-4 text-6xl font-black text-[#98FF98]">
                  137x
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/40">
                  More antioxidants than regular green tea
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="relative z-10 bg-[#050505] px-8 py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-20 text-center text-5xl font-black uppercase tracking-tighter md:text-7xl">
            The <span className="text-[#98FF98]">Buzz.</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Alex R.",
                text: "Finally, a matcha drink that actually tastes like real matcha. No weird aftertaste, just pure energy.",
                rating: 5,
              },
              {
                name: "Sarah K.",
                text: "I replaced my morning coffee with Pop Matcha and I've never felt better. No afternoon crash anymore!",
                rating: 5,
              },
              {
                name: "Marcus L.",
                text: "The convenience of a can combined with ceremonial grade quality is a game changer for my commute.",
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/5 bg-white/5 p-8"
              >
                <div className="mb-4 flex text-[#98FF98]">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="mb-6 italic text-white/80">
                  &quot;{review.text}&quot;
                </p>
                <div className="text-xs font-bold uppercase tracking-widest text-[#98FF98]">
                  — {review.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        suppressHydrationWarning
        className="relative z-10 bg-[#050505] px-8 py-24 text-center"
      >
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-8 text-4xl font-black uppercase tracking-tighter md:text-6xl">
            Join the <span className="text-[#98FF98]">Matcha</span> Revolution
          </h3>
          <p className="mb-12 text-lg text-white/60">
            Experience clean energy without the jitters. Sustainably sourced,
            ceremonial grade matcha in a convenient pop-top can.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <input
              suppressHydrationWarning
              type="email"
              placeholder="Enter your email"
              className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-6 py-4 text-white outline-none focus:border-[#98FF98]"
            />
            <button
              suppressHydrationWarning
              className="w-full max-w-xs rounded-full bg-[#98FF98] px-8 py-4 font-bold uppercase tracking-widest text-black transition-transform hover:scale-105 sm:w-auto"
            >
              Subscribe
            </button>
          </div>
          <div className="mt-24 flex flex-col items-center justify-between border-t border-white/10 pt-12 text-xs font-bold uppercase tracking-widest text-white/40 md:flex-row">
            <div>© 2026 POP MATCHA. All rights reserved.</div>
            <div className="mt-4 flex space-x-8 md:mt-0">
              <a href="#" className="hover:text-[#98FF98]">
                Privacy
              </a>
              <a href="#" className="hover:text-[#98FF98]">
                Terms
              </a>
              <a href="#" className="hover:text-[#98FF98]">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
