import React from 'react';
import {
  Phone,
  Video,
  Search,
  Users,
  Paperclip,
  Send,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  CheckCheck,
  Check,
  ArrowLeft,
  Settings,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Conversation, Message, Profile, ConversationTopic } from '../../types';
import { Avatar } from '../ui/avatar';
import { cn } from '../../lib/utils';

interface ChatMessageCanvasProps {
  conversation: Conversation | null;
  partner?: Profile;
  currentUserId: string;
  messages: Message[];
  onSendMessage: (content: string, topicMeta?: { title: string; category: string }) => void;
  onOpenTopics: () => void;
  selectedTopic: ConversationTopic | null;
  onClearTopic: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onToggleRightPanel: () => void;
  isRightPanelOpen: boolean;
  onBackToConversations?: () => void;
  className?: string;
}

export function ChatMessageCanvas({
  conversation,
  partner,
  currentUserId,
  messages,
  onSendMessage,
  onOpenTopics,
  selectedTopic,
  onClearTopic,
  onStartCall,
  onToggleRightPanel,
  isRightPanelOpen,
  onBackToConversations,
  className,
}: ChatMessageCanvasProps) {
  const [inputText, setInputText] = React.useState('');
  const [showBanner, setShowBanner] = React.useState(true);
  const [searchInChat, setSearchInChat] = React.useState('');
  const [showSearchInput, setShowSearchInput] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    if (selectedTopic) {
      setInputText(`"${selectedTopic.prompt}" `);
      inputRef.current?.focus();
    }
  }, [selectedTopic]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const topicMeta = selectedTopic
      ? { title: selectedTopic.title, category: selectedTopic.category }
      : undefined;

    onSendMessage(inputText.trim(), topicMeta);
    setInputText('');
    onClearTopic();
  };

  const handleAttachPrompt = () => {
    const prompts = [
      'Habari! How was your weekend? Let us practice some conversational Swahili!',
      'Can you help me correct this phrase: "Ningependa kahawa tafadhali"?',
      'Here is an interesting cultural note about East African coffee traditions!',
    ];
    const picked = prompts[Math.floor(Math.random() * prompts.length)];
    setInputText(picked);
    inputRef.current?.focus();
  };

  const title = conversation?.id === 'conv-group-lc'
    ? 'LC chat'
    : partner?.display_name || 'Language Exchange';

  const subtitle = conversation?.id === 'conv-group-lc'
    ? '5 members · Swahili ⇄ English circle'
    : partner
    ? `${partner.country || 'Global'} · Speaks ${partner.native_languages[0]?.language.name || 'Native'} · Learning ${partner.learning_languages[0]?.language.name || 'English'}`
    : 'Active practice session';

  // Format timestamp e.g. "4:25 pm"
  const formatTime = (isoString?: string) => {
    if (!isoString) return '4:25 pm';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
  };

  // Filter messages if search active
  const displayedMessages = searchInChat
    ? messages.filter((m) => m.content.toLowerCase().includes(searchInChat.toLowerCase()))
    : messages;

  return (
    <div
      className={cn(
        'flex-1 flex flex-col bg-slate-950 text-slate-100 min-w-0 overflow-hidden relative',
        className
      )}
    >
      {/* TOP HEADER BAR */}
      <div className="h-16 px-5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0 z-10">
        {/* Left: Partner / Chat Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToConversations && (
            <button
              type="button"
              onClick={onBackToConversations}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-xl border border-slate-800"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0">
            <h3 className="font-heading font-bold text-base text-white truncate flex items-center gap-2">
              <span>{title}</span>
              {partner?.is_online && (
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
              )}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
          </div>
        </div>

        {/* Center / Right: Search & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchInChat}
              onChange={(e) => setSearchInChat(e.target.value)}
              placeholder="Search in chat..."
              className="w-44 md:w-56 bg-slate-900 border border-slate-800 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-xl placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchInChat && (
              <button
                onClick={() => setSearchInChat('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800/80">
            {/* Audio call button */}
            <button
              type="button"
              onClick={() => onStartCall('audio')}
              title="Start audio call"
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer border-0"
            >
              <Phone className="h-3.5 w-3.5 fill-slate-950 text-slate-950 mr-1.5" />
              <span>Call</span>
            </button>

            {/* Video button */}
            <button
              type="button"
              onClick={() => onStartCall('video')}
              title="Start video call"
              className="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-800"
            >
              <Video className="h-4 w-4" />
            </button>

            {/* Search toggle for mobile */}
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              title="Search"
              className="sm:hidden h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-800"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Members / Info Toggle Button */}
            <button
              type="button"
              onClick={onToggleRightPanel}
              title={isRightPanelOpen ? 'Hide details' : 'Show details'}
              className={cn(
                'h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border',
                isRightPanelOpen
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search dropdown */}
      {showSearchInput && (
        <div className="sm:hidden p-2 bg-slate-900 border-b border-slate-800">
          <input
            type="text"
            value={searchInChat}
            onChange={(e) => setSearchInChat(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-2 rounded-xl"
            autoFocus
          />
        </div>
      )}

      {/* MESSAGES SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
        {/* TOP SCENIC BANNER CARD */}
        {showBanner && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl mb-4 group">
            <div className="relative h-40 sm:h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
                alt="Exchange Landscape"
                className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full mb-1.5 shadow-sm">
                    Cultural Exchange Circle
                  </span>
                  <h4 className="font-heading font-black text-lg sm:text-xl text-white drop-shadow-md leading-tight">
                    {title} · Practice Space
                  </h4>
                  <p className="text-xs text-slate-200 font-medium drop-shadow mt-0.5">
                    Practice speaking, idioms, and everyday culture together
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBanner(false)}
                  className="px-2.5 py-1 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white text-[10px] font-bold rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Hide banner"
                >
                  <ChevronUp className="h-3 w-3" />
                  <span>Hide</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {!showBanner && (
          <div className="text-center py-1">
            <button
              onClick={() => setShowBanner(true)}
              className="text-[11px] text-slate-400 hover:text-indigo-400 underline flex items-center gap-1 mx-auto cursor-pointer"
            >
              <ChevronDown className="h-3 w-3" />
              <span>Show exchange banner</span>
            </button>
          </div>
        )}

        {/* Date Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="px-3.5 py-1 bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px] font-medium tracking-wider rounded-full">
            1 Sep 2024
          </div>
        </div>

        {/* System event */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-4 py-2 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-amber-400 rounded-full" />
            <span>
              <strong className="text-slate-200 font-bold">
                {partner?.display_name || 'Richard Wilson'}
              </strong>{' '}
              added <strong className="text-indigo-400 font-bold">You</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-500">4:15 pm</span>
        </div>

        {/* Messages List */}
        {displayedMessages.map((msg) => {
          const isSelf = msg.sender_id === currentUserId;
          const senderName = isSelf
            ? 'You'
            : partner?.display_name || 'Partner';
          const senderAvatar = isSelf
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            : partner?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80';

          return (
            <div
              key={msg.id}
              className="flex items-start gap-3 group py-1.5 hover:bg-slate-900/30 px-2 rounded-2xl transition-colors"
            >
              <Avatar
                src={senderAvatar}
                fallback={senderName.charAt(0)}
                size="md"
                className="mt-0.5 border border-slate-700 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      'font-heading font-bold text-xs',
                      isSelf ? 'text-indigo-400' : 'text-slate-200'
                    )}
                  >
                    {senderName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatTime(msg.created_at)}
                  </span>
                </div>

                {msg.is_topic_starter && msg.topic_title && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-lg mt-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Topic: {msg.topic_title}</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-1 break-words">
                  {msg.content.split(' ').map((word, i) => {
                    if (word.startsWith('@')) {
                      return (
                        <span
                          key={i}
                          className="text-amber-400 font-bold bg-amber-500/10 px-1 py-0.5 rounded mx-0.5"
                        >
                          {word}{' '}
                        </span>
                      );
                    }
                    return word + ' ';
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Date Divider 2 */}
        <div className="flex items-center justify-center my-4">
          <div className="px-3.5 py-1 bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px] font-medium tracking-wider rounded-full">
            Today
          </div>
        </div>

        {/* Video Call Event banner */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl shadow-sm my-2">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 border border-indigo-500/40">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {partner?.display_name || 'Richard Wilson'} started a practice video call
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Swahili & English live conversation session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartCall('video')}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer border-0"
          >
            Join Call
          </button>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* BOTTOM COMPOSER */}
      <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800/80 shrink-0">
        {selectedTopic && (
          <div className="mb-2.5 flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/40 text-xs text-amber-400 rounded-xl">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="h-4 w-4 shrink-0 text-amber-400" />
              <span className="font-bold truncate">Topic: {selectedTopic.title}</span>
            </div>
            <button
              type="button"
              onClick={onClearTopic}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 rounded-2xl focus-within:border-indigo-500 transition-all shadow-inner"
        >
          <button
            type="button"
            onClick={handleAttachPrompt}
            title="Attach practice prompt"
            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-transparent text-slate-100 text-xs sm:text-sm placeholder-slate-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={onOpenTopics}
            title="Choose conversation topic"
            className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            title="Send message"
            className={cn(
              'p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer border-0',
              inputText.trim()
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
