import React from 'react';
import {
  Globe2,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Lock,
  HeartHandshake,
  Target,
  Sparkles,
  Users,
  MessageCircle,
} from 'lucide-react';
import { useUiStore } from '../stores/uiStore';
import { LANGUAGES, CONVERSATION_TOPICS } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar } from '../components/ui/avatar';
import { LanguagePair } from '../components/common/LanguagePair';

export function LandingPage() {
  const { navigate } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Public Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between glass-header px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
            <Globe2 className="h-5 w-5 text-amber-300" />
          </div>
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
          <Button
            variant="gradient"
            size="sm"
            onClick={() => navigate('register')}
            className="gap-1.5 font-semibold rounded-xl shadow-xs"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Smart Language Exchange Platform</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
              Practice languages with <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">real native partners</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Connect with reciprocal learners worldwide. Enhance fluency, master authentic conversation, and exchange skills 50/50.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => navigate('register')}
                className="gap-2 rounded-2xl shadow-md"
              >
                <span>Find a partner now</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-2xl"
              >
                How it works
              </Button>
            </div>

            <div className="pt-3 flex flex-wrap gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verified student & native profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Reciprocal 50/50 match</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Class & conversation topics</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5 shadow-2xl shadow-indigo-500/10">
              {/* Partner Card Snippet */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                    fallback="M"
                    size="md"
                    isOnline={true}
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Maria Valle</h4>
                    <p className="text-xs text-slate-500">Madrid, Spain</p>
                  </div>
                </div>
                <Badge variant="gold" className="px-3 py-1 font-bold text-xs">
                  96% Match
                </Badge>
              </div>

              <LanguagePair speaks="Spanish" learning="English" />

              {/* Chat Simulation */}
              <div className="space-y-3 pt-1">
                <div className="rounded-2xl rounded-tl-xs bg-slate-100 p-3.5 text-xs text-slate-800 border border-slate-200/60">
                  <p className="font-bold text-[10px] text-amber-700 uppercase tracking-wider mb-1">
                    Maria (Native Spanish 🇪🇸)
                  </p>
                  <p className="leading-relaxed">¡Hola Alex! How do you usually start your morning?</p>
                </div>

                <div className="rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3.5 text-xs ml-auto max-w-[90%] shadow-xs">
                  <p className="font-bold text-[10px] text-indigo-100 uppercase tracking-wider mb-1">
                    You (Learning Spanish 🇬🇧)
                  </p>
                  <p className="leading-relaxed">Me encanta tomar café fresco antes de empezar a estudiar.</p>
                </div>
              </div>

              {/* Topic prompt chip */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-900 flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-medium truncate">Topic Starter: Daily Routines & Class Practice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <Badge variant="blue" className="mb-2">Simple Process</Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How LinguaConnect Works
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Four seamless steps to confident conversation practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-left border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold mb-4 font-heading text-sm shadow-sm">
                01
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                Create Profile
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Specify your native language, target languages, proficiency level, and goals.
              </p>
            </Card>

            <Card className="p-6 text-left border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold mb-4 font-heading text-sm shadow-sm">
                02
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                Match Reciprocally
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our smart algorithm matches you with partners who speak what you want to learn.
              </p>
            </Card>

            <Card className="p-6 text-left border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold mb-4 font-heading text-sm shadow-sm">
                03
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                Topic Starters
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use built-in class topics, grammar prompts, and cultural questions.
              </p>
            </Card>

            <Card className="p-6 text-left border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all duration-300 shadow-xs hover:shadow-md">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold mb-4 font-heading text-sm shadow-sm">
                04
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                Live Practice
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Exchange text messages, audio clips, or live practice calls safely.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-md mx-auto mb-10">
          <Badge variant="emerald" className="mb-2">Global Community</Badge>
          <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">
            Supported Languages
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Exchange with verified native speakers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              onClick={() => navigate('register')}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center transition-all duration-200 cursor-pointer hover:border-indigo-300 hover:shadow-md hover:-translate-y-1"
            >
              <span className="text-3xl block mb-2">{lang.flag}</span>
              <p className="font-heading font-bold text-xs text-slate-900">
                {lang.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">{lang.nativeName}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conversation Topics */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight">
              Curated Class & Life Topics
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Structured prompts designed to make conversation effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CONVERSATION_TOPICS.slice(0, 3).map((topic) => (
              <Card key={topic.id} className="p-5 bg-slate-50/60 border border-slate-200/80 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
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
                    Level: {topic.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Class Prompt</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-left">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                Safe & Moderated Environment
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                LinguaConnect is strictly built for language exchange learning with community protection.
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <Lock className="h-4 w-4 text-amber-500 mb-2" />
                <h4 className="font-heading font-bold text-xs text-slate-900 mb-0.5">
                  Block Controls
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Block unwanted users instantly with one click.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <ShieldCheck className="h-4 w-4 text-indigo-600 mb-2" />
                <h4 className="font-heading font-bold text-xs text-slate-900 mb-0.5">
                  Reporting
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Report spam or harassment to moderation instantly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <HeartHandshake className="h-4 w-4 text-indigo-600 mb-2" />
                <h4 className="font-heading font-bold text-xs text-slate-900 mb-0.5">
                  50/50 Reciprocal Practice
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Equal exchange in both partners' languages.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <Target className="h-4 w-4 text-amber-500 mb-2" />
                <h4 className="font-heading font-bold text-xs text-slate-900 mb-0.5">
                  Goal-Oriented Learning
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Focused on fluency objectives and class practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-6 text-center mt-auto border-t border-indigo-800/80 relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-5 relative z-10">
          <Badge variant="amber" className="text-xs px-3 py-1 font-bold">Start For Free Today</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Practice Your Target Language?
          </h2>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Join thousands of language learners and exchange conversation partners today.
          </p>
          <div>
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('register')}
              className="font-bold px-8 py-3 rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Find Your Match Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

