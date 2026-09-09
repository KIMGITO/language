import React from 'react';
import { BookOpen, Award, Target } from 'lucide-react';
import { UserLanguage } from '../../types';
import { LanguageBadge } from '../common/LanguageBadge';

interface ProfileLanguageSectionProps {
  nativeLanguages: UserLanguage[];
  learningLanguages: UserLanguage[];
  learningGoals?: string;
  className?: string;
}

export function ProfileLanguageSection({
  nativeLanguages,
  learningLanguages,
  learningGoals,
  className,
}: ProfileLanguageSectionProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Native Languages */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div className="flex items-center gap-2 mb-3.5 text-indigo-700 dark:text-indigo-300">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider">
              Native Languages
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {nativeLanguages.map((ul) => (
              <LanguageBadge
                key={ul.id}
                language={ul.language.name}
                flag={ul.language.flag}
                level="Native"
                type="native"
              />
            ))}
          </div>
        </div>

        {/* Learning Languages */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2 mb-3.5 text-emerald-700 dark:text-emerald-300">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider">
              Learning Languages
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {learningLanguages.map((ul) => (
              <LanguageBadge
                key={ul.id}
                language={ul.language.name}
                flag={ul.language.flag}
                level={ul.proficiency}
                type="learning"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      {learningGoals && (
        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-5 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 shrink-0">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
              Learning Goals & Targets
            </h5>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{learningGoals}</p>
          </div>
        </div>
      )}
    </div>
  );
}
