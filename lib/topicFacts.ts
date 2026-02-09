// lib/topicFacts.ts
export type TopicFact = {
  title: string;          // короткий заголовок
  fact: string;           // интересный факт/почему важно
  usedIn: string[];       // где применяется в жизни
};

export type TopicFactWithExtra = TopicFact & { extraLine?: string };

function hashString(str: string) {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

const FACTS_BY_KEYWORD: Array<{ match: RegExp; facts: TopicFact[] }> = [
  {
    match: /(процент|percent|g7-percentages)/i,
    facts: [
      {
        title: "Проценты — язык денег",
        fact: "Проценты — это не “математика ради математики”, а язык скидок, налогов, кредитов и роста/падения цен.",
        usedIn: ["скидки и акции", "кэшбек и комиссии", "инфляция и рост цен", "статистика (рост/падение)"],
      },
      {
        title: "Процентное изменение = реальный смысл",
        fact: "Одна и та же разница в числе может означать разное: +20 — это мелочь для 1000, но огромно для 40. Проценты нормализуют сравнение.",
        usedIn: ["сравнение результатов", "динамика показателей", "рейтинги и аналитика"],
      },
    ],
  },
  {
    match: /(пифаго|pythag|g8-pythagoras)/i,
    facts: [
      {
        title: "Пифагор работает в 3D-играх",
        fact: "Формула расстояния между точками (в том числе в играх/графике) — это прямое продолжение теоремы Пифагора.",
        usedIn: ["карты и навигация", "3D-графика", "строительство и измерения", "робототехника"],
      },
    ],
  },
  {
    match: /(вероятност|probab|g9-probability|g8-probability)/i,
    facts: [
      {
        title: "Вероятность — сердце принятия решений",
        fact: "Многие решения — это выбор лучшей стратегии при неопределённости, а не угадайка. Вероятность даёт язык риска.",
        usedIn: ["спорт-стратегии", "страхование", "игры/лотереи", "data science"],
      },
    ],
  },
  {
    match: /(функци|graph|график|g9-functions|g10-functions)/i,
    facts: [
      {
        title: "Графики — это “карта” поведения",
        fact: "Функции описывают, как меняется одно от другого. График — визуальный способ “увидеть закономерность”.",
        usedIn: ["физика (скорость/время)", "экономика (спрос/цена)", "аналитика", "инженерия"],
      },
    ],
  },
  {
    match: /(квадратн|quadratic|g9-quadratic|g10-quadratic)/i,
    facts: [
      {
        title: "Парабола — траектория",
        fact: "Прыжок, бросок мяча, фейерверк — во многих моделях дают параболу. Поэтому квадратики — не просто “уравнения”.",
        usedIn: ["баллистика и спорт", "физика движения", "оптимизация", "архитектура (арки)"],
      },
    ],
  },
  {
    match: /(тригоном|sin|cos|tan|g9-trigonometry|g10-trig)/i,
    facts: [
      {
        title: "Тригонометрия — измерять то, куда не дойти",
        fact: "Ею измеряют высоту/расстояние без прямого измерения — по углам. Это реально используется веками.",
        usedIn: ["геодезия", "GPS/навигация", "инженерия", "3D-графика"],
      },
    ],
  },
  {
    match: /(статист|deviation|variance|g7-averages|g8-statistics|g9-statistics|g10-statistics)/i,
    facts: [
      {
        title: "Статистика — отличать шум от смысла",
        fact: "Средние/разброс помогают понять: результат “стабилен” или это случайная удача/провал.",
        usedIn: ["спорт-аналитика", "оценки и тесты", "медицина (исследования)", "бизнес-метрики"],
      },
    ],
  },

  // English course keywords
  {
    match: /(en-|английск|english)/i,
    facts: [
      {
        title: 'Английский — это доступ к миру',
        fact: 'Большая часть обучения, документации и контента в интернете сначала появляется на английском.',
        usedIn: ['IT и программирование', 'наука и исследования', 'путешествия', 'карьера'],
      },
      {
        title: 'Слова запоминаются через контекст',
        fact: 'Мозг быстрее запоминает слова, если они встречаются в реальных фразах, а не в списке.',
        usedIn: ['чтение', 'сериалы/видео', 'переписка', 'подготовка к IELTS/TOEFL'],
      },
    ],
  },
  {
    match: /(present\s*perfect|en-(preint|int)-present-perfect)/i,
    facts: [
      {
        title: 'Present Perfect — мост между прошлым и настоящим',
        fact: 'Он важен, потому что показывает результат сейчас: не «когда», а «что изменилось».',
        usedIn: ['разговорная речь', 'интервью', 'описание опыта', 'IELTS Speaking/Writing'],
      },
    ],
  },
  {
    match: /(conditionals|if\s+clauses|en-(int|upper)-conditionals)/i,
    facts: [
      {
        title: 'Conditionals — язык сценариев',
        fact: 'Условия помогают говорить о планах, советах и гипотезах — это база живого общения.',
        usedIn: ['диалоги', 'советы', 'планы', 'аргументация'],
      },
    ],
  },
  {
    match: /(passive\s+voice|en-(int|upper)-passive)/i,
    facts: [
      {
        title: 'Passive Voice — стиль новостей и науки',
        fact: 'Пассив часто используется, когда важнее действие/факт, а не исполнитель.',
        usedIn: ['научные тексты', 'новости', 'описание процессов', 'академическое письмо'],
      },
    ],
  },
  {
    match: /(phrasal\s+verbs|en-(int|upper)-phrasal)/i,
    facts: [
      {
        title: 'Phrasal verbs = естественная речь',
        fact: 'Носители часто выбирают phrasal verbs вместо «книжных» слов: put off вместо postpone.',
        usedIn: ['разговорная речь', 'сериалы', 'письма/чат', 'IELTS Listening'],
      },
    ],
  },
];

// fallback если тема не попала под ключевые слова
const FALLBACK_FACTS: TopicFact[] = [
  {
    title: "Эта тема тренирует мышление",
    fact: "Даже когда кажется “абстрактно”, ты прокачиваешь навык: переводить реальную задачу в понятную модель.",
    usedIn: ["решение задач", "логика", "проверка ошибок", "подготовка к экзаменам"],
  },
  {
    title: "Математика = язык моделей",
    fact: "Большая часть науки/техники — это построение моделей. И каждая новая тема расширяет твой “словарь”.",
    usedIn: ["физика", "инженерия", "ИТ", "аналитика"],
  },
];

// fallback для английского
const ENGLISH_FALLBACK_FACTS: TopicFact[] = [
  {
    title: 'Практика важнее идеала',
    fact: 'В английском прогресс быстрее, когда ты регулярно говоришь/пишешь, даже если не идеально.',
    usedIn: ['общение', 'подготовка к IELTS', 'переписка', 'собеседования'],
  },
  {
    title: 'Грамматика = шаблоны',
    fact: 'Правила легче запомнить как «шаблоны предложений» и примеры, а не как абстрактные формулировки.',
    usedIn: ['письмо', 'говорение', 'чтение', 'перевод'],
  },
  {
    title: 'Английский прокачивает мозг',
    fact: 'Изучение языка улучшает внимание и память, потому что мозг постоянно переключает системы.',
    usedIn: ['учёба', 'память', 'концентрация', 'мультитаскинг'],
  },
  {
    title: 'Правила работают через примеры',
    fact: 'Грамматика лучше усваивается, когда ты видишь 10–20 примеров и сам строишь фразы.',
    usedIn: ['говорение', 'письмо', 'грамматика', 'подготовка к экзаменам'],
  },
];

// Ещё немного универсальных фактов, чтобы карточка могла «крутиться»
// даже если у конкретной темы мало специализ... (fast fallback)
const UNIVERSAL_EXTRA_FACTS: TopicFact[] = [
  {
    title: 'Математика экономит время',
    fact: 'Хорошая формула/метод — это способ решить задачу быстрее и с меньшим числом ошибок. В реальности это экономит время и деньги.',
    usedIn: ['планирование', 'финансы', 'инженерия', 'программирование'],
  },
  {
    title: 'Проверка результата — суперсила',
    fact: 'Важная привычка: оценивать, «похоже ли» число на правду. Это резко снижает количество случайных ошибок.',
    usedIn: ['экзамены', 'задачи', 'аналитика', 'повседневные расчёты'],
  },
  {
    title: 'Тема — кирпичик для следующей',
    fact: 'В математике темы связаны: сегодняшние навыки станут базой для более сложных задач. Пробелы потом «дорого» чинить.',
    usedIn: ['учёба', 'олимпиады', 'подготовка к ЕНТ/экзаменам'],
  },
];

const ENGLISH_UNIVERSAL_EXTRA_FACTS: TopicFact[] = [
  {
    title: 'Повторение = сила',
    fact: 'Spaced repetition (повторение с интервалами) даёт самый быстрый рост словаря без «зубрёжки до боли».',
    usedIn: ['словарь', 'Anki/карточки', 'подготовка к IELTS', 'самообучение'],
  },
  {
    title: '1 фраза лучше 5 слов',
    fact: 'Если учить слово вместе с типичной фразой, ты быстрее начнёшь говорить, а не переводить в голове.',
    usedIn: ['говорение', 'writing', 'переписка', 'устная речь'],
  },
  {
    title: 'Слушай «понятное»',
    fact: 'Оптимальная сложность — когда понимаешь ~70–85%: это развивает быстрее, чем слишком лёгкое или слишком тяжёлое.',
    usedIn: ['listening', 'подкасты', 'видео', 'сериалы'],
  },
  {
    title: 'Слушание тренирует «предсказание»',
    fact: 'Мы понимаем речь не по каждому слову, а по смыслу фразы. Поэтому важны устойчивые выражения.',
    usedIn: ['подкасты', 'сериалы', 'разговорная речь', 'Listening'],
  },
  {
    title: 'Активный словарь растёт от использования',
    fact: 'Слова становятся «твоими», когда ты сам строишь с ними 2–3 предложения.',
    usedIn: ['говорение', 'Writing', 'чат', 'заметки'],
  },
  {
    title: 'Правила работают через примеры',
    fact: 'Если ты можешь придумать 3 своих примера, значит правило уже начинает «жить» в речи.',
    usedIn: ['грамматика', 'говорение', 'Writing', 'экзамены'],
  },
];

// лёгкая привязка к интересам (одна строка “пример”)
function interestExample(interest: string) {
  const map: Record<string, string> = {
    "Футбол": "в футболе это помогает оценивать траекторию, шанс удара и статистику матчей",
    "Баскетбол": "в баскетболе — траектории броска и проценты попаданий",
    "Бег": "в беге — темп, прогресс и графики нагрузки",
    "Плавание": "в плавании — темп и сравнение результатов по дистанциям",
    "ИИ": "в ИИ — данные, вероятности и графики",
    "Программирование": "в программировании — алгоритмы, графики и оптимизация",
    "Гаджеты": "в гаджетах — датчики, измерения и обработка сигналов",
    "Гонки": "в гонках — скорость, время, оптимальные траектории",
  };
  return map[interest] ?? `в твоём интересе “${interest}” это часто всплывает через данные, графики и сравнение результатов`;
}

function uniqueByTitle(facts: TopicFact[]) {
  const seen = new Set<string>();
  const out: TopicFact[] = [];
  for (const f of facts) {
    const k = f.title.trim().toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(f);
  }
  return out;
}

function shuffleDeterministic<T>(arr: T[], seed: number) {
  // Fisher–Yates with deterministic RNG (LCG)
  const out = arr.slice();
  let s = seed >>> 0;
  const rand = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function getTopicFacts(params: {
  topicId?: string;
  topicTitle?: string;
  interests?: string[];
  max?: number;
}): TopicFactWithExtra[] {
  const topicKey = `${params.topicId ?? ''} ${params.topicTitle ?? ''}`.trim();
  const interests = (params.interests ?? []).filter(Boolean);
  const seed = hashString(`${topicKey}::${interests.slice().sort().join('|')}`);

  const isEnglish = /(\ben-|английск|english|present\s*perfect|past\s*simple|conditionals|passive\s*voice|phrasal\s*verbs|articles|modal\s*verbs)/i.test(
    topicKey
  );

  // 1) matched facts by keyword
  let matchedFacts: TopicFact[] = [];
  for (const block of FACTS_BY_KEYWORD) {
    if (block.match.test(topicKey)) {
      matchedFacts = block.facts.slice();
      break;
    }
  }
  const fallback = isEnglish ? ENGLISH_FALLBACK_FACTS : FALLBACK_FACTS;
  if (matchedFacts.length === 0) matchedFacts = fallback.slice();

  // 2) ensure we always have some variety
  const combined = uniqueByTitle([
    ...matchedFacts,
    ...(isEnglish ? ENGLISH_UNIVERSAL_EXTRA_FACTS : UNIVERSAL_EXTRA_FACTS),
    ...fallback,
  ]);

  const shuffled = shuffleDeterministic(combined, seed);
  const max = Math.max(1, Math.min(params.max ?? 6, shuffled.length));
  const selected = shuffled.slice(0, max);

  const extraLine =
    interests.length > 0
      ? `Например: ${interestExample(pick(interests, seed >>> 3))}.`
      : undefined;

  return selected.map((f, idx) => ({
    ...f,
    // extraLine показываем не всегда, чтобы карточка выглядела по-разному
    extraLine: idx % 2 === 0 ? extraLine : undefined,
  }));
}

export function getTopicFact(params: {
  topicId?: string;
  topicTitle?: string;
  interests?: string[];
}): TopicFactWithExtra {
  // Backward compatible single-fact version
  const list = getTopicFacts({
    topicId: params.topicId,
    topicTitle: params.topicTitle,
    interests: params.interests,
    max: 1,
  });
  return list[0];
}
