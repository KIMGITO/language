import React from 'react';
import { Target, ArrowUpRight, Flame } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface LearningGoalCardProps {
  language: string;
  proficiency: string;
  goal: string;
  flag?: string;
  onPracticeClick?: () => void;
}

export function LearningGoalCard({
  language,
  proficiency,
  goal,
  flag,
  onPracticeClick,
}: LearningGoalCardProps) {
  return (
    <Card className="p-5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/60 rounded-2xl transition-all duration-300 shadow-md group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3.5">
          {flag && <span className="text-3xl p-1.5 bg-white/10 rounded-xl backdrop-blur-md">{flag}</span>}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-heading font-bold text-lg text-white">{language}</h4>
              <Badge variant="amber" className="text-xs px-2.5 py-0.5 font-bold">
                {proficiency}
              </Badge>
            </div>
            <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Target Goal: {goal}</span>
            </p>
          </div>
        </div>

        {onPracticeClick && (
          <button
            onClick={onPracticeClick}
            className="rounded-xl p-2.5 bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10 shadow-xs group-hover:scale-105"
            title="Practice this language"
          >
            <ArrowUpRight className="h-4 w-4 text-amber-300" />
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-indigo-800/40 flex items-center justify-between text-xs text-indigo-200/80">
        <div className="flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span>7-Day Streak Active</span>
        </div>
        <span className="text-[11px] text-amber-300 font-semibold cursor-pointer hover:underline" onClick={onPracticeClick}>
          Find Partners →
        </span>
      </div>
    </Card>
  );
}

