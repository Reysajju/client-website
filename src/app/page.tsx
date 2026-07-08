"use client";

import { useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════════
   TYPES & THEME DEFINITIONS
   ═══════════════════════════════════════════════════ */

type PageId = "home" | "book" | "author" | "trailer" | "contact" | "purchase";

interface ColorTheme {
  name: string;
  bg: string; bgAlt: string; fg: string;
  primary: string; primaryFg: string;
  secondary: string; secondaryFg: string;
  accent: string; accentFg: string;
  card: string; cardFg: string;
  muted: string; mutedFg: string;
  border: string;
  heroOverlay: string;
}

const THEMES: Record<string, ColorTheme> = {
  cream:       { name:"Cream",       bg:"#FFF8F0",bgAlt:"#FFF0E0",fg:"#5A4A3A",primary:"#B8862D",primaryFg:"#FFF",secondary:"#F5E6D8",secondaryFg:"#8A6A4A",accent:"#D4A853",accentFg:"#3A2818",card:"#FFFFFF",cardFg:"#5A4A3A",muted:"#F0E4D4",mutedFg:"#9A8A7A",border:"#E0D0C0",heroOverlay:"rgba(90,74,58,0.25)" },
  blush:       { name:"Blush",       bg:"#FFF0EE",bgAlt:"#FFE4E0",fg:"#6A3A3A",primary:"#B85050",primaryFg:"#FFF",secondary:"#FFE4E0",secondaryFg:"#A06060",accent:"#E8845A",accentFg:"#FFF",card:"#FFFFFF",cardFg:"#6A3A3A",muted:"#F5DDDD",mutedFg:"#A08080",border:"#F0CCCC",heroOverlay:"rgba(106,58,58,0.25)" },
  olive:       { name:"Olive",       bg:"#F2F5E8",bgAlt:"#E8EDD8",fg:"#3A4A2A",primary:"#4E6828",primaryFg:"#FFF",secondary:"#E8EDD8",secondaryFg:"#5A7030",accent:"#8BA050",accentFg:"#FFF",card:"#FFFFFF",cardFg:"#3A4A2A",muted:"#E0E8D0",mutedFg:"#7A8A6A",border:"#CDDCB8",heroOverlay:"rgba(58,74,42,0.25)" },
  gold:        { name:"Gold",        bg:"#FFF8E8",bgAlt:"#FFF0D0",fg:"#5A4A2A",primary:"#B89020",primaryFg:"#FFF",secondary:"#FFF0D0",secondaryFg:"#A08030",accent:"#D4A853",accentFg:"#3A2818",card:"#FFFFFF",cardFg:"#5A4A2A",muted:"#F0E8C8",mutedFg:"#9A8A5A",border:"#E0D4A0",heroOverlay:"rgba(90,74,42,0.25)" },
  "warm-brown":{ name:"Warm Brown",  bg:"#F5EDE0",bgAlt:"#EBE0D0",fg:"#4A3A2A",primary:"#6A4A2A",primaryFg:"#FFF",secondary:"#EBE0D0",secondaryFg:"#7A5A3A",accent:"#A08060",accentFg:"#FFF",card:"#FFFFFF",cardFg:"#4A3A2A",muted:"#E4D8C8",mutedFg:"#8A7A6A",border:"#D4C4A8",heroOverlay:"rgba(74,58,42,0.25)" },
  lavender:    { name:"Lavender",    bg:"#F5F0FF",bgAlt:"#ECE4FF",fg:"#4A3A5A",primary:"#7A5AA0",primaryFg:"#FFF",secondary:"#ECE4FF",secondaryFg:"#8A6AAA",accent:"#B090D0",accentFg:"#FFF",card:"#FFFFFF",cardFg:"#4A3A5A",muted:"#E4D8F0",mutedFg:"#8A7A9A",border:"#D0C0E8",heroOverlay:"rgba(74,58,90,0.25)" },
  mauve:       { name:"Mauve",       bg:"#F8F0F5",bgAlt:"#F0E4ED",fg:"#5A3A4A",primary:"#8A5070",primaryFg:"#FFF",secondary:"#F0E4ED",secondaryFg:"#9A6080",accent:"#C090A8",accentFg:"#FFF",card:"#FFFFFF",cardFg:"#5A3A4A",muted:"#ECDDE4",mutedFg:"#9A8090",border:"#DCC0D0",heroOverlay:"rgba(90,58,74,0.25)" },
  plum:        { name:"Plum",        bg:"#F5E8F5",bgAlt:"#EBD8EB",fg:"#4A2A4A",primary:"#6A2A6A",primaryFg:"#FFF",secondary:"#EBD8EB",secondaryFg:"#7A3A7A",accent:"#A060A0",accentFg:"#FFF",card:"#FFFFFF",cardFg:"#4A2A4A",muted:"#E4D0E4",mutedFg:"#8A6A8A",border:"#D0B0D0",heroOverlay:"rgba(74,42,74,0.25)" },
  "deep-plum": { name:"Deep Plum",   bg:"#2A1528",bgAlt:"#351D33",fg:"#E8D8E8",primary:"#C8A0C8",primaryFg:"#2A1528",secondary:"#3A2038",secondaryFg:"#D0B8D0",accent:"#D4A853",accentFg:"#1A0A18",card:"#3A2038",cardFg:"#E8D8E8",muted:"#32202F",mutedFg:"#9A7A9A",border:"#4A2848",heroOverlay:"rgba(42,21,40,0.4)" },
};

const PALETTE = [
  { key:"cream",      color:"#FFF8F0", label:"Cream",     phase:"Morning" },
  { key:"blush",      color:"#F5E6D8", label:"Blush",     phase:"Opening" },
  { key:"olive",      color:"#6B7B3A", label:"Olive",     phase:"Daytime" },
  { key:"gold",       color:"#D4A853", label:"Gold",      phase:"Midday" },
  { key:"warm-brown", color:"#8B6B4A", label:"Warm Brown",phase:"Afternoon"},
  { key:"lavender",   color:"#C8B4D8", label:"Lavender",  phase:"Dusk" },
  { key:"mauve",      color:"#9B7A8A", label:"Mauve",     phase:"Twilight" },
  { key:"plum",       color:"#6B3A6B", label:"Plum",      phase:"Night" },
  { key:"deep-plum",  color:"#4A2848", label:"Deep Plum", phase:"Dreams" },
];

/* ═══════════════════════════════════════════════════
   SHARED DATA
   ═══════════════════════════════════════════════════ */

const VERSES = [
  { text:"The Dancing Queen, so light and Fair, dances for children everywhere.", label:"Opening lines" },
  { text:"She'll balance and bounce and swing on a curl, or slide down on a long straight pony tailed girl.", label:"The playful spirit" },
  { text:"She prefers soft noises and the songs of the night.", label:"As evening falls" },
  { text:"Your night dreams are special and guarded with care.", label:"Her promise" },
];

const FEATURES = [
  { icon:"\uD83C\uDF19", title:"Bedtime Ritual", desc:"The story mirrors a real bedtime routine \u2014 from daytime energy and play through a gentle dusk transition to a calm, safe nighttime resolution. Each reading becomes part of a child\u2019s own winding-down ritual, helping ease the shift from busy day to peaceful sleep." },
  { icon:"\uD83E\uDDDA", title:"Guardian Fairy Mythology", desc:"The Dancing Queen introduces an entirely new piece of children\u2019s mythology \u2014 a tiny, winged, fairy-like being who lives in a child\u2019s hair, dances on curls and ponytails, and stands watch over their pillow as they sleep. She is the child\u2019s own personal guardian of dreams." },
  { icon:"\uD83C\uDFA8", title:"A Day-to-Night Color Journey", desc:"The illustrations carry the reader through a breathtaking visual arc: warm cream and blush tones give way to bright forest greens and golden hues for backyard play, then gradually crossfade into lavender and deep plum as night falls \u2014 the art itself tells the story." },
  { icon:"\uD83D\uDCD6", title:"Rhyming Verse, Read Aloud", desc:"Written in a light, musical rhyming style meant to be read aloud by a parent or grandparent at bedtime. The verse has a natural, bouncing rhythm that holds the attention of young listeners while carrying them gently toward sleep." },
  { icon:"\uD83D\uDC76", title:"Ages 2 to 6", desc:"Designed for the youngest readers and listeners \u2014 children aged roughly two to six who still look for a little magic before saying good night. The simple, repeating rhythms and warm, reassuring message make it perfect for the bedtime crowd." },
  { icon:"\uD83D\uDC9D", title:"A Grandmother\u2019s Gift", desc:"Written by M\u00e9m\u00e8re and dedicated to her grandsons George and Myles, whom she lovingly calls \u201cCritter and Bug.\u201d The book closes with a dedication \u201cTo Every Child\u201d who believes in tiny wonders, extending this grandmother\u2019s love to families everywhere." },
];

/* ═══════════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════════ */

interface ThemeCtxValue {
  theme: ColorTheme;
  themeKey: string;
  setTheme: (key: string) => void;
  navigate: (p: PageId) => void;
  page: PageId;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: THEMES.plum,
  themeKey: "plum",
  setTheme: () => {},
  navigate: () => {},
  page: "home",
});

function useApp() { return useContext(ThemeCtx); }

function applyThemeToDOM(t: ColorTheme) {
  const r = document.documentElement.style;
  r.setProperty("--background", t.bg);
  r.setProperty("--foreground", t.fg);
  r.setProperty("--primary", t.primary);
  r.setProperty("--primary-foreground", t.primaryFg);
  r.setProperty("--secondary", t.secondary);
  r.setProperty("--secondary-foreground", t.secondaryFg);
  r.setProperty("--accent", t.accent);
  r.setProperty("--accent-foreground", t.accentFg);
  r.setProperty("--card", t.card);
  r.setProperty("--card-foreground", t.cardFg);
  r.setProperty("--muted", t.muted);
  r.setProperty("--muted-foreground", t.mutedFg);
  r.setProperty("--border", t.border);
  r.setProperty("--ring", t.accent);
}

/* ═══════════════════════════════════════════════════
   DECORATIVE COMPONENTS
   ═══════════════════════════════════════════════════ */

function StarField() {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
    delay: `${Math.random()*3}s`, size: Math.random()*3+2,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map(s => <div key={s.id} className="star" style={{ left:s.left, top:s.top, width:`${s.size}px`, height:`${s.size}px`, animationDelay:s.delay, background:"var(--accent,#D4A853)" }} />)}
    </div>
  );
}

function Butterflies({ count = 3 }: { count?: number }) {
  const { theme } = useApp();
  const paths = ["path-1","path-2","path-3"];
  const positions = [
    { top:"12%", left:"8%" },
    { top:"55%", left:"78%" },
    { top:"30%", left:"65%" },
    { top:"70%", left:"20%" },
    { top:"18%", left:"85%" },
  ];
  const bColor = theme.accent;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`butterfly-wrap ${paths[i % 3]}`} style={{ ...positions[i % 5], animationDelay: `${i*2}s` }}>
          <div className="butterfly">
            <div className="butterfly-wing left" style={{ background: bColor }} />
            <div className="butterfly-body" style={{ background: bColor }} />
            <div className="butterfly-wing right" style={{ background: bColor }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function QueenSparkles() {
  const { theme } = useApp();
  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i, left: `${10+Math.random()*80}%`, top: `${10+Math.random()*80}%`,
    delay: `${Math.random()*3}s`, size: 4 + Math.random()*5,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {sparkles.map(s => <div key={s.id} className="queen-sparkle" style={{ left:s.left, top:s.top, width:`${s.size}px`, height:`${s.size}px`, animationDelay:s.delay, background: theme.accent }} />)}
      <div className="queen-crown" style={{ top:"8%", right:"12%", background: theme.accent, animationDelay:"0s" }} />
      <div className="queen-crown" style={{ bottom:"15%", left:"8%", background: theme.primary, animationDelay:"3s", width:"14px", height:"10px" }} />
    </div>
  );
}

/* ─── Scroll-reveal ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return <div ref={ref} className={`reveal ${visible?"visible":""} ${className}`} style={{ transitionDelay:`${delay}ms` }}>{children}</div>;
}

function Divider() {
  return <div className="whimsical-divider" aria-hidden="true"><span style={{ color:"var(--accent,#D4A853)" }} className="text-xl">&#10022;</span></div>;
}

/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */

function Nav() {
  const { page, navigate, theme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: { label: string; href: PageId }[] = [
    { label: "Home", href: "home" },
    { label: "The Book", href: "book" },
    { label: "About M\u00e9m\u00e8re", href: "author" },
    { label: "Trailer", href: "trailer" },
  ];

  const go = useCallback((p: PageId) => { navigate(p); setMobileOpen(false); }, [navigate]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${page === "home" && !scrolled ? "bg-transparent shadow-none" : "bg-white/85 backdrop-blur-md shadow-sm"}`} style={{ borderColor: theme.border }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <button onClick={() => go("home")} className="text-lg font-semibold tracking-wide" style={{ color: page === "home" && !scrolled ? "#FFFFFF" : theme.primary }}>
          The Dancing Queen
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              className={`text-sm font-medium transition-colors duration-300 ${page===l.href ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              style={{ color: page === "home" && !scrolled ? "#FFFFFF" : theme.primary }}>
              {l.label}
            </button>
          ))}
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 transition-all duration-300 ${mobileOpen?"rotate-45 translate-y-2":""}`} style={{background: page === "home" && !scrolled ? "#FFFFFF" : theme.primary}} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${mobileOpen?"opacity-0":""}`} style={{background: page === "home" && !scrolled ? "#FFFFFF" : theme.primary}} />
          <span className={`block w-6 h-0.5 transition-all duration-300 ${mobileOpen?"-rotate-45 -translate-y-2":""}`} style={{background: page === "home" && !scrolled ? "#FFFFFF" : theme.primary}} />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden shadow-lg" style={{ background: theme.card, borderTop: `1px solid ${theme.border}` }}>
          <div className="flex flex-col px-6 py-4 gap-3">
            {links.map(l => (
              <button key={l.href} onClick={() => go(l.href)} className="text-left py-2 font-medium transition-colors" style={{ color: theme.primary }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HOME PAGE — Hero + Book + Author + Trailer + CTA
   ═══════════════════════════════════════════════════ */

function HeroSection() {
  const { theme, navigate } = useApp();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const [scrollProg, setScrollProg] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = false; v.volume = 1;
    v.play().catch(() => {
      v.muted = true; setIsMuted(true);
      const unmute = () => { v.muted = false; v.volume = 1; setIsMuted(false); document.removeEventListener("click",unmute); document.removeEventListener("touchstart",unmute); };
      document.addEventListener("click", unmute, { once: true });
      document.addEventListener("touchstart", unmute, { once: true });
    });
  }, []);

  useEffect(() => {
    const v = videoRef.current; const s = sectionRef.current; if (!v || !s) return;
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = s.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 0.35)));
        setScrollProg(prog);
        const fadeProg = Math.max(0, Math.min(1, -rect.bottom / rect.height));
        v.volume = Math.max(0, 1 - fadeProg);
        if (v.volume < 0.01) v.muted = true;
        else if (!isMuted) v.muted = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafRef.current); };
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setIsMuted(v.muted); if (!v.muted) v.volume = 1;
  }, []);

  const opacity = Math.min(1, scrollProg * 2.5);
  const translateY = (1 - Math.min(1, scrollProg * 2.5)) * 50;

  return (
    <div ref={sectionRef} className="relative" style={{ minHeight: "180vh" }}>
      {/* Sticky video viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <video ref={videoRef} src="/trailer.mp4" autoPlay loop muted={false} playsInline className="absolute inset-0 w-full h-full object-cover no-theme-transition" />
        {/* Strong center overlay to block all video text */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: `radial-gradient(ellipse 75% 65% at 50% 45%, ${theme.heroOverlay.replace(/[\d.]+\)$/, "0.92)")}, ${theme.heroOverlay.replace(/[\d.]+\)$/, "0.60)")} 50%, transparent 88%)` }} />

        <StarField />

        {/* Scroll-revealed text */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6 max-w-4xl mx-auto pointer-events-auto" style={{ opacity, transform: `translateY(${translateY}px)`, transition: "opacity 0.15s ease-out, transform 0.15s ease-out" }}>
            <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-5" style={{ color: theme.accent, textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}>
              A Bedtime Story by M\u00e9m\u00e8re
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-tight mb-6" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.6)" }}>
              The Dancing<br /><span style={{ color: theme.accent, textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>Queen</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.75)" }}>
              So light and fair, she dances for children everywhere.
              <br /><span className="text-white/70 text-base">A whimsical tale of a tiny winged guardian who watches over every child&apos;s dreams.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="font-semibold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ background: theme.accent, color: theme.accentFg }} onClick={() => navigate("book")}>
                Discover the Story
              </Button>
              <Button size="lg" className="font-semibold px-8 py-6 text-base rounded-full border-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-all duration-300" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }} onClick={() => navigate("trailer")}>
                Watch the Trailer
              </Button>
            </div>
          </div>
        </div>

        {/* Mute button */}
        <button onClick={toggleMute} aria-label={isMuted?"Unmute video":"Mute video"} className="absolute bottom-8 right-8 z-20 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 hover:scale-110 transition-all duration-300 no-theme-transition">
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          )}
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float" style={{ opacity: Math.max(0, 1 - scrollProg * 3) }}>
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Home: Book Highlights Section ─── */
function HomeBookSection() {
  const { theme, navigate } = useApp();
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: theme.bg }}>
      <Butterflies count={3} /><QueenSparkles />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>The Story</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>About the Book</h2>
          <div className="w-20 h-1 rounded-full mx-auto mb-8" style={{ background: theme.accent }} />
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: theme.mutedFg }}>
            The Dancing Queen invents a new piece of children&apos;s mythology &mdash; a tiny, light, fairy-like being with wings who lives in a child&apos;s hair. By day she plays in backyards; as evening falls, she tucks her wings in close and stands guard over their dreams.
          </p>
        </div></Reveal>

        <Reveal delay={150}><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {VERSES.map(v => (
            <div key={v.label} className="rounded-2xl p-6 md:p-8 shadow-sm" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <p className="text-lg md:text-xl font-medium italic leading-relaxed" style={{ color: theme.primary }}>&ldquo;{v.text}&rdquo;</p>
              <p className="text-sm mt-3" style={{ color: theme.mutedFg }}>{v.label}</p>
            </div>
          ))}
        </div></Reveal>

        <Divider />

        <Reveal delay={200}><div className="text-center mt-10 mb-10">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: theme.primary }}>What Makes This Book Special</h3>
          <p className="max-w-xl mx-auto" style={{ color: theme.mutedFg }}>Every detail is crafted to create a bedtime experience children will ask for night after night.</p>
        </div></Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i*80}>
              <div className="rounded-2xl p-6 md:p-8 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h4 className="text-lg font-semibold mb-3" style={{ color: theme.primary }}>{f.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: theme.mutedFg }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}><div className="mt-16 rounded-2xl p-8 md:p-10" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: theme.primary }}>Book Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{l:"Format",v:"Picture Book"},{l:"Pages",v:"32 pages"},{l:"Trim",v:'8.75" x 8.75"'},{l:"Ages",v:"2 \u2013 6"}].map(item => (
              <div key={item.l}>
                <p className="text-xs uppercase tracking-wider font-medium mb-1" style={{ color: theme.accent }}>{item.l}</p>
                <p className="text-lg font-semibold" style={{ color: theme.primary }}>{item.v}</p>
              </div>
            ))}
          </div>
        </div></Reveal>

        <Reveal delay={200}><div className="mt-12 text-center">
          <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ background: theme.primary, color: theme.primaryFg }} onClick={() => navigate("book")}>
            Explore the Full Book Page
          </Button>
        </div></Reveal>
      </div>
    </section>
  );
}

/* ─── Home: Author Section ─── */
function HomeAuthorSection() {
  const { theme, themeKey, setTheme, navigate } = useApp();
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: theme.bgAlt }}>
      <Butterflies count={3} /><QueenSparkles />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>The Author</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>About M\u00e9m\u00e8re</h2>
          <div className="w-20 h-1 rounded-full mx-auto" style={{ background: theme.accent }} />
        </div></Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <Reveal>
            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl" style={{ border: `4px solid ${theme.card}` }}>
                <Image src="/author-image.png" alt="M\u00e9m\u00e8re \u2014 author of The Dancing Queen" fill className="object-cover" priority />
              </div>
              <div className="absolute inset-0 rounded-full animate-pulse-soft" style={{ border: `2px solid ${theme.accent}40`, transform:"scale(1.1)" }} aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div>
              <blockquote className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-8" style={{ color: theme.primary }}>
                &ldquo;For George and Myles, my grandsons, who fill my heart with feelings I&apos;ve never had to explore before.&rdquo;
              </blockquote>
              <hr className="mb-8" style={{ borderColor: theme.accent+"40" }} />
              <div className="space-y-5 leading-relaxed" style={{ color: theme.mutedFg }}>
                <p>Known to her grandsons as <strong style={{ color: theme.primary }}>M\u00e9m\u00e8re</strong> &mdash; the French word for grandmother &mdash; the author wrote <em>The Dancing Queen</em> as a bedtime gift for George and Myles, whom she affectionately calls &ldquo;Critter and Bug.&rdquo; What began as a personal lullaby grew into a story she wanted to share with every child who still looks for a little magic before saying good night.</p>
                <p>In her dedication, M\u00e9m\u00e8re writes about a love that has no words &mdash; the love for a mother and father, the love that completes your life, the love that explodes your heart when you hold your newborn child. But she reserves her most awe-filled words for grandchildren.</p>
                <p>This book is that feeling, distilled into verse and illustration &mdash; a grandmother&apos;s love letter to the wonder of childhood, and to the tiny guardians who watch over our children&apos;s dreams.</p>
              </div>
              <div className="mt-8">
                <p className="font-semibold text-lg" style={{ color: theme.primary }}>&ldquo;Love you to the moon and back&rdquo;</p>
                <p style={{ color: theme.accent }}>&mdash; M\u00e9m\u00e8re</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ─── Color Palette Journey ─── */}
        <Reveal delay={300}>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: theme.primary }}>The Day-to-Night Color Journey</h3>
            <p className="text-center max-w-2xl mx-auto mb-8" style={{ color: theme.mutedFg }}>
              Click any color to transform the entire website into that moment of the story.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {PALETTE.map(c => (
                <button key={c.key} onClick={() => setTheme(c.key)}
                  className="flex flex-col items-center gap-2 group cursor-pointer p-2 rounded-xl transition-all duration-300 hover:scale-110"
                  style={{ background: themeKey === c.key ? theme.primary+"20" : "transparent", outline: themeKey === c.key ? `2px solid ${theme.primary}` : "none" }}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110" style={{ background: c.color, border: `2px solid ${theme.border}` }} />
                  <span className="text-xs font-medium" style={{ color: theme.mutedFg }}>{c.label}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.accent }}>{c.phase}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}><div className="mt-12 text-center">
          <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ background: theme.primary, color: theme.primaryFg }} onClick={() => navigate("author")}>
            Read More About M\u00e9m\u00e8re
          </Button>
        </div></Reveal>
      </div>
    </section>
  );
}

/* ─── Home: Trailer Preview ─── */
function HomeTrailerSection() {
  const { theme, navigate } = useApp();
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: theme.bg }}>
      <Butterflies count={3} /><QueenSparkles />
      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>Sneak Peek</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>Book Trailer</h2>
          <div className="w-20 h-1 rounded-full mx-auto mb-8" style={{ background: theme.accent }} />
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: theme.mutedFg }}>
            Watch the Dancing Queen come to life &mdash; from sunlit backyard dances to the quiet magic of a child&apos;s pillow at night.
          </p>
        </div></Reveal>

        <Reveal delay={200}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${theme.border}` }}>
            <video controls preload="metadata" className="w-full aspect-video" style={{ background: theme.primary }} playsInline>
              <source src="/trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>

        <Reveal delay={300}><p className="mt-10 text-center text-sm italic" style={{ color: theme.mutedFg }}>
          The trailer follows the book&apos;s day-to-night arc: sunlit backyard play gives way to lavender dusk, then deep plum nighttime warmth.
        </p></Reveal>

        <Reveal delay={200}><div className="mt-12 text-center">
          <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ background: theme.primary, color: theme.primaryFg }} onClick={() => navigate("trailer")}>
            Go to Trailer Page
          </Button>
        </div></Reveal>
      </div>
    </section>
  );
}

/* ─── Home: CTA Section ─── */
function HomeCTASection() {
  const { theme, navigate } = useApp();
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: theme.primary }}>
      <Butterflies count={5} /><StarField />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4" style={{ color: theme.accent }}>Available Now</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Every Child Deserves<br /><span style={{ color: theme.accent }}>a Little Magic</span>
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
            The Dancing Queen is more than a bedtime story &mdash; it is a grandmother&apos;s love letter to the wonder of childhood, and to the tiny guardians who watch over our children&apos;s dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ background: theme.accent, color: theme.accentFg }} onClick={() => navigate("purchase")}>
              Get the Book
            </Button>
            <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }} onClick={() => navigate("contact")}>
              Contact M\u00e9m\u00e8re
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-12 italic">&ldquo;To Every Child who believes in tiny wonders&hellip;&rdquo;</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Full Home Page ─── */
function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeBookSection />
      <HomeAuthorSection />
      <HomeTrailerSection />
      <HomeCTASection />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   BOOK PAGE
   ═══════════════════════════════════════════════════ */

function BookPage() {
  const { theme, navigate } = useApp();
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden" style={{ background: theme.bg }}>
      <Butterflies count={4} /><QueenSparkles />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>The Story</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>About the Book</h2>
          <div className="w-20 h-1 rounded-full mx-auto mb-8" style={{ background: theme.accent }} />
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: theme.mutedFg }}>
            The Dancing Queen invents a new piece of children&apos;s mythology &mdash; a tiny, light, fairy-like being with wings who lives in a child&apos;s hair. By day she plays in backyards; as evening falls, she tucks her wings in close and stands guard over their dreams.
          </p>
        </div></Reveal>

        <Reveal delay={150}><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {VERSES.map(v => (
            <div key={v.label} className="rounded-2xl p-6 md:p-8 shadow-sm" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
              <p className="text-lg md:text-xl font-medium italic leading-relaxed" style={{ color: theme.primary }}>&ldquo;{v.text}&rdquo;</p>
              <p className="text-sm mt-3" style={{ color: theme.mutedFg }}>{v.label}</p>
            </div>
          ))}
        </div></Reveal>

        <Divider />

        <Reveal delay={200}><div className="text-center mt-10 mb-10">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: theme.primary }}>What Makes This Book Special</h3>
          <p className="max-w-xl mx-auto" style={{ color: theme.mutedFg }}>Every detail is crafted to create a bedtime experience children will ask for night after night.</p>
        </div></Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i*80}>
              <div className="rounded-2xl p-6 md:p-8 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h4 className="text-lg font-semibold mb-3" style={{ color: theme.primary }}>{f.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: theme.mutedFg }}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}><div className="mt-16 rounded-2xl p-8 md:p-10" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
          <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: theme.primary }}>Book Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{l:"Format",v:"Picture Book"},{l:"Pages",v:"32 pages"},{l:"Trim",v:'8.75" x 8.75"'},{l:"Ages",v:"2 \u2013 6"}].map(item => (
              <div key={item.l}>
                <p className="text-xs uppercase tracking-wider font-medium mb-1" style={{ color: theme.accent }}>{item.l}</p>
                <p className="text-lg font-semibold" style={{ color: theme.primary }}>{item.v}</p>
              </div>
            ))}
          </div>
        </div></Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   AUTHOR PAGE
   ═══════════════════════════════════════════════════ */

function AuthorPage() {
  const { theme, themeKey, setTheme } = useApp();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden" style={{ background: theme.bg }}>
      <Butterflies count={3} /><QueenSparkles />
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>The Author</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>About M\u00e9m\u00e8re</h2>
          <div className="w-20 h-1 rounded-full mx-auto" style={{ background: theme.accent }} />
        </div></Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <Reveal>
            <div className="relative flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl" style={{ border: `4px solid ${theme.card}` }}>
                <Image src="/author-image.png" alt="M\u00e9m\u00e8re \u2014 author of The Dancing Queen" fill className="object-cover" priority />
              </div>
              <div className="absolute inset-0 rounded-full animate-pulse-soft" style={{ border: `2px solid ${theme.accent}40`, transform:"scale(1.1)" }} aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div>
              <blockquote className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-8" style={{ color: theme.primary }}>
                &ldquo;For George and Myles, my grandsons, who fill my heart with feelings I&apos;ve never had to explore before.&rdquo;
              </blockquote>
              <hr className="mb-8" style={{ borderColor: theme.accent+"40" }} />
              <div className="space-y-5 leading-relaxed" style={{ color: theme.mutedFg }}>
                <p>Known to her grandsons as <strong style={{ color: theme.primary }}>M\u00e9m\u00e8re</strong> &mdash; the French word for grandmother &mdash; the author wrote <em>The Dancing Queen</em> as a bedtime gift for George and Myles, whom she affectionately calls &ldquo;Critter and Bug.&rdquo; What began as a personal lullaby grew into a story she wanted to share with every child who still looks for a little magic before saying good night.</p>
                <p>In her dedication, M\u00e9m\u00e8re writes about a love that has no words &mdash; the love for a mother and father, the love that completes your life, the love that explodes your heart when you hold your newborn child. But she reserves her most awe-filled words for grandchildren.</p>
                <p>This book is that feeling, distilled into verse and illustration &mdash; a grandmother&apos;s love letter to the wonder of childhood, and to the tiny guardians who watch over our children&apos;s dreams.</p>
              </div>
              <div className="mt-8">
                <p className="font-semibold text-lg" style={{ color: theme.primary }}>&ldquo;Love you to the moon and back&rdquo;</p>
                <p style={{ color: theme.accent }}>&mdash; M\u00e9m\u00e8re</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ─── Color Palette Journey ─── */}
        <Reveal delay={300}>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: theme.primary }}>The Day-to-Night Color Journey</h3>
            <p className="text-center max-w-2xl mx-auto mb-8" style={{ color: theme.mutedFg }}>
              Click any color to transform the entire website into that moment of the story.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {PALETTE.map(c => (
                <button key={c.key} onClick={() => setTheme(c.key)}
                  className="flex flex-col items-center gap-2 group cursor-pointer p-2 rounded-xl transition-all duration-300 hover:scale-110"
                  style={{ background: themeKey === c.key ? theme.primary+"20" : "transparent", outline: themeKey === c.key ? `2px solid ${theme.primary}` : "none" }}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md transition-transform duration-300 group-hover:scale-110" style={{ background: c.color, border: `2px solid ${theme.border}` }} />
                  <span className="text-xs font-medium" style={{ color: theme.mutedFg }}>{c.label}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.accent }}>{c.phase}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRAILER PAGE
   ═══════════════════════════════════════════════════ */

function TrailerPage() {
  const { theme } = useApp();
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden" style={{ background: theme.bg }}>
      <Butterflies count={3} /><QueenSparkles />
      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>Sneak Peek</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>Book Trailer</h2>
          <div className="w-20 h-1 rounded-full mx-auto mb-8" style={{ background: theme.accent }} />
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: theme.mutedFg }}>
            Watch the Dancing Queen come to life &mdash; from sunlit backyard dances to the quiet magic of a child&apos;s pillow at night.
          </p>
        </div></Reveal>

        <Reveal delay={200}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${theme.border}` }}>
            <video controls preload="metadata" className="w-full aspect-video" style={{ background: theme.primary }} playsInline>
              <source src="/trailer.mp4" type="video/mp4" />
            </video>
          </div>
        </Reveal>

        <Reveal delay={300}><p className="mt-10 text-center text-sm italic" style={{ color: theme.mutedFg }}>
          The trailer follows the book&apos;s day-to-night arc: sunlit backyard play gives way to lavender dusk, then deep plum nighttime warmth.
        </p></Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT PAGE
   ═══════════════════════════════════════════════════ */

function ContactPage() {
  const { theme } = useApp();
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden" style={{ background: theme.bg }}>
      <Butterflies count={3} /><QueenSparkles />
      <div className="max-w-2xl mx-auto relative z-10">
        <Reveal><div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-3" style={{ color: theme.accent }}>Reach Out</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: theme.primary }}>Contact M\u00e9m\u00e8re</h2>
          <div className="w-20 h-1 rounded-full mx-auto mb-8" style={{ background: theme.accent }} />
          <p className="text-lg leading-relaxed" style={{ color: theme.mutedFg }}>
            For inquiries, press copies, or to share what The Dancing Queen means to your family.
          </p>
        </div></Reveal>

        <Reveal delay={200}>
          <div className="rounded-2xl p-8 md:p-10 shadow-lg" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            {sent ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-4">\uD83D\uDC8C</p>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: theme.primary }}>Message Sent!</h3>
                <p style={{ color: theme.mutedFg }}>Thank you for reaching out. M\u00e9m\u00e8re will treasure your words.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.primary }}>Your Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl text-base outline-none focus:ring-2" style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, "--tw-ring-color": theme.accent } as React.CSSProperties} placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.primary }}>Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl text-base outline-none focus:ring-2" style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, "--tw-ring-color": theme.accent } as React.CSSProperties} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.primary }}>Your Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 rounded-xl text-base outline-none focus:ring-2 resize-none" style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.fg, "--tw-ring-color": theme.accent } as React.CSSProperties} placeholder="Share your thoughts..." />
                </div>
                <Button type="submit" size="lg" className="w-full font-semibold py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300" style={{ background: theme.primary, color: theme.primaryFg }}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PURCHASE PAGE (Get the Book)
   ═══════════════════════════════════════════════════ */

function PurchasePage() {
  const { theme, navigate } = useApp();
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden flex items-center justify-center" style={{ background: theme.primary }}>
      <Butterflies count={5} /><StarField />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal>
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4" style={{ color: theme.accent }}>Available Now</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Every Child Deserves<br /><span style={{ color: theme.accent }}>a Little Magic</span>
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
            The Dancing Queen is more than a bedtime story &mdash; it is a grandmother&apos;s love letter to the wonder of childhood, and to the tiny guardians who watch over our children&apos;s dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ background: theme.accent, color: theme.accentFg }}>
              Order Your Copy
            </Button>
            <Button size="lg" className="font-semibold px-10 py-6 text-base rounded-full border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: "rgba(255,255,255,0.35)", color: "#FFFFFF", background: "rgba(255,255,255,0.08)" }} onClick={() => navigate("contact")}>
              Contact M\u00e9m\u00e8re
            </Button>
          </div>
          <p className="text-white/40 text-sm mt-12 italic">&ldquo;To Every Child who believes in tiny wonders&hellip;&rdquo;</p>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */

function Footer() {
  const { theme, navigate } = useApp();
  const links: { label: string; href: PageId }[] = [
    { label: "Home", href: "home" },
    { label: "About the Book", href: "book" },
    { label: "About M\u00e9m\u00e8re", href: "author" },
    { label: "Book Trailer", href: "trailer" },
  ];
  return (
    <footer style={{ background: theme.primary, color: theme.primaryFg }} className="py-12 px-6 no-theme-transition">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-lg mb-3">The Dancing Queen</h4>
            <p className="text-sm leading-relaxed opacity-70">A whimsical bedtime picture book by M\u00e9m\u00e8re. Dedicated to George and Myles &mdash; and to every child who still looks for a little magic before saying good night.</p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {links.map(l => <li key={l.href}><button onClick={() => navigate(l.href)} className="hover:opacity-100 opacity-70 transition-opacity duration-200">{l.label}</button></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3">Connect</h4>
            <p className="text-sm leading-relaxed mb-4 opacity-70">For inquiries, press copies, or to share what The Dancing Queen means to your family.</p>
            <Button size="sm" className="rounded-full text-sm font-medium" style={{ background: theme.accent, color: theme.accentFg }} onClick={() => navigate("contact")}>
              Get in Touch
            </Button>
          </div>
        </div>
        <hr className="opacity-10 mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <p>&copy; {new Date().getFullYear()} The Dancing Queen. All Rights Reserved.</p>
          <p>Written with love by <span style={{ color: theme.accent }}>M\u00e9m\u00e8re</span> for George and Myles</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP — SPA Router + Theme Provider
   ═══════════════════════════════════════════════════ */

export default function Home() {
  const [page, setPage] = useState<PageId>("home");
  const [themeKey, setThemeKey] = useState("plum");
  const [transitioning, setTransitioning] = useState(false);
  const theme = THEMES[themeKey];

  // Apply theme to DOM
  useEffect(() => { applyThemeToDOM(theme); }, [theme]);

  const navigate = useCallback((p: PageId) => {
    if (p === page || transitioning) return;
    setTransitioning(true);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setTimeout(() => { setPage(p); setTimeout(() => setTransitioning(false), 50); }, 350);
  }, [page, transitioning]);

  const ctx = { theme, themeKey, setTheme: setThemeKey, navigate, page };

  const pages: Record<PageId, React.ReactNode> = {
    home: <HomePage />,
    book: <BookPage />,
    author: <AuthorPage />,
    trailer: <TrailerPage />,
    contact: <ContactPage />,
    purchase: <PurchasePage />,
  };

  return (
    <ThemeCtx.Provider value={ctx}>
      <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
        <Nav />
        <main className="flex-1" style={{ opacity: transitioning ? 0 : 1, transform: transitioning ? "translateY(16px)" : "translateY(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
          {pages[page]}
        </main>
        <Footer />
      </div>
    </ThemeCtx.Provider>
  );
}