import React from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Globe2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Flame,
  Sparkles,
  MessageCircle,
  Instagram,
  Twitter,
  Youtube,
  Zap,
  Ban,
} from 'lucide-react';
import { useUiStore } from '../stores/uiStore';
import { LANGUAGES, CONVERSATION_TOPICS } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { LanguagePair } from '../components/common/LanguagePair';
import { cn } from '../lib/utils';

// Faces used for the "people are here right now" social proof — pulled
// straight from the mock partner pool so it matches what a demo session
// actually shows.
const SOCIAL_FACES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
];

const HERO_WORDS = ['texting', 'chatting', 'vibing', 'connecting'];

// ------------------------------------------------------------------
// A single word that fades/slides in and out on a loop — carries most
// of the "alive" feeling in the hero without being distracting.
// ------------------------------------------------------------------
function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom h-[1.15em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ------------------------------------------------------------------
// Counts up from 0 to `value` once it scrolls into view.
// ------------------------------------------------------------------
function Counter({ value, suffix = '', duration = 1.4 }: { value: number; suffix?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// ------------------------------------------------------------------
// Infinite horizontal scroller — the "trending languages" strip.
// ------------------------------------------------------------------
function LanguageMarquee() {
  const loopItems = [...LANGUAGES, ...LANGUAGES];
  return (
    <div className="relative overflow-hidden py-3 border-y border-slate-200/70 bg-white/70 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10" />
      <motion.div
        className="flex items-center gap-8 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {loopItems.map((lang, i) => (
          <span
            key={`${lang.id}-${i}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 whitespace-nowrap"
          >
            <span className="text-lg">{lang.flag}</span>
            {lang.name}
            <span className="text-slate-300 mx-2">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// Scroll-reveal wrapper used throughout the page.
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  key?: React.Key;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const { navigate } = useUiStore();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'sticky top-0 z-40 flex h-16 w-full items-center justify-between px-4 sm:px-8 transition-all duration-300',
          scrolled ? 'glass-header shadow-sm' : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm"
          >
            <Globe2 className="h-5 w-5 text-amber-300" />
          </motion.div>
          <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">
            LinguaConnect
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('login')}
            className="font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Sign in
          </Button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => navigate('register')}
              className="gap-1.5 font-semibold rounded-xl shadow-xs"
            >
              <span>Join free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Ambient blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-400/10 rounded-full blur-3xl pointer-events-none"
        />

        {/* Floating faces — decorative, hidden on small screens so they don't clutter mobile */}
        <div className="hidden lg:block">
          {[
            { top: '8%', left: '4%', delay: 0 },
            { top: '62%', left: '2%', delay: 0.6 },
            { top: '20%', left: '92%', delay: 1.1 },
            { top: '68%', left: '90%', delay: 0.3 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute z-10"
              style={{ top: pos.top, left: pos.left }}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: pos.delay }}
            >
              <div className="rounded-full ring-4 ring-white shadow-lg">
                <Avatar src={SOCIAL_FACES[i]} fallback="U" size="lg" isOnline={i % 2 === 0} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Free · No pressure · Real people</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]"
            >
              Learn a language by{' '}
              <RotatingWord words={HERO_WORDS} /> with real people.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
            >
              Match with people who speak what you're learning — and want to
              learn what you speak. No textbooks, no forced lessons, just
              actual conversations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('register')}
                  className="gap-2 rounded-2xl shadow-md w-full sm:w-auto"
                >
                  <span>Find your match</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-2xl"
              >
                See how it works
              </Button>
            </motion.div>

            {/* Live social proof strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-3 flex items-center gap-3"
            >
              <div className="flex -space-x-2.5">
                {SOCIAL_FACES.slice(0, 5).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full ring-2 ring-slate-50 object-cover"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 align-middle animate-pulse" />
                <Counter value={2400} suffix="+" /> people online right now
              </p>
            </motion.div>

            <div className="pt-1 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verified profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Block & report in one tap</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" />
                <span>Keep a daily streak</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar src={SOCIAL_FACES[3]} fallback="M" size="md" isOnline={true} />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Maria Valle</h4>
                    <p className="text-xs text-slate-500">Madrid, Spain</p>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Badge variant="gold" className="px-3 py-1 font-bold text-xs">
                    96% Match
                  </Badge>
                </motion.div>
              </div>

              <LanguagePair speaks="Spanish" learning="English" />

              <div className="space-y-3 pt-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="rounded-2xl rounded-tl-xs bg-slate-100 p-3.5 text-xs text-slate-800 border border-slate-200/60"
                >
                  <p className="font-bold text-[10px] text-amber-700 uppercase tracking-wider mb-1">
                    Maria 🇪🇸
                  </p>
                  <p className="leading-relaxed">omg hi!! how's your morning going? ☕️</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.4 }}
                  className="flex items-center gap-1.5 pl-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-slate-300"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.3, duration: 0.4 }}
                  className="rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3.5 text-xs ml-auto max-w-[90%] shadow-xs"
                >
                  <p className="font-bold text-[10px] text-indigo-100 uppercase tracking-wider mb-1">
                    You 🇬🇧
                  </p>
                  <p className="leading-relaxed">pretty good! me encanta el café antes de estudiar 😄</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-900 flex items-center gap-2.5"
              >
                <MessageCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-medium truncate">This convo is happening right now</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending languages ticker */}
      <LanguageMarquee />

      {/* Live Stats */}
      <section className="py-14 px-4 sm:px-6 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: 48000, suffix: '+', label: 'People learning' },
            { value: 120, suffix: '+', label: 'Countries' },
            { value: 3, suffix: 'M+', label: 'Messages sent' },
            { value: 49, suffix: '/10', label: 'Loved by users' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-heading text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center max-w-xl mx-auto mb-12">
            <Badge variant="blue" className="mb-2">It's easy</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Four steps. Zero awkwardness.
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Set up your profile once, then just start talking.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Make your profile', body: "Native language, what you're learning, your vibe — takes two minutes." },
              { n: '02', title: 'Get matched', body: 'Our algorithm pairs you with people who want exactly what you want.' },
              { n: '03', title: 'Start chatting', body: 'Break the ice with a topic starter, or just say hi. No script needed.' },
              { n: '04', title: 'Keep the streak', body: 'Chat daily, level up your fluency, and actually make a friend.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <Card className="p-6 h-full text-left border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold mb-4 font-heading text-sm shadow-sm">
                    {step.n}
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <Reveal className="text-center max-w-md mx-auto mb-10">
          <Badge variant="emerald" className="mb-2">Global squad</Badge>
          <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">
            Pick your language
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Real speakers, real accents, real conversations.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (i % 7) * 0.05 }}
              whileHover={{ y: -4, scale: 1.03 }}
              onClick={() => navigate('register')}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center transition-colors duration-200 cursor-pointer hover:border-indigo-300 hover:shadow-md"
            >
              <span className="text-3xl block mb-2">{lang.flag}</span>
              <p className="font-heading font-bold text-xs text-slate-900">{lang.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{lang.nativeName}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conversation Topics */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center max-w-md mx-auto mb-10">
            <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">
              Never run out of things to say
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Built-in topic starters so the first message is never the hard part.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CONVERSATION_TOPICS.slice(0, 3).map((topic, i) => (
              <Reveal key={topic.id} delay={i * 0.1}>
                <Card className="p-5 h-full bg-slate-50/60 border border-slate-200/80 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <Badge variant="blue" className="text-[10px] mb-2.5">
                      {topic.category}
                    </Badge>
                    <h4 className="font-heading font-bold text-base text-slate-900 mb-2">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                      "{topic.prompt}"
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600">
                      {topic.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Tap to use</span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety / community section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <Reveal>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 text-left">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
                  <ShieldCheck className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                  Real connections, not weird DMs
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Built for genuine language exchange, with the tools to keep
                  it that way.
                </p>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Ban, color: 'text-amber-500', title: 'One-tap block', body: 'Block anyone instantly, no explanation needed.' },
                  { icon: ShieldCheck, color: 'text-indigo-600', title: 'Easy reporting', body: 'Flag anything sketchy straight to moderation.' },
                  { icon: Zap, color: 'text-indigo-600', title: 'Fair exchange', body: "You teach, they teach — it's always 50/50." },
                  { icon: Lock, color: 'text-amber-500', title: 'You control your data', body: 'Your profile, your rules, delete anytime.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <item.icon className={cn('h-4 w-4 mb-2', item.color)} />
                    <h4 className="font-heading font-bold text-xs text-slate-900 mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-6 text-center overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-10 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"
        />

        <Reveal className="max-w-xl mx-auto space-y-5 relative z-10">
          <Badge variant="amber" className="text-xs px-3 py-1 font-bold">100% free to join</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Your next language bestie is one tap away
          </h2>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Thousands of people are chatting right now. Come say hi.
          </p>
          <motion.div className="inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('register')}
              className="font-bold px-8 py-3 rounded-2xl shadow-xl"
            >
              Find Your Match Now
            </Button>
          </motion.div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 px-4 sm:px-8 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                  <Globe2 className="h-4 w-4 text-amber-300" />
                </div>
                <span className="font-heading font-bold text-white text-base">LinguaConnect</span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs">
                Real people, real conversations, real fluency. Made for
                learners who'd rather chat than cram.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {[Instagram, Twitter, Youtube].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    whileHover={{ y: -2 }}
                    className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:border-indigo-500 hover:text-white transition-colors"
                    aria-label="Social link"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Product</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('how-it-works');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    How it works
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('register')} className="hover:text-white transition-colors cursor-pointer">
                    Get started
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('login')} className="hover:text-white transition-colors cursor-pointer">
                    Sign in
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Community</h5>
              <ul className="space-y-2 text-xs">
                <li className="hover:text-white transition-colors cursor-default">Safety Center</li>
                <li className="hover:text-white transition-colors cursor-default">Guidelines</li>
                <li className="hover:text-white transition-colors cursor-default">Feedback</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Legal</h5>
              <ul className="space-y-2 text-xs">
                <li className="hover:text-white transition-colors cursor-default">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-default">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} LinguaConnect. Made for language learners, everywhere.</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
