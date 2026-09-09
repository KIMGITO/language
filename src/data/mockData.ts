import { Language, ConversationTopic, Profile, PartnerMatch } from '../types';

export const LANGUAGES: Language[] = [
  { id: 'lang-en', code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 'lang-es', code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'lang-ja', code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'lang-fr', code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'lang-de', code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'lang-sw', code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { id: 'lang-pt', code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { id: 'lang-it', code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'lang-zh', code: 'zh', name: 'Mandarin Chinese', nativeName: '中文', flag: '🇨🇳' },
  { id: 'lang-ko', code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 'lang-ar', code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇪🇬' },
  { id: 'lang-hi', code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'lang-nl', code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { id: 'lang-ru', code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

export const INTERESTS = [
  'Travel',
  'Food & Cooking',
  'Music',
  'Technology',
  'Business & Career',
  'Sports & Fitness',
  'Movies & Cinema',
  'Culture & Traditions',
  'Books & Literature',
  'Everyday Life',
  'Art & Photography',
  'Nature & Outdoors',
  'Coffee & Cafes',
  'Philosophy & Ideas'
];

export const CONVERSATION_TOPICS: ConversationTopic[] = [
  {
    id: 'top-1',
    category: 'Food',
    difficulty: 'Intermediate',
    title: 'Traditional Comfort Food',
    prompt: "What is a traditional homemade meal from your hometown or country that everyone should experience once, and what memories does it hold for you?",
  },
  {
    id: 'top-2',
    category: 'Travel',
    difficulty: 'Beginner',
    title: 'A One-Month Escape',
    prompt: "If you could spend one full month anywhere in the world with no obligations, where would you go and what would your ideal day look like?",
  },
  {
    id: 'top-3',
    category: 'Culture',
    difficulty: 'Advanced',
    title: 'Untranslatable Words',
    prompt: "Is there a word or idiom in your native language that doesn't have an exact equivalent in English or other languages? How do you explain it?",
  },
  {
    id: 'top-4',
    category: 'Everyday Life',
    difficulty: 'Beginner',
    title: 'Morning Routines & Habits',
    prompt: "What does your morning routine look like on a typical weekday? Are you an early bird or a night owl?",
  },
  {
    id: 'top-5',
    category: 'Learning',
    difficulty: 'Intermediate',
    title: 'Language Learning Pitfalls',
    prompt: "What has been the most surprising or hilarious mistake you've made while learning a new language?",
  },
  {
    id: 'top-6',
    category: 'Music',
    difficulty: 'Beginner',
    title: 'Soundtrack of Your Life',
    prompt: "What kind of music do you listen to when you need to relax or concentrate? Can you recommend a local artist from your region?",
  },
  {
    id: 'top-7',
    category: 'Work',
    difficulty: 'Advanced',
    title: 'Work Culture Differences',
    prompt: "How would you describe the general attitude towards work-life balance and workplace hierarchy in your country compared to elsewhere?",
  },
  {
    id: 'top-8',
    category: 'Technology',
    difficulty: 'Intermediate',
    title: 'Apps We Cannot Live Without',
    prompt: "Which modern digital tool or app has fundamentally improved your day-to-day productivity or happiness?",
  },
  {
    id: 'top-9',
    category: 'Relationships & Friendship',
    difficulty: 'Intermediate',
    title: 'Making Friends Across Borders',
    prompt: "How easy is it to make new friends as an adult in your culture? Where do people usually meet?",
  },
  {
    id: 'top-10',
    category: 'Hobbies',
    difficulty: 'Beginner',
    title: 'Weekend Recharging',
    prompt: "What hobby or creative activity allows you to completely lose track of time on a free weekend afternoon?",
  }
];

export const MOCK_CURRENT_USER: Profile = {
  id: 'user-alex-demo',
  username: 'alex_rivers',
  display_name: 'Alex Rivers',
  bio: 'Native Swahili speaker and software designer. Passionate about architectural photography, specialty coffee, and practicing conversational English with friendly partners!',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  country: 'Kenya',
  timezone: 'GMT+3 (Nairobi)',
  created_at: '2024-01-15T10:00:00Z',
  is_online: true,
  last_active: 'Just now',
  availability: 'Weekday evenings & weekend mornings',
  learning_goals: 'Conversational fluency, natural idioms, and mutual cultural exchange',
  community_intent: ['practice', 'help_others', 'language_exchange'],
  open_to_help: true,
  looking_for_exchange: true,
  native_languages: [
    {
      id: 'ul-alex-sw',
      user_id: 'user-alex-demo',
      language_id: 'lang-sw',
      type: 'native',
      proficiency: 'Native',
      language: LANGUAGES[5], // Swahili
    }
  ],
  learning_languages: [
    {
      id: 'ul-alex-en',
      user_id: 'user-alex-demo',
      language_id: 'lang-en',
      type: 'learning',
      proficiency: 'Intermediate',
      language: LANGUAGES[0], // English
    }
  ],
  interests: ['Travel', 'Food & Cooking', 'Music', 'Technology', 'Art & Photography', 'Culture & Traditions'],
  preferred_topics: ['Everyday Life', 'Culture', 'Travel', 'Food']
};

export const MOCK_PARTNERS: Profile[] = [
  {
    id: 'partner-sarah',
    username: 'sarah_jenkins',
    display_name: 'Sarah Jenkins',
    bio: 'Anthropology teacher from Edinburgh. Exploring coastal East African history, proverbs, and literature. Excited to exchange English for Swahili!',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    country: 'United Kingdom',
    timezone: 'GMT+0 (London)',
    created_at: '2024-02-01T12:00:00Z',
    is_online: true,
    last_active: 'Online now',
    availability: 'Weekday evenings (18:00 - 21:00 GMT)',
    learning_goals: 'Swahili conversational fluency and local idioms',
    community_intent: ['practice', 'help_others', 'language_exchange'],
    open_to_help: true,
    looking_for_exchange: true,
    native_languages: [
      {
        id: 'ul-s-1',
        user_id: 'partner-sarah',
        language_id: 'lang-en',
        type: 'native',
        proficiency: 'Native',
        language: LANGUAGES[0], // English
      }
    ],
    learning_languages: [
      {
        id: 'ul-s-2',
        user_id: 'partner-sarah',
        language_id: 'lang-sw',
        type: 'learning',
        proficiency: 'Intermediate',
        language: LANGUAGES[5], // Swahili
      }
    ],
    interests: ['Travel', 'Music', 'Food & Cooking', 'Culture & Traditions', 'Books & Literature'],
    preferred_topics: ['Culture', 'Travel', 'Everyday Life']
  },
  {
    id: 'partner-john',
    username: 'john_miller',
    display_name: 'John Miller',
    bio: 'Retired high school educator from Seattle. Love chatting about tech, everyday life, and helping language learners build speaking confidence.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    country: 'United States',
    timezone: 'GMT-7 (Seattle)',
    created_at: '2024-01-20T08:00:00Z',
    is_online: true,
    last_active: 'Active 10m ago',
    availability: 'Flexible mornings & afternoons',
    learning_goals: 'Help motivated learners practice conversational English',
    community_intent: ['help_others', 'practice'],
    open_to_help: true,
    looking_for_exchange: false,
    native_languages: [
      {
        id: 'ul-j-1',
        user_id: 'partner-john',
        language_id: 'lang-en',
        type: 'native',
        proficiency: 'Native',
        language: LANGUAGES[0], // English
      }
    ],
    learning_languages: [],
    interests: ['Technology', 'Everyday Life', 'Sports & Fitness', 'Books & Literature'],
    preferred_topics: ['Technology', 'Work', 'Everyday Life']
  },
  {
    id: 'partner-maria',
    username: 'maria_valle',
    display_name: 'Maria Valle',
    bio: 'Journalist and food writer from Madrid. Love discussing world literature, tapas, and indie cinema. Currently learning Swahili and looking for practice!',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    country: 'Spain',
    timezone: 'GMT+1 (Madrid)',
    created_at: '2024-02-05T10:00:00Z',
    is_online: true,
    last_active: 'Active 2m ago',
    availability: 'Weekday evenings (18:00 - 21:00 CET)',
    learning_goals: 'Swahili greetings, pronunciation, and basic dialogue',
    community_intent: ['practice', 'language_exchange'],
    open_to_help: true,
    looking_for_exchange: true,
    native_languages: [
      {
        id: 'ul-m-1',
        user_id: 'partner-maria',
        language_id: 'lang-es',
        type: 'native',
        proficiency: 'Native',
        language: LANGUAGES[1], // Spanish
      }
    ],
    learning_languages: [
      {
        id: 'ul-m-2',
        user_id: 'partner-maria',
        language_id: 'lang-sw',
        type: 'learning',
        proficiency: 'Beginner',
        language: LANGUAGES[5], // Swahili
      }
    ],
    interests: ['Travel', 'Food & Cooking', 'Movies & Cinema', 'Culture & Traditions'],
    preferred_topics: ['Food', 'Culture', 'Everyday Life']
  },
  {
    id: 'partner-amara',
    username: 'amara_kioko',
    display_name: 'Amara Kioko',
    bio: 'Environmental educator in Nairobi. Enthusiastic about sustainable agriculture, folklore, and multilingual community workshops.',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
    country: 'Kenya',
    timezone: 'GMT+3 (Nairobi)',
    created_at: '2024-01-20T08:00:00Z',
    is_online: true,
    last_active: 'Online now',
    availability: 'Evenings & weekend afternoons',
    learning_goals: 'French basics & advanced global communication',
    community_intent: ['practice', 'help_others', 'language_exchange'],
    open_to_help: true,
    looking_for_exchange: true,
    native_languages: [
      {
        id: 'ul-a-1',
        user_id: 'partner-amara',
        language_id: 'lang-sw',
        type: 'native',
        proficiency: 'Native',
        language: LANGUAGES[5], // Swahili
      }
    ],
    learning_languages: [
      {
        id: 'ul-a-2',
        user_id: 'partner-amara',
        language_id: 'lang-en',
        type: 'learning',
        proficiency: 'Fluent',
        language: LANGUAGES[0], // English
      }
    ],
    interests: ['Nature & Outdoors', 'Culture & Traditions', 'Everyday Life', 'Travel'],
    preferred_topics: ['Culture', 'Travel', 'Everyday Life']
  },
  {
    id: 'partner-carlos',
    username: 'carlos_mendoza',
    display_name: 'Carlos Mendoza',
    bio: 'Graphic designer from Oaxaca, Mexico. Big fan of artisan pottery, cycling, and electronic music. Looking to practice spoken English.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    country: 'Mexico',
    timezone: 'GMT-6 (Mexico City)',
    created_at: '2024-02-10T14:30:00Z',
    is_online: false,
    last_active: 'Active 1h ago',
    availability: 'Weeknights & Sunday mornings',
    learning_goals: 'Conversational English fluency and slang comprehension',
    community_intent: ['practice', 'language_exchange'],
    open_to_help: true,
    looking_for_exchange: true,
    native_languages: [
      {
        id: 'ul-c-1',
        user_id: 'partner-carlos',
        language_id: 'lang-es',
        type: 'native',
        proficiency: 'Native',
        language: LANGUAGES[1], // Spanish
      }
    ],
    learning_languages: [
      {
        id: 'ul-c-2',
        user_id: 'partner-carlos',
        language_id: 'lang-en',
        type: 'learning',
        proficiency: 'Intermediate',
        language: LANGUAGES[0], // English
      }
    ],
    interests: ['Art & Photography', 'Music', 'Technology', 'Sports & Fitness'],
    preferred_topics: ['Music', 'Everyday Life', 'Hobbies']
  },
  {
    id: 'partner-kenji',
    username: 'kenji_sato',
    display_name: 'Kenji Sato',
    bio: 'Urban architect living in Kyoto. Fascinated by sustainable timber structures, classical piano, and language exchange.',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    country: 'Japan',
    timezone: 'GMT+9 (Tokyo)',
    created_at: '2024-01-25T11:00:00Z',
    is_online: true,
    last_active: 'Online now',
    availability: 'Morning 7am-9am JST & weekends',
    learning_goals: 'Conversational English practice for international collaboration',
    community_intent: ['practice', 'language_exchange'],
    open_to_help: true,
    looking_for_exchange: true,
    native_languages: [
      {
        id: 'ul-k-1',
        user_id: 'partner-kenji',
        language_id: 'lang-ja',
        type: 'native',
        proficiency: 'Native',
        language: LANGUAGES[2], // Japanese
      }
    ],
    learning_languages: [
      {
        id: 'ul-k-2',
        user_id: 'partner-kenji',
        language_id: 'lang-en',
        type: 'learning',
        proficiency: 'Advanced',
        language: LANGUAGES[0], // English
      }
    ],
    interests: ['Art & Photography', 'Music', 'Culture & Traditions', 'Travel'],
    preferred_topics: ['Culture', 'Hobbies', 'Travel']
  }
];

export const INITIAL_MATCHES: PartnerMatch[] = [
  {
    id: 'match-sarah',
    user_id: 'user-alex-demo',
    matched_user_id: 'partner-sarah',
    partner: MOCK_PARTNERS[0],
    match_type: 'mutual_exchange',
    exchange_headline: 'Great language exchange',
    exchange_description: 'You can help each other practice.',
    compatibility_score: 96,
    compatibility_reasons: [
      'Speaks English fluently, which you are learning',
      'Learning Swahili, which you speak natively',
      'Shared interests in Travel, Culture, and Music',
      'Similar evening practice schedule'
    ],
    status: 'connected',
    created_at: '2024-02-20T10:00:00Z'
  },
  {
    id: 'match-john',
    user_id: 'user-alex-demo',
    matched_user_id: 'partner-john',
    partner: MOCK_PARTNERS[1],
    match_type: 'fluent_partner',
    exchange_headline: 'English practice partner',
    exchange_description: 'John can help you practice English.',
    compatibility_score: 92,
    compatibility_reasons: [
      'Speaks English natively and is eager to help practice',
      'You are learning English',
      'Shared interest in Technology and Everyday Life',
      'Similar availability'
    ],
    status: 'suggested',
    created_at: '2024-02-21T11:30:00Z'
  },
  {
    id: 'match-maria',
    user_id: 'user-alex-demo',
    matched_user_id: 'partner-maria',
    partner: MOCK_PARTNERS[2],
    match_type: 'can_help',
    exchange_headline: 'Someone you can help',
    exchange_description: 'You can help Maria: Maria is learning Swahili.',
    compatibility_score: 88,
    compatibility_reasons: [
      'Maria is learning Swahili, which you speak natively',
      'Shared passion for Food & Cooking and Culture',
      'Seeking patient conversational exchange'
    ],
    status: 'suggested',
    created_at: '2024-02-22T09:15:00Z'
  },
  {
    id: 'match-carlos',
    user_id: 'user-alex-demo',
    matched_user_id: 'partner-carlos',
    partner: MOCK_PARTNERS[4],
    match_type: 'general',
    exchange_headline: 'English fellow learner',
    exchange_description: 'Practicing English together as peers.',
    compatibility_score: 84,
    compatibility_reasons: [
      'Both learning English conversational idioms',
      'Shared interests in Music and Creative arts',
      'Evening practice availability match'
    ],
    status: 'suggested',
    created_at: '2024-02-23T14:00:00Z'
  }
];
