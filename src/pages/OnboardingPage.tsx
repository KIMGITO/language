import React from 'react';
import {
  Globe2,
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  HeartHandshake,
  ArrowLeftRight,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import { useUiStore } from '../stores/uiStore';
import { LANGUAGES, INTERESTS } from '../data/mockData';
import { LanguageProficiency } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

const PROFICIENCY_LEVELS: { level: LanguageProficiency; desc: string }[] = [
  { level: 'Beginner', desc: 'Starting from scratch' },
  { level: 'Elementary', desc: 'Simple familiar topics' },
  { level: 'Intermediate', desc: 'Everyday conversation' },
  { level: 'Upper Intermediate', desc: 'Fluid discussion' },
  { level: 'Advanced', desc: 'Complex concepts' },
  { level: 'Fluent', desc: 'Near-native ease' },
];

const AVAILABILITY_OPTIONS = [
  { id: 'weekday_evenings', label: 'Weekday evenings (18:00 - 21:00)' },
  { id: 'weekends', label: 'Weekends (Saturday & Sunday)' },
  { id: 'flexible', label: 'Flexible / Asynchronous' },
  { id: 'mornings', label: 'Weekday mornings (07:00 - 09:00)' },
];

export function OnboardingPage() {
  const { user } = useAuthStore();
  const { completeOnboarding, loading } = useProfileStore();
  const { navigate } = useUiStore();

  const [step, setStep] = React.useState(1);
  const [nativeLangId, setNativeLangId] = React.useState('lang-sw');
  const [learningLangId, setLearningLangId] = React.useState('lang-en');
  const [proficiency, setProficiency] = React.useState<LanguageProficiency>('Intermediate');
  const [intents, setIntents] = React.useState<string[]>(['practice', 'language_exchange']);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([
    'Travel',
    'Food & Cooking',
    'Culture & Traditions',
    'Music',
  ]);
  const [availability, setAvailability] = React.useState(
    'Weekday evenings (18:00 - 21:00)'
  );

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      if (selectedTopics.length < 8) {
        setSelectedTopics([...selectedTopics, topic]);
      }
    }
  };

  const handleFinish = async () => {
    const success = await completeOnboarding('usr-1');
    if (success) {
      navigate('home');
    }
  };

  const totalSteps = 5;
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 font-bold text-xs">
            <Globe2 className="h-4 w-4 text-indigo-600" />
            <span>LinguaConnect Onboarding</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Customize Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Set your target languages, exchange goals, and topics to get matched instantly.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 px-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-indigo-600">{Math.round(progressPercent)}% completed</span>
          </div>
          <Progress value={progressPercent} className="h-2 rounded-full bg-slate-200" />
        </div>

        {/* Card Container */}
        <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl">
          <CardContent className="p-0">
            {/* Step 1: Native Language */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    What is your native language?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select your mother tongue or main spoken language.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {LANGUAGES.map((lang) => {
                    const isSelected = nativeLangId === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setNativeLangId(lang.id)}
                        className={cn(
                          'p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 flex items-center gap-2.5',
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-bold'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{lang.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Learning Language */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Which language are you learning?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose the target language you want to practice in class & daily life.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {LANGUAGES.filter((l) => l.id !== nativeLangId).map((lang) => {
                    const isSelected = learningLangId === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setLearningLangId(lang.id)}
                        className={cn(
                          'p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 flex items-center gap-2.5',
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-bold'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{lang.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Proficiency Level */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    What is your current level?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Be honest so we can match you with compatible exchange partners.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PROFICIENCY_LEVELS.map((item) => {
                    const isSelected = proficiency === item.level;
                    return (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => setProficiency(item.level)}
                        className={cn(
                          'p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-150',
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md'
                            : 'bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs sm:text-sm">
                            {item.level}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-white stroke-[2.5]" />}
                        </div>
                        <p
                          className={cn(
                            'text-[11px] mt-0.5',
                            isSelected ? 'text-indigo-100' : 'text-slate-500'
                          )}
                        >
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Practice Interests & Topics */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    What topics interest you?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select 2 to 8 topics you'd love to chat about with partners.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
                  {INTERESTS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={cn(
                          'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer border',
                          isSelected
                            ? 'bg-indigo-600 text-white border-transparent shadow-2xs font-bold'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
                        )}
                      >
                        #{topic}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Schedule & Availability */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    When are you usually available?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Helps us find partners with matching study schedules.
                  </p>
                </div>

                <div className="space-y-2">
                  {AVAILABILITY_OPTIONS.map((opt) => {
                    const isSelected = availability === opt.label;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAvailability(opt.label)}
                        className={cn(
                          'w-full p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-150 flex items-start gap-3',
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs font-bold'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        <Calendar
                          className={cn(
                            'h-4 w-4 mt-0.5 shrink-0',
                            isSelected ? 'text-indigo-600' : 'text-slate-400'
                          )}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                            {isSelected && <Check className="h-4 w-4 text-indigo-600 stroke-[2.5]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
              {step > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(step - 1)}
                  className="gap-1.5 text-xs rounded-xl"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setStep(step + 1)}
                  className="gap-1.5 text-xs ml-auto rounded-xl shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  disabled={loading}
                  onClick={handleFinish}
                  className="gap-1.5 text-xs ml-auto rounded-xl shadow-md"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{loading ? 'Saving Profile...' : 'Complete Profile'}</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
