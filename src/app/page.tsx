"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ─── Star particles for hero ─── */
function StarField() {
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Scroll-reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Navigation ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "The Book", href: "#book" },
    { label: "About Mémère", href: "#author" },
    { label: "Trailer", href: "#trailer" },
  ];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    },
    []
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#home"
          onClick={(e) => handleClick(e, "#home")}
          className={`text-lg font-semibold tracking-wide transition-colors duration-300 ${
            scrolled ? "text-plum" : "text-white"
          }`}
        >
          The Dancing Queen
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`text-sm font-medium transition-colors duration-300 hover:text-golden ${
                scrolled ? "text-foreground/70" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled ? "bg-plum" : "bg-white"
            } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled ? "bg-plum" : "bg-white"
            } ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${
              scrolled ? "bg-plum" : "bg-white"
            } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-lavender-soft shadow-lg">
          <div className="flex flex-col px-6 py-4 gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-foreground/80 text-base font-medium py-2 hover:text-plum transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Start unmuted, then attempt to unmute after first user gesture
    video.muted = false;
    video.play().catch(() => {
      // Browser blocked autoplay without mute — fall back to muted
      video.muted = true;
      setIsMuted(true);
      // Retry unmute on first interaction
      const unmuteOnInteraction = () => {
        video.muted = false;
        setIsMuted(false);
        document.removeEventListener("click", unmuteOnInteraction);
        document.removeEventListener("touchstart", unmuteOnInteraction);
      };
      document.addEventListener("click", unmuteOnInteraction, { once: true });
      document.addEventListener("touchstart", unmuteOnInteraction, { once: true });
    });
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ─── Full-bleed background video ─── */}
      <video
        ref={videoRef}
        src="/trailer.mp4"
        autoPlay
        loop
        muted={false}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay so text stays readable */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(160deg, rgba(74,40,72,0.72) 0%, rgba(107,58,107,0.55) 30%, rgba(155,122,138,0.40) 60%, rgba(212,168,83,0.50) 100%)",
        }}
      />

      <StarField />

      {/* Decorative floating circles */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute w-64 h-64 rounded-full opacity-10 animate-drift"
          style={{ background: "radial-gradient(circle, #F0D68A 0%, transparent 70%)", top: "10%", left: "-5%" }}
        />
        <div
          className="absolute w-48 h-48 rounded-full opacity-10 animate-drift"
          style={{ background: "radial-gradient(circle, #E8DCF0 0%, transparent 70%)", bottom: "15%", right: "-3%", animationDelay: "3s" }}
        />
        <div
          className="absolute w-32 h-32 rounded-full opacity-15 animate-drift"
          style={{ background: "radial-gradient(circle, #F5E6D8 0%, transparent 70%)", top: "50%", left: "60%", animationDelay: "5s" }}
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-golden-light/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
          A Bedtime Story by Mémère
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          The Dancing
          <br />
          <span className="text-golden-light">Queen</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          So light and fair, she dances for children everywhere.
          <br />
          <span className="text-white/60 text-base">
            A whimsical tale of a tiny winged guardian who watches over every child&apos;s dreams.
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <Button
            size="lg"
            className="bg-golden hover:bg-golden/90 text-plum-deep font-semibold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() =>
              document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Discover the Story
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-8 py-6 text-base rounded-full backdrop-blur-sm transition-all duration-300"
            onClick={() =>
              document.querySelector("#trailer")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Watch the Trailer
          </Button>
        </div>
      </div>

      {/* ─── Mute / Unmute button ─── */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute bottom-8 right-8 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 hover:scale-110 transition-all duration-300"
      >
        {isMuted ? (
          /* Speaker-off icon */
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          /* Speaker-on icon */
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-8 z-10 animate-float">
        <svg
          className="w-6 h-6 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}

/* ─── Whimsical Divider ─── */
function Divider() {
  return (
    <div className="whimsical-divider" aria-hidden="true">
      <span className="text-golden text-xl">&#10022;</span>
    </div>
  );
}

/* ─── Book Verse Highlight ─── */
function VerseCard({
  text,
  label,
  bg = "bg-white",
  accent = "text-plum",
}: {
  text: string;
  label: string;
  bg?: string;
  accent?: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-6 md:p-8 shadow-sm border border-lavender-soft/50 hover:shadow-md transition-shadow duration-300`}>
      <p className={`text-lg md:text-xl font-medium italic ${accent} leading-relaxed`}>
        &ldquo;{text}&rdquo;
      </p>
      <p className="text-muted-foreground text-sm mt-3">{label}</p>
    </div>
  );
}

/* ─── About the Book Section ─── */
function BookSection() {
  const verses = [
    {
      text: "The Dancing Queen, so light and Fair, dances for children everywhere.",
      label: "Opening lines",
    },
    {
      text: "She'll balance and bounce and swing on a curl, or slide down on a long straight pony tailed girl.",
      label: "The playful spirit",
    },
    {
      text: "She prefers soft noises and the songs of the night.",
      label: "As evening falls",
    },
    {
      text: "Your night dreams are special and guarded with care.",
      label: "Her promise",
    },
  ];

  const features = [
    {
      icon: "🌙",
      title: "Bedtime Ritual",
      description:
        "The story mirrors a real bedtime routine — from daytime energy and play through a gentle dusk transition to a calm, safe nighttime resolution. Each reading becomes part of a child's own winding-down ritual, helping ease the shift from busy day to peaceful sleep.",
    },
    {
      icon: "🧚",
      title: "Guardian Fairy Mythology",
      description:
        "The Dancing Queen introduces an entirely new piece of children's mythology — a tiny, winged, fairy-like being who lives in a child's hair, dances on curls and ponytails, and stands watch over their pillow as they sleep. She is the child's own personal guardian of dreams.",
    },
    {
      icon: "🎨",
      title: "A Day-to-Night Color Journey",
      description:
        "The illustrations carry the reader through a breathtaking visual arc: warm cream and blush tones in the opening spreads give way to bright forest greens and golden hues for daytime backyard play, then gradually crossfade into lavender and deep plum as night falls — the art itself tells the story of the day ending.",
    },
    {
      icon: "📖",
      title: "Rhyming Verse, Read Aloud",
      description:
        "Written in a light, musical rhyming style meant to be read aloud by a parent or grandparent at bedtime. The verse has a natural, bouncing rhythm that holds the attention of young listeners while carrying them gently toward sleep.",
    },
    {
      icon: "👶",
      title: "Ages 2 to 6",
      description:
        "Designed for the youngest readers and listeners — children aged roughly two to six who still look for a little magic before saying good night. The simple, repeating rhythms and warm, reassuring message make it perfect for the bedtime crowd.",
    },
    {
      icon: "💝",
      title: "A Grandmother's Gift",
      description:
        "Written by Mémère — a grandmother — and dedicated to her grandsons George and Myles, whom she lovingly calls \"Critter and Bug.\" The book closes with a dedication \"To Every Child\" who believes in tiny wonders, extending this grandmother's love to families everywhere.",
    },
  ];

  return (
    <section
      id="book"
      className="py-20 md:py-28 px-6"
      style={{
        background: "linear-gradient(180deg, #FFF8F0 0%, #F5E6D8 50%, #FFF8F0 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <div className="text-center mb-16">
            <p className="text-golden font-medium tracking-[0.2em] uppercase text-sm mb-3">
              The Story
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-plum mb-6">
              About the Book
            </h2>
            <div className="w-20 h-1 bg-golden rounded-full mx-auto mb-8" />
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              The Dancing Queen invents a new piece of children&apos;s mythology — a tiny, 
              light, fairy-like being with wings who lives in a child&apos;s hair. By day she plays 
              in backyards, dances on curls and ponytails, and shyly watches children at play. 
              As evening falls, she grows quiet, tucks her wings in close, and stands guard 
              over their dreams until morning.
            </p>
          </div>
        </RevealSection>

        {/* Verses */}
        <RevealSection delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {verses.map((v) => (
              <VerseCard key={v.label} text={v.text} label={v.label} />
            ))}
          </div>
        </RevealSection>

        <Divider />

        {/* Features grid */}
        <RevealSection delay={200}>
          <div className="text-center mt-12 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold text-plum mb-4">
              What Makes This Book Special
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every detail — from the rhyming verse to the shifting color palette — is crafted to create a bedtime experience children will ask for night after night.
            </p>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <RevealSection key={f.title} delay={i * 100}>
              <div className="bg-white rounded-2xl p-6 md:p-8 h-full border border-lavender-soft/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h4 className="text-lg font-semibold text-plum mb-3">{f.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Book specs */}
        <RevealSection delay={300}>
          <div className="mt-20 bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-lavender-soft/40">
            <h3 className="text-xl font-semibold text-plum mb-6 text-center">Book Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Format", value: "Picture Book" },
                { label: "Pages", value: "32 pages" },
                { label: "Trim", value: '8.75" x 8.75"' },
                { label: "Ages", value: "2 – 6" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-wider text-golden font-medium mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold text-plum">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── Author Section ─── */
function AuthorSection() {
  return (
    <section
      id="author"
      className="py-20 md:py-28 px-6"
      style={{
        background: "linear-gradient(180deg, #F5E6D8 0%, #E8DCF0 50%, #F5E6D8 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <div className="text-center mb-16">
            <p className="text-golden font-medium tracking-[0.2em] uppercase text-sm mb-3">
              The Author
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-plum mb-6">
              About Mémère
            </h2>
            <div className="w-20 h-1 bg-golden rounded-full mx-auto" />
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Author photo */}
          <RevealSection>
            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white/80">
                <Image
                  src="/author-image.png"
                  alt="Mémère — author of The Dancing Queen"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-golden/30 scale-110 animate-pulse-soft"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 rounded-full border border-lavender/20 scale-125 animate-pulse-soft"
                style={{ animationDelay: "1.5s" }}
                aria-hidden="true"
              />
            </div>
          </RevealSection>

          {/* Author text */}
          <RevealSection delay={200}>
            <div>
              <blockquote className="text-2xl md:text-3xl font-medium italic text-plum leading-relaxed mb-8">
                &ldquo;For George and Myles, my grandsons, who fill my heart with feelings 
                I&apos;ve never had to explore before.&rdquo;
              </blockquote>
              <Separator className="bg-golden/30 mb-8" />
              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  Known to her grandsons as <span className="text-plum font-medium">Mémère</span> — the French 
                  word for grandmother — the author wrote <em>The Dancing Queen</em> as a bedtime gift for 
                  George and Myles, whom she affectionately calls &ldquo;Critter and Bug.&rdquo; What began 
                  as a personal lullaby for two beloved little boys grew into a story she wanted to share 
                  with every child who still looks for a little magic before saying good night.
                </p>
                <p>
                  In her dedication, Mémère writes about a love that has no words — the love for a mother 
                  and father, the love that completes your life, the love that explodes your heart when you 
                  hold your newborn child. But she reserves her most awe-filled words for grandchildren: 
                  <em>&ldquo;the feeling of watching your daughter grow with child, or cry some of the 
                  happiest tears of your life when you hold that new little life… and think… a part of me 
                  made this possible!&rdquo;</em>
                </p>
                <p>
                  This book is that feeling, distilled into verse and illustration — a grandmother&apos;s 
                  love letter to the wonder of childhood, and to the tiny guardians who watch over 
                  our children&apos;s dreams.
                </p>
              </div>
              <div className="mt-8">
                <p className="text-plum font-semibold text-lg">
                  &ldquo;Love you to the moon and back&rdquo;
                </p>
                <p className="text-golden font-medium">— Mémère</p>
              </div>
            </div>
          </RevealSection>
        </div>

        {/* Color arc showcase */}
        <RevealSection delay={300}>
          <div className="mt-20">
            <h3 className="text-xl font-semibold text-plum mb-6 text-center">
              The Day-to-Night Color Journey
            </h3>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              The illustrations carry readers through a breathtaking visual arc — from the warm cream 
              and blush tones of morning, through bright greens and golds of backyard play, into 
              lavender dusk, and finally to the deep plum and violet of the pillow and dreams.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                { color: "#FFF8F0", label: "Cream", phase: "Morning" },
                { color: "#F5E6D8", label: "Blush", phase: "Opening" },
                { color: "#6B7B3A", label: "Olive", phase: "Daytime" },
                { color: "#D4A853", label: "Gold", phase: "Midday" },
                { color: "#8B6B4A", label: "Warm Brown", phase: "Afternoon" },
                { color: "#C8B4D8", label: "Lavender", phase: "Dusk" },
                { color: "#9B7A8A", label: "Mauve", phase: "Twilight" },
                { color: "#6B3A6B", label: "Plum", phase: "Night" },
                { color: "#4A2848", label: "Deep Plum", phase: "Dreams" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col items-center gap-2 group cursor-default"
                >
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md border-2 border-white/60 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: c.color }}
                    title={`${c.label} — ${c.phase}`}
                  />
                  <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
                  <span className="text-[10px] text-golden uppercase tracking-wider">{c.phase}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── Trailer Section ─── */
function TrailerSection() {
  return (
    <section
      id="trailer"
      className="py-20 md:py-28 px-6"
      style={{
        background: "linear-gradient(180deg, #FFF8F0 0%, #F5E6D8 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <RevealSection>
          <div className="text-center mb-12">
            <p className="text-golden font-medium tracking-[0.2em] uppercase text-sm mb-3">
              Sneak Peek
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-plum mb-6">
              Book Trailer
            </h2>
            <div className="w-20 h-1 bg-golden rounded-full mx-auto mb-8" />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Watch the Dancing Queen come to life — from sunlit backyard dances 
              to the quiet magic of a child&apos;s pillow at night. A warm, unhurried 
              journey through the pages of this bedtime story.
            </p>
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-lavender-soft/50">
            <video
              controls
              preload="metadata"
              poster=""
              className="w-full aspect-video bg-plum-deep"
              playsInline
            >
              <source src="/trailer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </RevealSection>

        <RevealSection delay={300}>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground text-sm italic">
              The trailer follows the book&apos;s day-to-night arc: sunlit backyard play gives way 
              to lavender dusk, then deep plum nighttime warmth — with the Dancing Queen 
              tucking her wings and standing guard over every child&apos;s dreams.
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── Closing CTA Section ─── */
function CTASection() {
  return (
    <section
      className="py-20 md:py-28 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #4A2848 0%, #6B3A6B 40%, #9B7A8A 100%)",
      }}
    >
      <StarField />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <RevealSection>
          <p className="text-golden-light/70 text-sm tracking-[0.2em] uppercase mb-4">
            For Every Child
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Every Child Deserves
            <br />
            <span className="text-golden-light">a Little Magic</span>
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            The Dancing Queen is more than a bedtime story — it is a grandmother&apos;s 
            love letter to the wonder of childhood, and to the tiny guardians who watch 
            over our children&apos;s dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-golden hover:bg-golden/90 text-plum-deep font-semibold px-10 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get the Book
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-10 py-6 text-base rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Contact Mémère
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-12 italic">
            &ldquo;To Every Child who believes in tiny wonders…&rdquo;
          </p>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-plum-deep text-white/60 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">The Dancing Queen</h4>
            <p className="text-sm leading-relaxed">
              A whimsical bedtime picture book by Mémère. Dedicated to George and Myles — 
              and to every child who still looks for a little magic before saying good night.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "#home" },
                { label: "About the Book", href: "#book" },
                { label: "About Mémère", href: "#author" },
                { label: "Book Trailer", href: "#trailer" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-golden transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-3">Connect</h4>
            <p className="text-sm leading-relaxed mb-4">
              For inquiries, press copies, or to share what The Dancing Queen means to your family.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/40 rounded-full text-sm"
            >
              Get in Touch
            </Button>
          </div>
        </div>
        <Separator className="bg-white/10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} The Dancing Queen. All Rights Reserved.</p>
          <p>
            Written with love by{" "}
            <span className="text-golden/60">Mémère</span> for George and Myles
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <HeroSection />
        <BookSection />
        <AuthorSection />
        <TrailerSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}