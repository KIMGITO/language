import React from 'react';
import { useChatStore } from '../stores/chatStore';
import { useProfileStore } from '../stores/profileStore';
import { useUiStore } from '../stores/uiStore';
import { useSafetyStore } from '../stores/safetyStore';
import { Profile, ConversationTopic } from '../types';
import { ChatSpaceRail } from '../components/chat/ChatSpaceRail';
import { ChatConversationList } from '../components/chat/ChatConversationList';
import { ChatMessageCanvas } from '../components/chat/ChatMessageCanvas';
import { ChatRightPanel } from '../components/chat/ChatRightPanel';
import { TopicPickerModal } from '../components/topics/TopicPickerModal';
import { EmptyConversationState } from '../components/chat/EmptyConversationState';
import { cn } from '../lib/utils';

export function MessagesPage() {
  const {
    conversations,
    activeConversationId,
    activeMessages,
    setActiveConversation,
    loadConversations,
    sendMessage,
  } = useChatStore();

  const { currentProfile } = useProfileStore();
  const { currentRouteParams, navigate } = useUiStore();
  const { openReportDialog, openBlockDialog } = useSafetyStore();

  const [activeSpaceId, setActiveSpaceId] = React.useState<string>('all');
  const [isRightPanelOpen, setIsRightPanelOpen] = React.useState<boolean>(true);
  const [topicModalOpen, setTopicModalOpen] = React.useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = React.useState<ConversationTopic | null>(null);
  const [mobileShowChat, setMobileShowChat] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle route params
  React.useEffect(() => {
    if (currentRouteParams.conversationId) {
      setActiveConversation(currentRouteParams.conversationId);
      setMobileShowChat(true);
    } else if (conversations.length > 0 && !activeConversationId) {
      // Default to Richard Wilson or first conversation
      const richard = conversations.find((c) => c.id === 'conv-richard');
      if (richard) {
        setActiveConversation(richard.id);
      } else {
        setActiveConversation(conversations[0].id);
      }
    }
  }, [currentRouteParams.conversationId, conversations, activeConversationId, setActiveConversation]);

  const activeConvo = conversations.find((c) => c.id === activeConversationId);
  const partner: Profile | undefined = activeConvo?.members.find(
    (m) => m.id !== currentProfile?.id
  );

  const handleSendMessage = (content: string, topicMeta?: { title: string; category: string }) => {
    if (!activeConversationId) return;
    sendMessage(content, topicMeta);
  };

  const handleSelectTopic = (topic: ConversationTopic) => {
    setSelectedTopic(topic);
    setTopicModalOpen(false);
  };

  const handleSelectSpace = (spaceId: string) => {
    setActiveSpaceId(spaceId);
    if (spaceId === 'icq') {
      const group = conversations.find((c) => c.id === 'conv-group-lc');
      if (group) {
        setActiveConversation(group.id);
        setMobileShowChat(true);
      }
    } else if (spaceId === 'all') {
      const richard = conversations.find((c) => c.id === 'conv-richard');
      if (richard) {
        setActiveConversation(richard.id);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950 select-none">
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: Leftmost Channel & Space Rail (Hidden on small mobile when chat is open) */}
        <ChatSpaceRail
          activeSpaceId={activeSpaceId}
          onSelectSpace={handleSelectSpace}
          onNewChat={() => navigate('discover')}
          className={cn(
            'transition-all duration-200',
            mobileShowChat ? 'hidden lg:flex' : 'flex'
          )}
        />

        {/* COLUMN 2: Conversations List (Hidden on mobile when chat is open) */}
        <ChatConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUserId={currentProfile?.id || ''}
          onSelectConversation={(id) => {
            setActiveConversation(id);
            setMobileShowChat(true);
          }}
          onFindPartners={() => navigate('discover')}
          className={cn(
            mobileShowChat ? 'hidden md:flex' : 'flex flex-1 md:flex-initial'
          )}
        />

        {/* COLUMN 3: Center Message Canvas */}
        {activeConvo ? (
          <ChatMessageCanvas
            conversation={activeConvo}
            partner={partner}
            currentUserId={currentProfile?.id || ''}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onOpenTopics={() => setTopicModalOpen(true)}
            selectedTopic={selectedTopic}
            onClearTopic={() => setSelectedTopic(null)}
            onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
            isRightPanelOpen={isRightPanelOpen}
            onBackToConversations={() => setMobileShowChat(false)}
            className={cn(
              !mobileShowChat ? 'hidden md:flex' : 'flex'
            )}
          />
        ) : (
          <div
            className={cn(
              'flex-1 flex items-center justify-center bg-slate-950',
              !mobileShowChat ? 'hidden md:flex' : 'flex'
            )}
          >
            <EmptyConversationState
              onDiscoverClick={() => navigate('discover')}
              onSelectTopic={handleSelectTopic}
            />
          </div>
        )}

        {/* COLUMN 4: Right Panel (Members & Files matching screenshot) */}
        {isRightPanelOpen && activeConvo && (
          <ChatRightPanel
            partner={partner}
            currentUserProfile={currentProfile}
            onSelectTopic={handleSelectTopic}
            onReportUser={() => partner && openReportDialog(partner)}
            onBlockUser={() => partner && openBlockDialog(partner)}
            onViewProfile={(userId) => navigate('user-profile', { userId })}
            onClose={() => setIsRightPanelOpen(false)}
            className={cn(
              'hidden xl:flex',
              // On tablet/mobile, can overlay or toggle
              mobileShowChat && isRightPanelOpen ? 'hidden xl:flex' : 'hidden'
            )}
          />
        )}
      </div>

      {/* Topic Picker Modal */}
      <TopicPickerModal
        open={topicModalOpen}
        onOpenChange={setTopicModalOpen}
        onSelectTopic={handleSelectTopic}
      />
    </div>
  );
}
