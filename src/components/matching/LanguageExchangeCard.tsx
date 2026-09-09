import React from 'react';
import { ArrowLeftRight, MessageSquare, User } from 'lucide-react';
import { Profile, PartnerMatch } from '../../types';
import { PartnerAvatar } from '../common/PartnerAvatar';
import { LanguageBadge } from '../common/LanguageBadge';
import { LanguageLevel } from '../common/LanguageLevel';
import { MatchReason } from './MatchReason';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface LanguageExchangeCardProps {
  partner: Profile;
  match?: PartnerMatch;
  connected?: boolean;
  onViewProfile?: (userId: string) => void;
  onStartChat?: (partner: Profile) => void;
  onConnect?: (partner: Profile) => void;
  className?: string;
}

export function LanguageExchangeCard({
  partner,
  match,
  connected = false,
  onViewProfile,
  onStartChat,
  onConnect,
  className,
}: LanguageExchangeCardProps) {
  const isMutual = match?.match_type === 'mutual_exchange';

  return (
    <div
      className={cn(
        'rounded-none border border-app-border bg-app-surface p-5 transition-colors flex flex-col justify-between',
        className
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <PartnerAvatar
              src={partner.avatar_url}
              name={partner.display_name}
              isOnline={partner.is_online}
              size="lg"
            />
            <div>
              <h3 className="font-heading font-bold text-base text-app-text leading-tight">
                {partner.display_name}
              </h3>
              <p className="text-xs text-app-text-muted mt-0.5">
                {partner.country}
                {partner.last_active && <span> · {partner.last_active}</span>}
              </p>
            </div>
          </div>

          {isMutual && (
            <Badge variant="blue" className="text-[11px] gap-1 shrink-0 font-medium">
              <ArrowLeftRight className="h-3 w-3" />
              <span>Exchange</span>
            </Badge>
          )}
        </div>

        {/* Spoken and Learning Languages */}
        <div className="space-y-2 mb-3 text-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-app-text-muted text-[11px] w-16 shrink-0 uppercase tracking-wider">
              Speaks
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {partner.native_languages.map((nl) => (
                <div key={nl.id} className="flex items-center gap-1.5">
                  <LanguageBadge language={nl.language} showFlag />
                  <LanguageLevel level={nl.proficiency} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-app-text-muted text-[11px] w-16 shrink-0 uppercase tracking-wider">
                Learning
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {partner.learning_languages.map((ll) => (
                  <div key={ll.id} className="flex items-center gap-1.5">
                    <LanguageBadge language={ll.language} showFlag />
                    <LanguageLevel level={ll.proficiency} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        {partner.interests && partner.interests.length > 0 && (
          <div className="mb-3 text-xs">
            <span className="text-app-text-muted font-medium">Interests: </span>
            <span className="text-app-text font-medium">
              {partner.interests.slice(0, 4).join(', ')}
            </span>
          </div>
        )}

        {/* Match Reasons */}
        {match?.compatibility_reasons && match.compatibility_reasons.length > 0 && (
          <div className="mb-3 pt-2.5 border-t border-app-border">
            <MatchReason
              reasons={match.compatibility_reasons.slice(0, 3)}
              title="Compatibility"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-app-border flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile?.(partner.id)}
          className="flex-1 text-xs gap-1.5"
        >
          <User className="h-3.5 w-3.5" />
          <span>Profile</span>
        </Button>

        {connected ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => onStartChat?.(partner)}
            className="flex-1 text-xs gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => onStartChat ? onStartChat(partner) : onConnect?.(partner)}
            className="flex-1 text-xs gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Connect</span>
          </Button>
        )}
      </div>
    </div>
  );
}
