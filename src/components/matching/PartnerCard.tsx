import React from 'react';
import { MapPin, MessageSquare, User, MoreVertical, ShieldAlert, Ban, ArrowLeftRight, HeartHandshake, Sparkles } from 'lucide-react';
import { Profile, PartnerMatch } from '../../types';
import { PartnerAvatar } from '../common/PartnerAvatar';
import { LanguageBadge } from '../common/LanguageBadge';
import { LanguageLevel } from '../common/LanguageLevel';
import { AvailabilityBadge } from '../common/AvailabilityBadge';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu } from '../ui/dropdown-menu';
import { useSafetyStore } from '../../stores/safetyStore';
import { cn } from '../../lib/utils';

interface PartnerCardProps {
  key?: React.Key;
  partner: Profile;
  match?: PartnerMatch;
  onViewProfile: (partnerId: string) => void;
  onStartChat: (partner: Profile) => void;
  onConnect?: (partnerId: string) => void;
  connected?: boolean;
  className?: string;
}

export function PartnerCard({
  partner,
  match,
  onViewProfile,
  onStartChat,
  connected = false,
  className,
}: PartnerCardProps) {
  const { openReportDialog, openBlockDialog } = useSafetyStore();

  const overflowItems = [
    {
      label: 'View Profile',
      icon: <User className="h-4 w-4" />,
      onClick: () => onViewProfile(partner.id),
    },
    {
      label: 'Report User',
      icon: <ShieldAlert className="h-4 w-4 text-rose-600" />,
      onClick: () => openReportDialog(partner),
    },
    {
      label: `Block ${partner.display_name}`,
      icon: <Ban className="h-4 w-4 text-rose-600" />,
      destructive: true,
      onClick: () => openBlockDialog(partner),
    },
  ];

  const matchPercent = match?.compatibility_score ?? 90 + Math.floor((partner.display_name.charCodeAt(0) % 10));

  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden',
        className
      )}
    >
      {/* Decorative gradient top banner */}
      <div className="h-16 w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 relative opacity-90 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]" />
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
          <Badge variant="gold" className="text-[10px] gap-1 px-2.5 py-0.5 shadow-sm backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>{matchPercent}% Match</span>
          </Badge>
        </div>
      </div>

      <div className="p-5 pt-0 relative">
        {/* Avatar & Header info overlay */}
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="flex items-end gap-3">
            <div className="ring-4 ring-white rounded-full bg-white shadow-md">
              <PartnerAvatar
                src={partner.avatar_url}
                name={partner.display_name}
                isOnline={partner.is_online}
                size="lg"
              />
            </div>
            <div className="pb-1">
              <h3
                onClick={() => onViewProfile(partner.id)}
                className="font-heading text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-tight"
              >
                {partner.display_name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 font-medium">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{partner.country}</span>
                {partner.last_active && (
                  <>
                    <span>·</span>
                    <span className="text-[11px] text-slate-400">{partner.last_active}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu
            trigger={
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            }
            items={overflowItems}
          />
        </div>

        {/* Intent Tags */}
        {(partner.looking_for_exchange || partner.open_to_help) && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
            {partner.looking_for_exchange && (
              <Badge variant="blue" className="text-[11px] gap-1 py-0.5 px-2.5 font-medium">
                <ArrowLeftRight className="h-3 w-3" />
                <span>Reciprocal Exchange</span>
              </Badge>
            )}
            {partner.open_to_help && (
              <Badge variant="amber" className="text-[11px] gap-1 py-0.5 px-2.5 font-medium">
                <HeartHandshake className="h-3 w-3" />
                <span>Open to help</span>
              </Badge>
            )}
          </div>
        )}

        {/* Spoken Languages & Learning */}
        <div className="space-y-2 mb-4 text-xs bg-slate-50/70 rounded-xl p-3 border border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-slate-400 text-[10px] w-14 shrink-0 uppercase tracking-wider">
              Speaks
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {partner.native_languages.map((nl) => (
                <div key={nl.id} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                  <LanguageBadge language={nl.language} showFlag />
                  <LanguageLevel level={nl.proficiency} />
                </div>
              ))}
            </div>
          </div>

          {partner.learning_languages.length > 0 && (
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-slate-400 text-[10px] w-14 shrink-0 uppercase tracking-wider">
                Learning
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {partner.learning_languages.map((ll) => (
                  <div key={ll.id} className="flex items-center gap-1.5 bg-indigo-50/80 px-2 py-1 rounded-lg border border-indigo-100">
                    <LanguageBadge language={ll.language} showFlag />
                    <LanguageLevel level={ll.proficiency} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interests */}
        {partner.interests && partner.interests.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {partner.interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="text-[11px] font-medium text-slate-600 bg-slate-100/80 px-2.5 py-0.5 rounded-md">
                #{interest}
              </span>
            ))}
          </div>
        )}

        {/* Availability */}
        {partner.availability && (
          <div className="mb-2">
            <AvailabilityBadge availability={partner.availability} />
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 pt-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(partner.id)}
          className="flex-1 text-xs rounded-xl"
        >
          View Profile
        </Button>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => onStartChat(partner)}
          className="flex-1 text-xs gap-1.5 rounded-xl"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{connected ? 'Chat' : 'Connect'}</span>
        </Button>
      </div>
    </div>
  );
}

