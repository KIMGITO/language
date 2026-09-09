import React from 'react';
import {
  Users,
  FileText,
  Link2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Ban,
  Globe2,
  CheckCircle2,
  BookOpen,
  X,
  ExternalLink,
} from 'lucide-react';
import { Profile, ConversationTopic } from '../../types';
import { Avatar } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface ChatRightPanelProps {
  partner?: Profile;
  currentUserProfile?: Profile | null;
  onSelectTopic: (topic: ConversationTopic) => void;
  onReportUser: () => void;
  onBlockUser: () => void;
  onViewProfile: (userId: string) => void;
  onClose?: () => void;
  className?: string;
}

export function ChatRightPanel({
  partner,
  currentUserProfile,
  onSelectTopic,
  onReportUser,
  onBlockUser,
  onViewProfile,
  onClose,
  className,
}: ChatRightPanelProps) {
  const [showPhotos, setShowPhotos] = React.useState(true);

  // Simulated members list matching screenshot
  const members = [
    {
      id: partner?.id || 'partner-richard',
      name: partner?.display_name || 'Richard Wilson',
      avatar: partner?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      role: 'Admin',
      isOnline: true,
      country: partner?.country || 'United Kingdom',
    },
    {
      id: currentUserProfile?.id || 'user-alex',
      name: 'You',
      avatar: currentUserProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'Learner',
      isOnline: true,
      country: currentUserProfile?.country || 'Kenya',
    },
    {
      id: 'm-jaden',
      name: 'Jaden Parker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      role: 'Member',
      isOnline: false,
      country: 'Canada',
    },
    {
      id: 'm-connor',
      name: 'Connor Garcia',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      role: 'Member',
      isOnline: true,
      country: 'Spain',
    },
    {
      id: 'm-lawrence',
      name: 'Lawrence Patterson',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      role: 'Member',
      isOnline: false,
      country: 'Australia',
    },
  ];

  // Shared cultural photos matching thumbnails
  const sharedPhotos = [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=300&q=80',
      title: 'Savannah & Wildlife',
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
      title: 'Edinburgh Architecture',
    },
  ];

  return (
    <div
      className={cn(
        'w-full sm:w-80 bg-slate-900/90 border-l border-slate-800/80 text-slate-100 flex flex-col shrink-0 select-none overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" />
          <h3 className="font-heading font-bold text-sm text-white">Channel Info</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* MEMBERS CARD */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Members</span>
              <span className="text-slate-500 font-normal">({members.length})</span>
            </h4>
          </div>

          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                onClick={() => onViewProfile(member.id)}
                className="flex items-center justify-between gap-2 p-2 hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={member.avatar}
                    fallback={member.name.charAt(0)}
                    size="sm"
                    isOnline={member.isOnline}
                    className="border border-slate-700"
                  />
                  <div className="min-w-0">
                    <p className="font-heading text-xs font-bold text-slate-200 truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {member.country}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0',
                    member.role === 'Admin'
                      ? 'bg-indigo-600 text-white'
                      : member.role === 'Learner'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'text-slate-400 bg-slate-800/60'
                  )}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FILES & MEDIA CARD */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl">
          <div
            onClick={() => setShowPhotos(!showPhotos)}
            className="flex items-center justify-between cursor-pointer mb-3"
          >
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span>Shared Media & Files</span>
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span>15 Items</span>
              {showPhotos ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </div>
          </div>

          {showPhotos && (
            <div className="mb-3.5">
              <div className="grid grid-cols-2 gap-2">
                {sharedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative h-20 rounded-xl overflow-hidden border border-slate-700/80 group cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] text-white truncate font-medium">
                      {photo.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
            <div className="flex items-center justify-between text-xs text-slate-300 p-2 hover:bg-slate-800/50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>230 Shared Documents</span>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold">View</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 p-2 hover:bg-slate-800/50 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-slate-400" />
                <span>47 Resource Links</span>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold">Open</span>
            </div>
          </div>
        </div>

        {/* PRACTICE TOPICS & GUIDELINES */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2.5">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Exchange Guidelines</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Alternate 15 mins native language & 15 mins target language.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>Provide gentle grammar corrections during pauses.</span>
            </li>
          </ul>
        </div>

        {/* Safety actions */}
        {partner && (
          <div className="pt-2 space-y-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onReportUser}
              className="w-full py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              <span>Report safety issue</span>
            </button>
            <button
              type="button"
              onClick={onBlockUser}
              className="w-full py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-950/50 transition-all flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Block user</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
