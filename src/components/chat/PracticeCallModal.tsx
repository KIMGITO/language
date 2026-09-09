import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { Profile } from '../../types';
import { Avatar } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface PracticeCallModalProps {
  open: boolean;
  onClose: () => void;
  partner?: Profile;
  initialType?: 'audio' | 'video';
}

export function PracticeCallModal({
  open,
  onClose,
  partner,
  initialType = 'video',
}: PracticeCallModalProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(initialType === 'audio');
  const [callDuration, setCallDuration] = React.useState(14); // seconds elapsed
  const [activeSpeaker, setActiveSpeaker] = React.useState<'partner' | 'you'>('partner');

  React.useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const partnerName = partner?.display_name || 'Richard Wilson';
  const partnerAvatar = partner?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Call Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-emerald-500 animate-pulse rounded-full" />
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Live Practice Session
              </h3>
              <p className="text-xs text-slate-400">
                Connected with {partnerName} · Duration: {formatTimer(callDuration)}
              </p>
            </div>
          </div>

          <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
            Swahili ⇄ English
          </div>
        </div>

        {/* Video Canvas / Call Stage */}
        <div className="relative h-72 sm:h-84 bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
          {/* Partner Stage */}
          {!isVideoOff ? (
            <div className="relative w-full h-full rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                alt={partnerName}
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Partner Name overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80">
                <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
                <span className="text-xs font-bold text-white">{partnerName}</span>
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Speaking</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Avatar
                src={partnerAvatar}
                fallback={partnerName.charAt(0)}
                size="xl"
                className="mx-auto mb-3 ring-4 ring-amber-400/50 shadow-xl"
              />
              <h4 className="font-heading font-bold text-base text-white">{partnerName}</h4>
              <p className="text-xs text-slate-400 mt-1">Audio connection active</p>
            </div>
          )}

          {/* Self PiP thumbnail */}
          <div className="absolute top-4 right-4 w-28 h-20 bg-slate-800 border-2 border-slate-700 shadow-xl overflow-hidden rounded-2xl flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="You"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">
              You
            </span>
          </div>

          {/* Live Translation / Transcript prompt bar */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-slate-200">
                <strong className="text-amber-300">Prompt:</strong> "Describe your favorite traditional dish and how it is prepared."
              </span>
            </div>
            <button
              onClick={() => setActiveSpeaker(activeSpeaker === 'partner' ? 'you' : 'partner')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-[10px] rounded-xl border border-slate-700 cursor-pointer shrink-0"
            >
              Switch Turn
            </button>
          </div>
        </div>

        {/* Call Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-center gap-4">
          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              'h-12 w-12 flex items-center justify-center rounded-2xl transition-all cursor-pointer border',
              isMuted
                ? 'bg-rose-900/80 text-rose-200 border-rose-600'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            )}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Video toggle */}
          <button
            type="button"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={cn(
              'h-12 w-12 flex items-center justify-center rounded-2xl transition-all cursor-pointer border',
              isVideoOff
                ? 'bg-rose-900/80 text-rose-200 border-rose-600'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            )}
            title={isVideoOff ? 'Turn video on' : 'Turn video off'}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-6 h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 rounded-2xl transition-all border border-rose-500 cursor-pointer shadow-lg active:scale-95"
          >
            <PhoneOff className="h-4 w-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}

