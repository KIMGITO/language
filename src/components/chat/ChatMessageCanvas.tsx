import React from 'react';
import {
  Search,
  Users,
  Paperclip,
  Send,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

  const formatTime = (isoString?: string) => {
    if (!isoString) return '4:25 pm';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
  };

  const displayedMessages = searchInChat
    ? messages.filter((m) => m.content.toLowerCase().includes(searchInChat.toLowerCase()))
    : messages;

  const renderContent = (content: string) =>
    content.split(' ').map((word, i) =>
      word.startsWith('@') ? (
        <span key={i} className="font-bold underline underline-offset-2">
          {word}{' '}
        </span>
      ) : (
        word + ' '
      )
    );

  return (
    <div
      className={cn(
        'flex-1 flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-w-0 overflow-hidden relative',
        className
      )}
    >
      {/* TOP HEADER BAR */}
      <div className="h-16 px-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToConversations && (
            <button
              type="button"
              onClick={onBackToConversations}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-700"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white truncate flex items-center gap-2">
              <span>{title}</span>
              {partner?.is_online && (
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
              )}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchInChat}
              onChange={(e) => setSearchInChat(e.target.value)}
              placeholder="Search in chat..."
              className="w-44 md:w-56 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-xl placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 transition-all"
            />
            {searchInChat && (
              <button
                onClick={() => setSearchInChat('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              title="Search"
              className="sm:hidden h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onToggleRightPanel}
              title={isRightPanelOpen ? 'Hide details' : 'Show details'}
              className={cn(
                'h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border',
                isRightPanelOpen
                  ? 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search dropdown */}
      {showSearchInput && (
        <div className="sm:hidden p-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={searchInChat}
            onChange={(e) => setSearchInChat(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-2 rounded-xl"
            autoFocus
          />
        </div>
      )}

      {/* MESSAGES SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 scrollbar-thin bg-slate-50/60 dark:bg-slate-950/40">
        {/* TOP SCENIC BANNER CARD */}
        {showBanner && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-5 group">
            <div className="relative h-40 sm:h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
                alt="Exchange Landscape"
                className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 bg-teal-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full mb-1.5 shadow-sm">
                    Cultural Exchange Circle
                  </span>
                  <h4 className="font-heading font-black text-lg sm:text-xl text-white drop-shadow-md leading-tight">
                    {title} · Practice Space
                  </h4>
                  <p className="text-xs text-slate-100 font-medium drop-shadow mt-0.5">
                    Practice speaking, idioms, and everyday culture together
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBanner(false)}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-700 text-[10px] font-bold rounded-xl border border-white/50 flex items-center gap-1 cursor-pointer transition-colors"
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
          <div className="text-center py-1 mb-3">
            <button
              onClick={() => setShowBanner(true)}
              className="text-[11px] text-slate-400 hover:text-teal-600 underline flex items-center gap-1 mx-auto cursor-pointer"
            >
              <ChevronDown className="h-3 w-3" />
              <span>Show exchange banner</span>
            </button>
          </div>
        )}

        {/* Date Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="px-3.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 text-[11px] font-medium tracking-wider rounded-full">
            1 Sep 2024
          </div>
        </div>

        {/* System event */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-4 py-2.5 bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-2xl mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-amber-400 rounded-full" />
            <span>
              <strong className="text-slate-700 dark:text-slate-200 font-bold">
                {partner?.display_name || 'Richard Wilson'}
              </strong>{' '}
              added <strong className="text-teal-600 dark:text-teal-400 font-bold">You</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-400">4:15 pm</span>
        </div>

        {/* Messages List — left/right aligned bubbles */}
        <AnimatePresence initial={false}>
          {displayedMessages.map((msg, i) => {
            const isSelf = msg.sender_id === currentUserId;
            const prevMsg = displayedMessages[i - 1];
            const showAvatar = !prevMsg || prevMsg.sender_id !== msg.sender_id;
            const senderAvatar = partner?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={cn(
                  'flex items-end gap-2 group',
                  isSelf ? 'justify-end' : 'justify-start',
                  showAvatar ? 'mt-3' : 'mt-0.5'
                )}
              >
                {!isSelf && (
                  <div className="w-7 shrink-0">
                    {showAvatar && (
                      <Avatar
                        src={senderAvatar}
                        fallback={(partner?.display_name || 'P').charAt(0)}
                        size="sm"
                        className="border border-slate-100 dark:border-slate-700"
                      />
                    )}
                  </div>
                )}

                <div className={cn('max-w-[78%] sm:max-w-[65%] flex flex-col', isSelf ? 'items-end' : 'items-start')}>
                  {msg.is_topic_starter && msg.topic_title && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-lg mb-1">
                      <BookOpen className="h-3 w-3" />
                      <span>Topic: {msg.topic_title}</span>
                    </div>
                  )}

                  <div
                    className={cn(
                      'px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed break-words shadow-2xs',
                      isSelf
                        ? 'bg-teal-500 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm'
                    )}
                  >
                    {renderContent(msg.content)}
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* BOTTOM COMPOSER */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
        {selectedTopic && (
          <div className="mb-2.5 flex items-center justify-between p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400 rounded-xl">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className="font-bold truncate">Topic: {selectedTopic.title}</span>
            </div>
            <button
              type="button"
              onClick={onClearTopic}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 rounded-2xl focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 dark:focus-within:ring-teal-900/30 transition-all"
        >
          <button
            type="button"
            onClick={handleAttachPrompt}
            title="Attach practice prompt"
            className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
          />

          <button
            type="button"
            onClick={onOpenTopics}
            title="Choose conversation topic"
            className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg transition-colors cursor-pointer"
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
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 hover:bg-teal-600 hover:scale-105'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
