import { Grade } from '@/types';

export type Subject = 'math' | 'english' | 'python' | 'cpp';

export type EnglishLevel =
  | 'beginner'
  | 'elementary'
  | 'pre-intermediate'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced';

export const ENGLISH_LEVELS: Array<{ value: EnglishLevel; label: string; short: string }> = [
  { value: 'beginner', label: 'Beginner (A1)', short: 'A1' },
  { value: 'elementary', label: 'Elementary (A2)', short: 'A2' },
  { value: 'pre-intermediate', label: 'Pre-Intermediate (A2–B1)', short: 'A2–B1' },
  { value: 'intermediate', label: 'Intermediate (B1)', short: 'B1' },
  { value: 'upper-intermediate', label: 'Upper-Intermediate (B2)', short: 'B2' },
  { value: 'advanced', label: 'Advanced (C1)', short: 'C1' },
];

export type AnyTopic =
  | {
      id: string;
      subject: 'math';
      grade: Grade;
      title: string;
      description: string;
    }
  | {
      id: string;
      subject: 'english';
      level: EnglishLevel;
      title: string;
      description: string;
    }
  | {
      id: string;
      subject: 'python';
      title: string;
      description: string;
    }
  | {
      id: string;
      subject: 'cpp';
      title: string;
      description: string;
    };

/**
 * =====================
 *  Mathematics course
 * =====================
 */
export const MATH_TOPICS_BY_GRADE: Record<Grade, AnyTopic[]> = {
  7: [
    { id: 'g7-numbers-operations', subject: 'math', grade: 7, title: 'Сандар және амалдар', description: 'Бүтін, рационал сандар, бөлшектер, ондық бөлшектер және амалдар' },
    { id: 'g7-expressions', subject: 'math', grade: 7, title: 'Өрнектер және теңбе-теңдіктер', description: 'Өрнектерді түрлендіру, жақшаларды ашу, ықшамдау' },
    { id: 'g7-linear-equations', subject: 'math', grade: 7, title: 'Бір айнымалысы бар сызықтық теңдеу', description: 'Сызықтық теңдеулерді шешу және мәтіндік есептер' },
    { id: 'g7-inequalities', subject: 'math', grade: 7, title: 'Теңсіздіктер (негіздері)', description: 'Қарапайым теңсіздіктер, сан аралықтары, координаталық сәуле' },
    { id: 'g7-ratios-proportions', subject: 'math', grade: 7, title: 'Қатынас және пропорция', description: 'Қатынастар, пропорциялар, масштаб және тура/кері пропорционалдық' },
    { id: 'g7-percentages', subject: 'math', grade: 7, title: 'Проценттер', description: 'Процентке есептер: өсім/кемім, бөлігін табу, салыстыру' },
    { id: 'g7-coordinate-plane', subject: 'math', grade: 7, title: 'Координаталық жазықтық', description: 'Нүктелер координаталары, графиктің негізгі түсініктері' },
    { id: 'g7-geometry-angles-lines', subject: 'math', grade: 7, title: 'Геометрия: бұрыштар және түзулер', description: 'Қиылысқан/параллель түзулер, бұрыш түрлері, қасиеттері' },
    { id: 'g7-triangles', subject: 'math', grade: 7, title: 'Үшбұрыштар', description: 'Үшбұрыш түрлері, бұрыштар қосындысы, негізгі қасиеттер' },
    { id: 'g7-perimeter-area', subject: 'math', grade: 7, title: 'Периметр және аудан', description: 'Тік төртбұрыш, параллелограмм, үшбұрыш аудандары және қолдану' },
    { id: 'g7-data-probability', subject: 'math', grade: 7, title: 'Деректер және ықтималдық (бастапқы)', description: 'Диаграммалар, орташа мән, медиана, қарапайым ықтималдық' },
  ],
  8: [
    { id: 'g8-algebraic-fractions', subject: 'math', grade: 8, title: 'Алгебралық бөлшектер', description: 'Рационал өрнектер, қысқарту, ортақ бөлім' },
    { id: 'g8-linear-function', subject: 'math', grade: 8, title: 'Сызықтық функция', description: 'y = kx + b графигі, көлбеулік, қиылысу, қолданбалы есептер' },
    { id: 'g8-systems-linear', subject: 'math', grade: 8, title: 'Сызықтық теңдеулер жүйесі', description: 'Қосу/алмастыру әдістері, график арқылы шешу' },
    { id: 'g8-inequalities-systems', subject: 'math', grade: 8, title: 'Теңсіздіктер және жүйелер', description: 'Сызықтық теңсіздіктер, қос теңсіздік, жүйелер' },
    { id: 'g8-powers-roots', subject: 'math', grade: 8, title: 'Дәрежелер және түбірлер', description: 'Дәреже қасиеттері, квадрат түбір, иррационал өрнектер' },
    { id: 'g8-quadratic-intro', subject: 'math', grade: 8, title: 'Квадрат теңдеуге кіріспе', description: 'Толық квадрат, квадрат теңдеудің қарапайым түрлері' },
    { id: 'g8-pythagoras', subject: 'math', grade: 8, title: 'Пифагор теоремасы', description: 'Тікбұрышты үшбұрыш, қолданбалы есептер' },
    { id: 'g8-similarity', subject: 'math', grade: 8, title: 'Ұқсастық', description: 'Ұқсас үшбұрыштар, ұқсастық коэффициенті, масштаб' },
    { id: 'g8-circle-basics', subject: 'math', grade: 8, title: 'Шеңбер және дөңгелек', description: 'Хорда, доға, бұрыштар, ұзындық және аудан' },
    { id: 'g8-geometry-quadrilaterals', subject: 'math', grade: 8, title: 'Төртбұрыштар', description: 'Параллелограмм, ромб, трапеция қасиеттері және аудан' },
    { id: 'g8-statistics-probability', subject: 'math', grade: 8, title: 'Статистика және ықтималдық', description: 'Дисперсия/шашырау идеясы, ықтималдықты есептеу' },
  ],
  9: [
    { id: 'g9-polynomials-factorization', subject: 'math', grade: 9, title: 'Көпмүше және жіктеу', description: 'Көбейткіштерге жіктеу, қысқаша көбейту формулалары' },
    { id: 'g9-quadratic-equations', subject: 'math', grade: 9, title: 'Квадрат теңдеулер', description: 'Дискриминант, Виет теоремасы, қолдану' },
    { id: 'g9-quadratic-function', subject: 'math', grade: 9, title: 'Квадрат функция', description: 'Парабола, төбе, ось, график және қасиеттері' },
    { id: 'g9-irrational-equations', subject: 'math', grade: 9, title: 'Иррационал теңдеулер', description: 'Түбірі бар теңдеулерді шешу және тексеру' },
    { id: 'g9-sequences', subject: 'math', grade: 9, title: 'Сан тізбектері', description: 'Арифметикалық және геометриялық прогрессия' },
    { id: 'g9-trigonometry-basics', subject: 'math', grade: 9, title: 'Тригонометрия негіздері', description: 'sin, cos, tg, тікбұрышты үшбұрыштағы қатынастар' },
    { id: 'g9-coordinate-geometry', subject: 'math', grade: 9, title: 'Координаталық геометрия', description: 'Қашықтық, орта нүкте, түзу теңдеуі (негіздері)' },
    { id: 'g9-geometry-circle-theorems', subject: 'math', grade: 9, title: 'Шеңбер теоремалары', description: 'Шеңбердегі бұрыштар, жанама және хорда' },
    { id: 'g9-geometry-solid', subject: 'math', grade: 9, title: 'Кеңістік фигуралары (бастапқы)', description: 'Призма, цилиндр, конус, шар: бет ауданы және көлем' },
    { id: 'g9-statistics', subject: 'math', grade: 9, title: 'Деректерді талдау', description: 'Диаграммалар, корреляция идеясы, ықтималдық үлгілері' },
  ],
  10: [
    { id: 'g10-exponential-log', subject: 'math', grade: 10, title: 'Көрсеткіштік және логарифмдік функциялар', description: 'Экспонента, логарифм қасиеттері, теңдеулер/теңсіздіктер' },
    { id: 'g10-trigonometry', subject: 'math', grade: 10, title: 'Тригонометриялық функциялар', description: 'Графиктер, периодтылық, негізгі теңдеулер' },
    { id: 'g10-trig-identities', subject: 'math', grade: 10, title: 'Тригонометриялық теңбе-теңдіктер', description: 'Негізгі формулалар, түрлендіру, дәлелдеу' },
    { id: 'g10-functions', subject: 'math', grade: 10, title: 'Функциялар және түрлендірулер', description: 'Графикті жылжыту/созу, кері функция ұғымы' },
    { id: 'g10-advanced-quadratic', subject: 'math', grade: 10, title: 'Квадрат теңдеулерді тереңдету', description: 'Параметрі бар есептер, теңсіздіктер, график әдістері' },
    { id: 'g10-combinatorics', subject: 'math', grade: 10, title: 'Комбинаторика', description: 'Қайталанбайтын/қайталанатын орналастыру, комбинация, факториал' },
    { id: 'g10-probability', subject: 'math', grade: 10, title: 'Ықтималдық', description: 'Классикалық ықтималдық, оқиғалар, шартты ықтималдық (бастапқы)' },
    { id: 'g10-geometry-stereometry', subject: 'math', grade: 10, title: 'Стереометрия', description: 'Призма, пирамида, цилиндр, конус: қималар, көлемдер' },
    { id: 'g10-analytic-geometry', subject: 'math', grade: 10, title: 'Аналитикалық геометрия', description: 'Түзу/шеңбер теңдеулері, қиылысу, арақашықтық' },
    { id: 'g10-derivative-intro', subject: 'math', grade: 10, title: 'Туындыға кіріспе', description: 'Өсу/кему, жанама, экстремум идеясы (негіздері)' },
  ],
  11: [
    { id: 'g11-limits-continuity', subject: 'math', grade: 11, title: 'Шектер және үздіксіздік', description: 'Шек ұғымы, негізгі қасиеттер, үздіксіздік' },
    { id: 'g11-derivatives', subject: 'math', grade: 11, title: 'Туындылар және қолдану', description: 'Туынды ережелері, зерттеу, оптимизация есептері' },
    { id: 'g11-integrals', subject: 'math', grade: 11, title: 'Интегралға кіріспе', description: 'Алғашқы функция, анықталған интеграл, аудан' },
    { id: 'g11-trigonometry-advanced', subject: 'math', grade: 11, title: 'Тригонометрия (кеңейтілген)', description: 'Теңдеулер, түрлендіру формулалары, параметрлі есептер' },
    { id: 'g11-vectors', subject: 'math', grade: 11, title: 'Векторлар', description: 'Векторлық амалдар, скаляр көбейтінді, қолдану' },
    { id: 'g11-matrices', subject: 'math', grade: 11, title: 'Матрицалар және жүйелер', description: 'Матрица амалдары, детерминант идеясы, теңдеулер жүйесі' },
    { id: 'g11-probability-statistics', subject: 'math', grade: 11, title: 'Ықтималдық және статистика', description: 'Үлестірім идеясы, математикалық күтім, дисперсия (негіздері)' },
    { id: 'g11-geometry-3d', subject: 'math', grade: 11, title: 'Кеңістік геометриясы', description: 'Қималар, бұрыштар, арақашықтықтар, стереометрия есептері' },
    { id: 'g11-analytic-geometry', subject: 'math', grade: 11, title: 'Аналитикалық геометрия (тереңдету)', description: 'Конус қималары негіздері, координаталық әдістер' },
  ],
};

export function getMathTopicsByGrade(grade: Grade) {
  return (MATH_TOPICS_BY_GRADE[grade] ?? []) as AnyTopic[];
}

/**
 * =====================
 *  English course
 * =====================
 */

export const ENGLISH_LEVEL_LABELS: Record<EnglishLevel, string> = {
  beginner: 'Beginner (A1)',
  elementary: 'Elementary (A2)',
  'pre-intermediate': 'Pre-Intermediate (A2–B1)',
  intermediate: 'Intermediate (B1)',
  'upper-intermediate': 'Upper-Intermediate (B2)',
  advanced: 'Advanced (C1)',
};

export const ENGLISH_TOPICS_BY_LEVEL: Record<EnglishLevel, AnyTopic[]> = {
  beginner: [
    {
      id: 'en-a1-be-verb',
      subject: 'english',
      level: 'beginner',
      title: 'Verb “to be” (am/is/are)',
      description: 'Introduce yourself, say where you are, describe things',
    },
    {
      id: 'en-a1-present-simple',
      subject: 'english',
      level: 'beginner',
      title: 'Present Simple',
      description: 'Daily routines, habits, “I play / he plays”',
    },
    {
      id: 'en-a1-questions',
      subject: 'english',
      level: 'beginner',
      title: 'Basic Questions (Do/Does, Wh-)',
      description: 'Ask about people, places, time, and routines',
    },
    {
      id: 'en-a1-articles',
      subject: 'english',
      level: 'beginner',
      title: 'Articles (a/an/the)',
      description: 'When to use “a”, “an”, “the” in simple sentences',
    },
    {
      id: 'en-a1-there-is-are',
      subject: 'english',
      level: 'beginner',
      title: 'There is / There are',
      description: 'Talk about what exists in a place',
    },
    {
      id: 'en-a1-possessive',
      subject: 'english',
      level: 'beginner',
      title: 'Possessives (my/your/his/her)',
      description: 'Talk about ownership: my phone, her bag, our school',
    },
    {
      id: 'en-a1-prepositions-place',
      subject: 'english',
      level: 'beginner',
      title: 'Prepositions of Place (in/on/under)',
      description: 'Describe where things are: in the bag, on the table',
    },
    {
      id: 'en-a1-vocab-daily',
      subject: 'english',
      level: 'beginner',
      title: 'Daily Vocabulary + Pronunciation Tips',
      description: 'Core words for school, home, time + how to say them',
    },
  ],
  elementary: [
    {
      id: 'en-a2-past-simple',
      subject: 'english',
      level: 'elementary',
      title: 'Past Simple',
      description: 'Talk about yesterday: regular/irregular verbs',
    },
    {
      id: 'en-a2-future-going-to',
      subject: 'english',
      level: 'elementary',
      title: 'Future: “going to”',
      description: 'Plans and intentions: I’m going to study',
    },
    {
      id: 'en-a2-countable-uncountable',
      subject: 'english',
      level: 'elementary',
      title: 'Countable vs Uncountable',
      description: 'a few / a little, some / any, much / many',
    },
    {
      id: 'en-a2-comparatives',
      subject: 'english',
      level: 'elementary',
      title: 'Comparatives & Superlatives',
      description: 'bigger, the best, more interesting',
    },
    {
      id: 'en-a2-modal-can-could',
      subject: 'english',
      level: 'elementary',
      title: 'Modals: can / could',
      description: 'Ability, requests, permissions',
    },
    {
      id: 'en-a2-adverbs-frequency',
      subject: 'english',
      level: 'elementary',
      title: 'Adverbs of Frequency',
      description: 'always/usually/sometimes + word order',
    },
    {
      id: 'en-a2-vocab-travel',
      subject: 'english',
      level: 'elementary',
      title: 'Travel Vocabulary + Dialogues',
      description: 'At the airport, hotel, asking for directions',
    },
    {
      id: 'en-a2-reading-strategy',
      subject: 'english',
      level: 'elementary',
      title: 'Reading Strategy: Skimming & Scanning',
      description: 'Read faster: get the main idea & find specific info',
    },
  ],
  'pre-intermediate': [
    {
      id: 'en-a2b1-present-continuous-vs-simple',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Present Simple vs Present Continuous',
      description: 'Habits vs actions happening now',
    },
    {
      id: 'en-a2b1-present-perfect',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Present Perfect',
      description: 'Experience, results, “ever/never/just/already”',
    },
    {
      id: 'en-a2b1-past-simple-vs-perfect',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Past Simple vs Present Perfect',
      description: 'When we say “when” vs “life experience”',
    },
    {
      id: 'en-a2b1-modals-must-have-to',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Modals: must / have to / should',
      description: 'Rules, necessity, advice',
    },
    {
      id: 'en-a2b1-phrasal-verbs-1',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Phrasal Verbs (starter set)',
      description: 'get up, look for, turn on/off, give up',
    },
    {
      id: 'en-a2b1-articles-advanced',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Articles: common mistakes',
      description: 'Zero article, “the” for unique things, countries, etc.',
    },
    {
      id: 'en-a2b1-vocab-technology',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Technology Vocabulary',
      description: 'Apps, devices, internet, online safety',
    },
    {
      id: 'en-a2b1-speaking-small-talk',
      subject: 'english',
      level: 'pre-intermediate',
      title: 'Speaking: Small Talk',
      description: 'Start/keep a conversation: questions, reactions',
    },
  ],
  intermediate: [
    {
      id: 'en-ielts-reading',
      subject: 'english',
      level: 'intermediate',
      title: 'IELTS Reading Practice',
      description: 'Тренировка Reading как на IELTS: текст + вопросы (A–D)',
    },
    {
      id: 'en-b1-conditionals-1',
      subject: 'english',
      level: 'intermediate',
      title: 'First Conditional',
      description: 'Real future situations: If I study, I will pass',
    },
    {
      id: 'en-b1-conditionals-2',
      subject: 'english',
      level: 'intermediate',
      title: 'Second Conditional',
      description: 'Unreal present/future: If I had time, I would...',
    },
    {
      id: 'en-b1-passive-voice',
      subject: 'english',
      level: 'intermediate',
      title: 'Passive Voice',
      description: 'The phone was invented… focus on the action/result',
    },
    {
      id: 'en-b1-reported-speech',
      subject: 'english',
      level: 'intermediate',
      title: 'Reported Speech',
      description: 'He said that… / She told me to…',
    },
    {
      id: 'en-b1-relative-clauses',
      subject: 'english',
      level: 'intermediate',
      title: 'Relative Clauses (who/which/that)',
      description: 'Describe people and things in one sentence',
    },
    {
      id: 'en-b1-phrasal-verbs-2',
      subject: 'english',
      level: 'intermediate',
      title: 'Phrasal Verbs (everyday)',
      description: 'work out, find out, put off, look after',
    },
    {
      id: 'en-b1-writing-email',
      subject: 'english',
      level: 'intermediate',
      title: 'Writing: Emails & Messages',
      description: 'Polite requests, structure, common phrases',
    },
    {
      id: 'en-b1-listening-strategy',
      subject: 'english',
      level: 'intermediate',
      title: 'Listening Strategy',
      description: 'Keywords, prediction, and how to stop translating',
    },
  ],
  'upper-intermediate': [
    {
      id: 'en-b2-mixed-conditionals',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Mixed Conditionals',
      description: 'Connect past and present: If I had studied… I would…',
    },
    {
      id: 'en-b2-modal-perfect',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Perfect Modals',
      description: 'might have, must have, should have',
    },
    {
      id: 'en-b2-advanced-passive',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Advanced Passive',
      description: 'Have/get something done, passive reporting verbs',
    },
    {
      id: 'en-b2-inversion',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Inversion (Never have I…)',
      description: 'Emphasis in formal English',
    },
    {
      id: 'en-b2-collocations',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Collocations',
      description: 'Make natural combinations: make a decision, heavy rain',
    },
    {
      id: 'en-b2-discourse-markers',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Linking Words & Discourse Markers',
      description: 'However, therefore, moreover, on the other hand',
    },
    {
      id: 'en-b2-writing-essay',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Writing: Opinion Essay',
      description: 'Clear structure, arguments, counter-arguments',
    },
    {
      id: 'en-b2-vocab-idioms',
      subject: 'english',
      level: 'upper-intermediate',
      title: 'Idioms (common)',
      description: 'Everyday idioms + how to use them naturally',
    },
  ],
  advanced: [
    {
      id: 'en-c1-subjunctive',
      subject: 'english',
      level: 'advanced',
      title: 'Subjunctive & Formal Structures',
      description: 'It is essential that he be… / Were I to…',
    },
    {
      id: 'en-c1-style-register',
      subject: 'english',
      level: 'advanced',
      title: 'Style & Register',
      description: 'Formal vs informal, academic tone',
    },
    {
      id: 'en-c1-hedging',
      subject: 'english',
      level: 'advanced',
      title: 'Hedging & Nuance',
      description: 'Sound smart: might, tends to, appears to',
    },
    {
      id: 'en-c1-advanced-collocations',
      subject: 'english',
      level: 'advanced',
      title: 'Advanced Collocations',
      description: 'Natural academic combinations and chunks',
    },
    {
      id: 'en-c1-argumentation',
      subject: 'english',
      level: 'advanced',
      title: 'Argumentation & Critical Thinking',
      description: 'Build strong arguments and refute politely',
    },
    {
      id: 'en-c1-paraphrasing',
      subject: 'english',
      level: 'advanced',
      title: 'Paraphrasing',
      description: 'Say the same meaning in different words',
    },
    {
      id: 'en-c1-reading-inference',
      subject: 'english',
      level: 'advanced',
      title: 'Reading: Inference & Tone',
      description: 'Read between the lines and catch author’s attitude',
    },
    {
      id: 'en-c1-idioms-advanced',
      subject: 'english',
      level: 'advanced',
      title: 'Idioms (advanced)',
      description: 'Nuanced idioms + where they’re appropriate',
    },
  ],
};

export function getEnglishTopicsByLevel(level: EnglishLevel) {
  return (ENGLISH_TOPICS_BY_LEVEL[level] ?? []) as AnyTopic[];
}

export function getAllMathTopics() {
  return (Object.values(MATH_TOPICS_BY_GRADE).flat() as AnyTopic[]).filter((t) => t.subject === 'math');
}

export function getAllEnglishTopics() {
  return (Object.values(ENGLISH_TOPICS_BY_LEVEL).flat() as AnyTopic[]).filter((t) => t.subject === 'english');
}


/**
 * =====================
 *  Programming courses
 * =====================
 * Simple structure (like other courses): topic cards + AI lesson + AI quiz.
 * No code execution — only quizzes like “find the bug / output / syntax”.
 */
export const PYTHON_TOPICS: AnyTopic[] = [
  { id: 'py-variables-types', subject: 'python', title: 'Переменные и типы данных', description: 'int/float/str/bool, приведение типов, ошибки новичков' },
  { id: 'py-input-output', subject: 'python', title: 'Ввод и вывод', description: 'print(), input(), форматирование строк (f-строки)' },
  { id: 'py-conditions', subject: 'python', title: 'Условия (if/elif/else)', description: 'Логика, сравнения, and/or/not' },
  { id: 'py-loops', subject: 'python', title: 'Циклы (for/while)', description: 'range(), break/continue, типовые задачи' },
  { id: 'py-lists', subject: 'python', title: 'Списки', description: 'индексация, срезы, методы, ошибки IndexError' },
  { id: 'py-strings', subject: 'python', title: 'Строки', description: 'операции со строками, методы, поиск/замена' },
  { id: 'py-functions', subject: 'python', title: 'Функции', description: 'def, параметры, return, область видимости' },
  { id: 'py-debugging', subject: 'python', title: 'Ошибки и отладка', description: 'SyntaxError/TypeError, чтение трассировки, как находить баги' },
];

export const CPP_TOPICS: AnyTopic[] = [
  { id: 'cpp-variables-types', subject: 'cpp', title: 'Переменные и типы данных', description: 'int/double/char/bool, ошибки типов, переполнение' },
  { id: 'cpp-io', subject: 'cpp', title: 'Ввод/вывод (cin/cout)', description: 'iostream, форматирование, типовые ошибки ввода' },
  { id: 'cpp-conditions', subject: 'cpp', title: 'Условия (if/switch)', description: 'ветвления, логика, сравнения' },
  { id: 'cpp-loops', subject: 'cpp', title: 'Циклы (for/while)', description: 'итерации, break/continue, типовые задачи' },
  { id: 'cpp-arrays', subject: 'cpp', title: 'Массивы', description: 'индексация, границы массива, типовые ошибки' },
  { id: 'cpp-strings', subject: 'cpp', title: 'Строки', description: 'std::string, операции, ввод строк' },
  { id: 'cpp-functions', subject: 'cpp', title: 'Функции', description: 'объявление, параметры, возврат, перегрузка (введение)' },
  { id: 'cpp-compile-errors', subject: 'cpp', title: 'Ошибки компиляции', description: 'что значит ошибка, как её читать и исправлять' },
];

export function getPythonTopics(): AnyTopic[] {
  return PYTHON_TOPICS;
}

export function getCppTopics(): AnyTopic[] {
  return CPP_TOPICS;
}

export function getAllTopics(): AnyTopic[] {
  return [...getAllMathTopics(), ...getAllEnglishTopics(), ...getPythonTopics(), ...getCppTopics()];
}

export function getTopicById(topicId: string): AnyTopic | null {
  const all = getAllTopics();
  return all.find((t) => t.id === topicId) ?? null;
}
