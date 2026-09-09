-- ============================================================
-- Language Exchange — Seed Data
-- Migration 003: Languages, Interests, Conversation Topics
-- ============================================================

-- ============================================================
-- LANGUAGES
-- ============================================================
insert into public.languages (code, name, native_name, flag) values
  ('en', 'English',    'English',    '🇬🇧'),
  ('es', 'Spanish',    'Español',    '🇪🇸'),
  ('fr', 'French',     'Français',   '🇫🇷'),
  ('de', 'German',     'Deutsch',    '🇩🇪'),
  ('pt', 'Portuguese', 'Português',  '🇧🇷'),
  ('it', 'Italian',    'Italiano',   '🇮🇹'),
  ('ru', 'Russian',    'Русский',    '🇷🇺'),
  ('zh', 'Chinese',    '中文',        '🇨🇳'),
  ('ja', 'Japanese',   '日本語',      '🇯🇵'),
  ('ko', 'Korean',     '한국어',      '🇰🇷'),
  ('ar', 'Arabic',     'العربية',    '🇸🇦'),
  ('hi', 'Hindi',      'हिन्दी',     '🇮🇳'),
  ('sw', 'Swahili',    'Kiswahili',  '🇰🇪'),
  ('tr', 'Turkish',    'Türkçe',     '🇹🇷'),
  ('nl', 'Dutch',      'Nederlands', '🇳🇱'),
  ('pl', 'Polish',     'Polski',     '🇵🇱'),
  ('sv', 'Swedish',    'Svenska',    '🇸🇪'),
  ('da', 'Danish',     'Dansk',      '🇩🇰'),
  ('fi', 'Finnish',    'Suomi',      '🇫🇮'),
  ('no', 'Norwegian',  'Norsk',      '🇳🇴'),
  ('cs', 'Czech',      'Čeština',    '🇨🇿'),
  ('hu', 'Hungarian',  'Magyar',     '🇭🇺'),
  ('ro', 'Romanian',   'Română',     '🇷🇴'),
  ('uk', 'Ukrainian',  'Українська', '🇺🇦'),
  ('el', 'Greek',      'Ελληνικά',   '🇬🇷'),
  ('he', 'Hebrew',     'עברית',      '🇮🇱'),
  ('th', 'Thai',       'ไทย',        '🇹🇭'),
  ('vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳'),
  ('id', 'Indonesian', 'Bahasa Indonesia', '🇮🇩'),
  ('ms', 'Malay',      'Bahasa Melayu',    '🇲🇾'),
  ('fa', 'Persian',    'فارسی',      '🇮🇷'),
  ('bn', 'Bengali',    'বাংলা',      '🇧🇩'),
  ('ur', 'Urdu',       'اردو',       '🇵🇰'),
  ('ta', 'Tamil',      'தமிழ்',      '🇮🇳'),
  ('te', 'Telugu',     'తెలుగు',     '🇮🇳'),
  ('mr', 'Marathi',    'मराठी',      '🇮🇳'),
  ('ha', 'Hausa',      'Hausa',      '🇳🇬'),
  ('yo', 'Yoruba',     'Yorùbá',     '🇳🇬'),
  ('am', 'Amharic',    'አማርኛ',      '🇪🇹'),
  ('tl', 'Filipino',   'Filipino',   '🇵🇭')
on conflict (code) do nothing;

-- ============================================================
-- INTERESTS
-- ============================================================
insert into public.interests (name, category) values
  -- Arts & Culture
  ('Music',                'Arts & Culture'),
  ('Movies & TV',          'Arts & Culture'),
  ('Books & Literature',   'Arts & Culture'),
  ('Art & Design',         'Arts & Culture'),
  ('Photography',          'Arts & Culture'),
  ('Dance',                'Arts & Culture'),
  ('Theater & Performing Arts', 'Arts & Culture'),
  -- Food & Lifestyle
  ('Food & Cooking',       'Food & Lifestyle'),
  ('Travel',               'Food & Lifestyle'),
  ('Fashion & Style',      'Food & Lifestyle'),
  ('Fitness & Wellness',   'Food & Lifestyle'),
  ('Yoga & Meditation',    'Food & Lifestyle'),
  -- Sports
  ('Football (Soccer)',    'Sports'),
  ('Basketball',           'Sports'),
  ('Tennis',               'Sports'),
  ('Swimming',             'Sports'),
  ('Hiking & Outdoors',    'Sports'),
  ('Cycling',              'Sports'),
  -- Technology
  ('Technology',           'Technology'),
  ('Gaming',               'Technology'),
  ('Coding & Programming', 'Technology'),
  ('AI & Machine Learning','Technology'),
  -- Education & Career
  ('Education',            'Education & Career'),
  ('Business & Entrepreneurship', 'Education & Career'),
  ('Science',              'Education & Career'),
  ('History',              'Education & Career'),
  ('Politics & Society',   'Education & Career'),
  -- Culture & Traditions
  ('Culture & Traditions', 'Culture'),
  ('Religion & Spirituality', 'Culture'),
  ('Philosophy',           'Culture'),
  -- Nature
  ('Nature & Environment', 'Nature'),
  ('Animals & Pets',       'Nature'),
  ('Gardening',            'Nature'),
  -- Other
  ('Volunteering',         'Other'),
  ('Family & Parenting',   'Other'),
  ('Language Learning',    'Other')
on conflict (name) do nothing;

-- ============================================================
-- CONVERSATION TOPICS
-- ============================================================
insert into public.conversation_topics (title, prompt, category, difficulty) values
  -- Everyday Life
  ('Morning routines', 'Describe your typical morning routine. What do you usually do first thing when you wake up?', 'Everyday Life', 'Beginner'),
  ('Weekend plans', 'What are your plans for this weekend? Do you prefer staying in or going out?', 'Everyday Life', 'Beginner'),
  ('Grocery shopping habits', 'Where do you usually shop for food? Do you prefer markets or supermarkets?', 'Everyday Life', 'Beginner'),
  ('Public transportation', 'Do you use public transport in your city? What is it like?', 'Everyday Life', 'Beginner'),
  -- Food & Culture
  ('Traditional dishes', 'What is the most famous traditional dish from your country? How is it made?', 'Food', 'Beginner'),
  ('Street food', 'What is your favorite street food? Where do you usually get it?', 'Food', 'Beginner'),
  ('Food and memories', 'Is there a food that brings back a strong memory for you? Tell me about it.', 'Food', 'Intermediate'),
  ('Differences in meal times', 'What time do people eat dinner in your country? How is it different from other cultures?', 'Food', 'Intermediate'),
  -- Travel
  ('Dream destination', 'If you could travel anywhere in the world, where would you go and why?', 'Travel', 'Beginner'),
  ('Best travel experience', 'What is the best trip you have ever taken? What made it memorable?', 'Travel', 'Intermediate'),
  ('Packing tips', 'What do you always pack when travelling? Any essential items you never leave without?', 'Travel', 'Beginner'),
  ('Cultural differences while traveling', 'Have you ever been surprised by a cultural difference when visiting another country?', 'Travel', 'Advanced'),
  -- Language Learning
  ('Why are you learning this language?', 'What motivated you to start learning this language? What is your goal?', 'Language Learning', 'Beginner'),
  ('Hardest part of the language', 'What do you find most difficult about the language you are learning?', 'Language Learning', 'Intermediate'),
  ('Funny mistakes', 'Have you ever made a funny or embarrassing mistake in the language you are learning?', 'Language Learning', 'Intermediate'),
  ('Language learning tips', 'What methods or apps do you use to practice? What works best for you?', 'Language Learning', 'Beginner'),
  -- Culture
  ('National holidays', 'What is your favorite national holiday and how do people celebrate it?', 'Culture', 'Beginner'),
  ('Wedding traditions', 'What are the wedding traditions in your country? How long do weddings usually last?', 'Culture', 'Intermediate'),
  ('Superstitions', 'What are some common superstitions in your culture? Do you believe in any of them?', 'Culture', 'Intermediate'),
  ('Youth culture', 'How do young people spend their free time in your country? What is popular right now?', 'Culture', 'Intermediate'),
  -- Current Events
  ('Environmental awareness', 'What environmental issues are people most concerned about in your country?', 'Current Events', 'Advanced'),
  ('Technology in daily life', 'How has technology changed your daily life over the past 5 years?', 'Current Events', 'Intermediate'),
  ('Social media habits', 'Which social media apps do you use the most? How has social media changed communication?', 'Current Events', 'Beginner'),
  -- Fun & Hobbies
  ('Favorite childhood game', 'What was your favorite game to play as a child? Do people still play it?', 'Hobbies', 'Beginner'),
  ('Books vs movies', 'Do you prefer reading books or watching movies? Why?', 'Hobbies', 'Beginner'),
  ('Learning a new skill', 'Is there a skill you have always wanted to learn but never had time for?', 'Hobbies', 'Intermediate'),
  ('Music preferences', 'What kind of music do you usually listen to? Do you have a favorite artist?', 'Hobbies', 'Beginner'),
  -- Opinions
  ('Work-life balance', 'How important is work-life balance in your culture? Do people work long hours?', 'Opinion', 'Advanced'),
  ('Living in a city vs countryside', 'Would you prefer to live in a big city or the countryside? What are the pros and cons?', 'Opinion', 'Intermediate'),
  ('Ideal language partner', 'What qualities do you look for in a language exchange partner?', 'Language Learning', 'Beginner')
on conflict do nothing;
