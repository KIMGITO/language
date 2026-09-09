import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { MatchFilters } from '../../types';
import { LANGUAGES, INTERESTS } from '../../data/mockData';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface MatchFilterBarProps {
  filters: MatchFilters;
  onFilterChange: (key: keyof MatchFilters, value: string) => void;
  onReset: () => void;
  selectedLanguage: string;
  onSelectLanguage: (languageName: string) => void;
}

export function MatchFilterBar({
  filters,
  onFilterChange,
  onReset,
  selectedLanguage,
  onSelectLanguage,
}: MatchFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const topLanguages = ['English', 'Spanish', 'Swahili', 'French', 'Japanese', 'German'];

  const countries = [
    'All countries',
    'United Kingdom',
    'United States',
    'Kenya',
    'Spain',
    'Mexico',
    'Japan',
    'Germany',
    'Brazil',
    'Canada',
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Quick Language Selector */}
      <div className="glass-card rounded-2xl p-4 sm:p-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Practice Language
        </label>
        
        <div className="flex items-center gap-2 flex-wrap">
          {topLanguages.map((langName) => {
            const langObj = LANGUAGES.find((l) => l.name === langName);
            const isSelected = selectedLanguage.toLowerCase() === langName.toLowerCase();
            return (
              <button
                key={langName}
                type="button"
                onClick={() => onSelectLanguage(langName)}
                className={cn(
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer border',
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-sm shadow-indigo-500/25'
                    : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                )}
              >
                <span className="text-base select-none">{langObj?.flag || '🌐'}</span>
                <span>{langName}</span>
                {isSelected && <Check className="h-3.5 w-3.5 ml-0.5 stroke-[2.5]" />}
              </button>
            );
          })}

          <div className="min-w-[150px] max-w-[200px]">
            <Select
              value={topLanguages.includes(selectedLanguage) ? '' : selectedLanguage}
              onChange={(e) => {
                if (e.target.value) onSelectLanguage(e.target.value);
              }}
              className="h-9 text-xs rounded-xl"
            >
              <option value="">More languages...</option>
              {LANGUAGES.filter((l) => !topLanguages.includes(l.name)).map((lang) => (
                <option key={lang.id} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Secondary Search & Filter Row */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:flex-1 relative">
            <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={filters.searchQuery}
              onChange={(e) => onFilterChange('searchQuery', e.target.value)}
              placeholder="Search by name, interests, city..."
              className="pl-10 h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant={showAdvanced ? 'gradient' : 'outline'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-1.5 text-xs flex-1 sm:flex-none rounded-xl"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{showAdvanced ? 'Hide filters' : 'Filters'}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="gap-1 text-xs text-slate-500 hover:text-slate-900 rounded-xl"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Expandable Optional Filters */}
        {showAdvanced && (
          <div className="pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Proficiency
              </label>
              <Select
                value={filters.proficiency}
                onChange={(e) => onFilterChange('proficiency', e.target.value)}
                className="h-9 text-xs rounded-xl"
              >
                <option value="all">Any proficiency</option>
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Beginner">Beginner</option>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Country
              </label>
              <Select
                value={filters.speakerLanguage}
                onChange={(e) => onFilterChange('speakerLanguage', e.target.value)}
                className="h-9 text-xs rounded-xl"
              >
                {countries.map((c) => (
                  <option key={c} value={c === 'All countries' ? 'all' : c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Interest
              </label>
              <Select
                value={filters.interest}
                onChange={(e) => onFilterChange('interest', e.target.value)}
                className="h-9 text-xs rounded-xl"
              >
                <option value="all">Any interest</option>
                {INTERESTS.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Availability
              </label>
              <Select
                value={filters.availability}
                onChange={(e) => onFilterChange('availability', e.target.value)}
                className="h-9 text-xs rounded-xl"
              >
                <option value="all">Any schedule</option>
                <option value="weekday">Weekday evenings</option>
                <option value="weekend">Weekends</option>
                <option value="flexible">Flexible</option>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

