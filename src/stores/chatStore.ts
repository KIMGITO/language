import { create } from 'zustand';
import { Conversation, Message, ConversationTopic, Profile } from '../types';
import { chatService } from '../services/chatService';
import { useProfileStore } from './profileStore';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  messages: Message[];
  activeMessages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  selectedTopic: ConversationTopic | null;
  isTopicPickerOpen: boolean;
  isTyping: boolean;
  error: string | null;
  unsubscribeRealtime: (() => void) | null;
  unsubscribeConvList: (() => void) | null;

  loadConversations: (userId?: string) => Promise<void>;
  fetchConversations: (userId?: string) => Promise<void>;
  subscribeConversations: (userId: string) => void;
  setActiveConversation: (conversationId: string) => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  startConversationWithPartner: (partner: Profile) => Promise<string>;
  startConversationWithUser: (partner: Profile) => Promise<Conversation | null>;
  sendMessage: (content: string, topicMeta?: { title: string; category: string }) => Promise<boolean>;
  markActiveAsRead: () => Promise<void>;
  setSelectedTopic: (topic: ConversationTopic | null) => void;
  setIsTopicPickerOpen: (open: boolean) => void;
  clearActiveConversation: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  activeConversationId: null,
  messages: [],
  activeMessages: [],
  loadingConversations: false,
  loadingMessages: false,
  sendingMessage: false,
  selectedTopic: null,
  isTopicPickerOpen: false,
  isTyping: false,
  error: null,
  unsubscribeRealtime: null,
  unsubscribeConvList: null,

  loadConversations: async (userId?: string) => {
    await get().fetchConversations(userId);
  },

  fetchConversations: async (userId?: string) => {
    const currentProfile = useProfileStore.getState().currentProfile;
    const id = userId || currentProfile?.id || 'user-alex-demo';
    set({ loadingConversations: true, error: null });
    try {
      const list = await chatService.fetchConversations(id);
      set({ conversations: list, loadingConversations: false });
    } catch (err: unknown) {
      set({
        loadingConversations: false,
        error: err instanceof Error ? err.message : 'Failed to load conversations',
      });
    }
  },

  subscribeConversations: (userId: string) => {
    // Cleanup previous subscription
    const prevUnsub = get().unsubscribeConvList;
    if (prevUnsub) prevUnsub();

    const unsub = chatService.subscribeToConversations(userId, () => {
      get().fetchConversations(userId);
    });
    set({ unsubscribeConvList: unsub });
  },

  setActiveConversation: async (conversationId: string) => {
    await get().selectConversation(conversationId);
  },

  selectConversation: async (conversationId: string) => {
    // Unsubscribe from previous conversation
    const prevUnsub = get().unsubscribeRealtime;
    if (prevUnsub) {
      prevUnsub();
      set({ unsubscribeRealtime: null });
    }

    const conv = get().conversations.find((c) => c.id === conversationId) || null;
    set({
      activeConversation: conv,
      activeConversationId: conversationId,
      loadingMessages: true,
      error: null,
    });

    try {
      const msgs = await chatService.fetchMessages(conversationId);
      set({ messages: msgs, activeMessages: msgs, loadingMessages: false });

      // Mark read
      const currentProfile = useProfileStore.getState().currentProfile;
      if (currentProfile) {
        await chatService.markAsRead(conversationId, currentProfile.id);
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unread_count: 0 } : c
          ),
        }));
      }

      // Setup Realtime subscription
      const unsub = chatService.subscribeToMessages(conversationId, (newMsg: Message) => {
        set((state) => {
          if (state.messages.some((m) => m.id === newMsg.id)) return state;
          return {
            messages: [...state.messages, newMsg],
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? { ...c, last_message: newMsg, updated_at: newMsg.created_at } : c
            ),
          };
        });
      });

      set({ unsubscribeRealtime: unsub });
    } catch (err: unknown) {
      set({
        loadingMessages: false,
        error: err instanceof Error ? err.message : 'Failed to load messages',
      });
    }
  },

  startConversationWithPartner: async (partner: Profile) => {
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!currentProfile) throw new Error('Not logged in');

    const conv = await chatService.getOrCreateConversation(currentProfile, partner);
    set((state) => {
      const exists = state.conversations.some((c) => c.id === conv.id);
      return {
        conversations: exists ? state.conversations : [conv, ...state.conversations],
      };
    });

    await get().selectConversation(conv.id);
    return conv.id;
  },

  startConversationWithUser: async (partner: Profile) => {
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!currentProfile) return null;

    const conv = await chatService.getOrCreateConversation(currentProfile, partner);
    set((state) => {
      const exists = state.conversations.some((c) => c.id === conv.id);
      return {
        conversations: exists ? state.conversations : [conv, ...state.conversations],
      };
    });

    await get().selectConversation(conv.id);
    return conv;
  },

  sendMessage: async (content: string, topicMeta?: { title: string; category: string }) => {
    const { activeConversation } = get();
    const currentProfile = useProfileStore.getState().currentProfile;
    if (!activeConversation || !currentProfile || !content.trim()) return false;

    set({ sendingMessage: true });
    try {
      const newMsg = await chatService.sendMessage(
        activeConversation.id,
        currentProfile.id,
        content.trim(),
        topicMeta
      );

      set((state) => {
        const updatedMsgs = [...state.messages, newMsg];
        const updatedConvs = state.conversations.map((c) =>
          c.id === activeConversation.id
            ? { ...c, last_message: newMsg, updated_at: newMsg.created_at }
            : c
        );
        return {
          messages: updatedMsgs,
          conversations: updatedConvs,
          sendingMessage: false,
          selectedTopic: null, // Clear topic after sharing
        };
      });

      // Simulate a partner reply in preview demo mode after a short natural delay
      const partner = activeConversation.members.find((m) => m.id !== currentProfile.id);
      if (partner) {
        setTimeout(() => {
          set({ isTyping: true });
          setTimeout(async () => {
            set({ isTyping: false });
            const replies: Record<string, string[]> = {
              'partner-maria': [
                '¡Qué interesante! Me gusta mucho esa perspectiva. ¿Cómo se dice eso comúnmente en inglés?',
                'I really enjoy practicing like this. In Spain, we also say "cada loco con su tema" when discussing that!',
                '¡Exacto! That makes total sense. Keep writing, your practice is paying off!'
              ],
              'partner-amara': [
                'Vizuri sana! That is a great reflection. In Swahili, we would say "Haba na haba, hujaza kibaba" (little by little fills the measure).',
                'Thank you for sharing that! How is the weather over there today?'
              ],
              'partner-carlos': [
                '¡Totalmente de acuerdo! Music and food definitely connect people across borders.',
                'Awesome explanation! I appreciate you helping me practice everyday English phrases.'
              ]
            };
            const list = replies[partner.id] || [
              'Thank you for practicing with me! That was a really interesting thought.',
              'I agree completely! Let me know if you want to explore another topic as well.'
            ];
            const partnerText = list[Math.floor(Math.random() * list.length)];
            
            const replyMsg: Message = {
              id: `msg-reply-${Date.now()}`,
              conversation_id: activeConversation.id,
              sender_id: partner.id,
              content: partnerText,
              created_at: new Date().toISOString(),
              read_at: null,
            };

            set((s) => ({
              messages: s.activeConversation?.id === activeConversation.id ? [...s.messages, replyMsg] : s.messages,
              conversations: s.conversations.map((c) =>
                c.id === activeConversation.id
                  ? { ...c, last_message: replyMsg, updated_at: replyMsg.created_at }
                  : c
              ),
            }));
          }, 1800);
        }, 1200);
      }

      return true;
    } catch (err: unknown) {
      set({
        sendingMessage: false,
        error: err instanceof Error ? err.message : 'Failed to send message',
      });
      return false;
    }
  },

  markActiveAsRead: async () => {
    const { activeConversation } = get();
    const currentProfile = useProfileStore.getState().currentProfile;
    if (activeConversation && currentProfile) {
      await chatService.markAsRead(activeConversation.id, currentProfile.id);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === activeConversation.id ? { ...c, unread_count: 0 } : c
        ),
      }));
    }
  },

  setSelectedTopic: (topic: ConversationTopic | null) => {
    set({ selectedTopic: topic });
  },

  setIsTopicPickerOpen: (open: boolean) => {
    set({ isTopicPickerOpen: open });
  },

  clearActiveConversation: () => {
    const unsub = get().unsubscribeRealtime;
    if (unsub) unsub();
    set({ activeConversation: null, activeConversationId: null, messages: [], activeMessages: [], unsubscribeRealtime: null });
  },

  clearError: () => set({ error: null }),
}));
