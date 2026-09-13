import { supabase, isSupabaseConfigured } from './supabase';
import type { Conversation, Message, Profile } from '../types';
import { MOCK_PARTNERS, MOCK_CURRENT_USER } from '../data/mockData';

// ---------------------------------------------------------------
// Local mock state (used when Supabase is not configured)
// ---------------------------------------------------------------
let mockConversations: Conversation[] = [];
let mockMessages: Record<string, Message[]> = {};

export const chatService = {
  // ---------------------------------------------------------------
  // Fetch all conversations for a user (with last message + unread count)
  // ---------------------------------------------------------------
  async fetchConversations(userId: string): Promise<Conversation[]> {
    if (isSupabaseConfigured) {
      try {
        // Get conversation IDs the user is a member of
        const { data: memberRows, error: memberError } = await supabase
          .from('conversation_members')
          .select('conversation_id')
          .eq('user_id', userId);

        if (memberError) throw memberError;
        const convIds = (memberRows ?? []).map((r) => r.conversation_id);
        if (convIds.length === 0) return [];

        // Fetch conversations
        const { data: convRows, error: convError } = await supabase
          .from('conversations')
          .select('id, created_at, updated_at')
          .in('id', convIds)
          .order('updated_at', { ascending: false });

        if (convError) throw convError;

        // Fetch all members for these conversations
        const { data: allMembers } = await supabase
          .from('conversation_members')
          .select(`
            conversation_id,
            user:profiles (
              id, username, display_name, avatar_url, country, timezone,
              is_online, last_seen_at, availability
            )
          `)
          .in('conversation_id', convIds);

        // Fetch last message + unread count per conversation
        const convData = await Promise.all(
          (convRows ?? []).map(async (conv) => {
            const [{ data: lastMsgData }, { count: unreadCount }] = await Promise.all([
              supabase
                .from('messages')
                .select('id, conversation_id, sender_id, content, created_at, read_at')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
              supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', conv.id)
                .neq('sender_id', userId)
                .is('read_at', null),
            ]);

            const members = (allMembers ?? [])
              .filter((m) => m.conversation_id === conv.id)
              .map((m) => m.user as unknown as Profile)
              .filter(Boolean);

            return {
              id:          conv.id,
              created_at:  conv.created_at,
              updated_at:  conv.updated_at,
              members,
              last_message: lastMsgData ?? undefined,
              unread_count: unreadCount ?? 0,
            } as Conversation;
          })
        );

        return convData;
      } catch (e) {
        console.warn('[chatService] fetchConversations error:', e);
      }
    }

    await new Promise((r) => setTimeout(r, 150));
    return [...mockConversations];
  },

  // ---------------------------------------------------------------
  // Fetch messages for a conversation (paginated)
  // ---------------------------------------------------------------
  async fetchMessages(conversationId: string, limit = 50, before?: string): Promise<Message[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, is_topic_starter, topic_title, topic_category, read_at, created_at')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (before) {
          query = query.lt('created_at', before);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Return in ascending order (oldest first for display)
        return (data ?? []).reverse();
      } catch (e) {
        console.warn('[chatService] fetchMessages error:', e);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    return (mockMessages[conversationId] ?? []).slice(-limit);
  },

  // ---------------------------------------------------------------
  // Send a message
  // ---------------------------------------------------------------
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    topicMeta?: { title: string; category: string }
  ): Promise<Message> {
    const optimisticMsg: Message = {
      id:               `temp-${Date.now()}`,
      conversation_id:  conversationId,
      sender_id:        senderId,
      content,
      created_at:       new Date().toISOString(),
      read_at:          null,
      is_topic_starter: Boolean(topicMeta),
      topic_title:      topicMeta?.title,
      topic_category:   topicMeta?.category,
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id:  conversationId,
            sender_id:        senderId,
            content,
            is_topic_starter: Boolean(topicMeta),
            topic_title:      topicMeta?.title ?? null,
            topic_category:   topicMeta?.category ?? null,
          })
          .select()
          .single();

        if (error) throw error;
        return data as Message;
      } catch (e) {
        console.warn('[chatService] sendMessage error:', e);
      }
    }

    // Mock fallback
    if (!mockMessages[conversationId]) mockMessages[conversationId] = [];
    mockMessages[conversationId].push(optimisticMsg);

    const convIdx = mockConversations.findIndex((c) => c.id === conversationId);
    if (convIdx >= 0) {
      mockConversations[convIdx] = {
        ...mockConversations[convIdx],
        last_message: optimisticMsg,
        updated_at:   optimisticMsg.created_at,
      };
    }

    return optimisticMsg;
  },

  // ---------------------------------------------------------------
  // Mark all messages in a conversation as read
  // ---------------------------------------------------------------
  async markAsRead(conversationId: string, currentUserId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .neq('sender_id', currentUserId)
          .is('read_at', null);
      } catch (e) {
        console.warn('[chatService] markAsRead error:', e);
      }
    }

    const msgs = mockMessages[conversationId];
    if (msgs) {
      msgs.forEach((m) => {
        if (m.sender_id !== currentUserId) m.read_at = new Date().toISOString();
      });
    }
    const conv = mockConversations.find((c) => c.id === conversationId);
    if (conv) conv.unread_count = 0;
  },

  // ---------------------------------------------------------------
  // Get or create a 1-on-1 conversation (uses SQL function)
  // ---------------------------------------------------------------
  async getOrCreateConversation(userA: Profile, userB: Profile): Promise<Conversation> {
    if (isSupabaseConfigured) {
      try {
        const { data: convId, error } = await supabase.rpc('get_or_create_conversation', {
          p_user_a: userA.id,
          p_user_b: userB.id,
        });

        if (error) throw error;

        return {
          id:          convId,
          created_at:  new Date().toISOString(),
          updated_at:  new Date().toISOString(),
          members:     [userA, userB],
          unread_count: 0,
        };
      } catch (e) {
        console.warn('[chatService] getOrCreateConversation error:', e);
      }
    }

    // Mock fallback
    const existing = mockConversations.find((c) => c.members.some((m) => m.id === userB.id));
    if (existing) return existing;

    const newConv: Conversation = {
      id:           `conv-${userB.id}-${Date.now()}`,
      created_at:   new Date().toISOString(),
      updated_at:   new Date().toISOString(),
      members:      [userA, userB],
      unread_count: 0,
    };

    mockConversations.unshift(newConv);
    mockMessages[newConv.id] = [];
    return newConv;
  },

  // ---------------------------------------------------------------
  // Subscribe to new messages in a conversation (Realtime)
  // ---------------------------------------------------------------
  subscribeToMessages(conversationId: string, onMessage: (msg: Message) => void): () => void {
    if (!isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new) onMessage(payload.new as Message);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  },

  // ---------------------------------------------------------------
  // Subscribe to conversation list updates (unread count changes)
  //
  // Two separate, narrowly-filtered channels instead of one unfiltered
  // listener on `messages`/`conversations` (which have no direct user_id
  // column to filter on, so the old version fired for every user's
  // activity system-wide and triggered a refetch each time):
  //
  //  1. conversation_members INSERT filtered to this user — fires the
  //     moment someone else starts a brand-new conversation with you
  //     (get_or_create_conversation adds a membership row for you).
  //  2. messages INSERT filtered to the conversation ids you're already
  //     in — catches new messages in conversations you already know about.
  //
  // conversationIds should be refreshed (by re-calling this) whenever the
  // conversation list changes, so the filter doesn't go stale.
  // ---------------------------------------------------------------
  subscribeToConversations(userId: string, conversationIds: string[], onChange: () => void): () => void {
    if (!isSupabaseConfigured) return () => {};

    const membershipChannel = supabase
      .channel(`conv-membership:${userId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'conversation_members',
          filter: `user_id=eq.${userId}`,
        },
        () => onChange()
      )
      .subscribe();

    const channels = [membershipChannel];

    if (conversationIds.length > 0) {
      const messagesChannel = supabase
        .channel(`conv-messages:${userId}`)
        .on(
          'postgres_changes',
          {
            event:  'INSERT',
            schema: 'public',
            table:  'messages',
            filter: `conversation_id=in.(${conversationIds.join(',')})`,
          },
          () => onChange()
        )
        .subscribe();
      channels.push(messagesChannel);
    }

    return () => { channels.forEach((c) => supabase.removeChannel(c)); };
  },
};
