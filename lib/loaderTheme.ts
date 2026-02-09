// lib/loaderTheme.ts
import type React from "react";

function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function hsla(h: number, s: number, l: number, a: number) {
  const hh = ((h % 360) + 360) % 360;
  return `hsla(${hh} ${clamp(s, 0, 100)}% ${clamp(l, 0, 100)}% / ${clamp(a, 0, 1)})`;
}

const EMOJI: Record<string, string> = {
  "Поп": "🎤", "Рэп": "🎧", "Рок": "🎸", "EDM": "🎛️", "Джаз": "🎷", "Инди": "🎵",
  "Футбол": "⚽", "Бокс": "🥊", "Бег": "🏃", "Плавание": "🏊", "Баскетбол": "🏀", "Тренажеры": "🏋️",
  "Шутеры": "🎯", "RPG": "🗡️", "MOBA": "⚔️", "Гонки": "🏎️", "Приключения": "🧭",
  "Ужасы": "👻", "Аниме": "🍥", "Комедия": "😂", "Драма": "🎭", "Фантастика": "🚀",
  "Пицца": "🍕", "Суши": "🍣", "Бургеры": "🍔", "Десерты": "🍰", "Азиатская кухня": "🍜",
  "ИИ": "🤖", "Гаджеты": "📱", "Программирование": "⌨️", "VR/AR": "🕶️",
  "Горы": "🏔️", "Море": "🏖️", "Города": "🌆", "Европа": "🇪🇺", "Азия": "🌏",
};

function emojiFor(label: string) {
  return EMOJI[label] ?? "✨";
}

function hueFor(label: string) {
  return hashString(label) % 360;
}

export type LoaderTheme = {
  bgStyle: React.CSSProperties;
  accentStyle: React.CSSProperties;
  accentSoftStyle: React.CSSProperties;
  badges: Array<{ label: string; emoji: string }>;
  signature: string;
};

export function buildLoaderTheme(params: {
  topicKey: string;       // topicId или title
  interests: string[];
}): LoaderTheme {
  const interests = (params.interests ?? []).filter(Boolean);
  const key = `${params.topicKey}::${interests.slice().sort().join("|")}`;
  const seed = hashString(key);

  // Accent is still personalized (based on interests), but background is now
  // consistently blurred violet (and automatically adapts to dark/light via CSS vars).
  const dom = Array.from(new Set(interests)).slice(0, 3);
  const h1 = dom[0] ? hueFor(dom[0]) : 270;

  const x1 = 10 + (seed % 35);
  const y1 = 15 + ((seed >>> 6) % 35);
  const x2 = 55 + ((seed >>> 12) % 35);
  const y2 = 20 + ((seed >>> 18) % 45);
  const x3 = 25 + ((seed >>> 24) % 55);
  const y3 = 65 + ((seed >>> 28) % 30);

  const bgStyle: React.CSSProperties = {
    backgroundImage: [
      // Violet glows (colors come from CSS variables and respond to html.dark)
      `radial-gradient(900px circle at ${x1}% ${y1}%, rgb(var(--oqu-glow-1) / 0.22), transparent 60%)`,
      `radial-gradient(850px circle at ${x2}% ${y2}%, rgb(var(--oqu-glow-2) / 0.20), transparent 60%)`,
      `radial-gradient(900px circle at ${x3}% ${y3}%, rgb(var(--oqu-glow-3) / 0.16), transparent 60%)`,
      // Base gradient
      `linear-gradient(135deg, rgb(var(--oqu-grad-1) / 1), rgb(var(--oqu-grad-2) / 1) 55%, rgb(var(--oqu-grad-1) / 1))`,
      // Soft diagonal texture
      `repeating-linear-gradient(135deg, rgb(var(--oqu-glow-2) / 0.08) 0px, rgb(var(--oqu-glow-2) / 0.08) 10px, transparent 10px, transparent 22px)`,
    ].join(", "),
    backgroundAttachment: "fixed",
  };

  const accentStyle: React.CSSProperties = { color: hsla(h1, 85, 35, 1) };
  const accentSoftStyle: React.CSSProperties = {
    borderColor: hsla(h1, 70, 60, 0.35),
    backgroundColor: hsla(h1, 85, 60, 0.12),
  };

  const badges = interests.slice(0, 6).map((label) => ({ label, emoji: emojiFor(label) }));

  const signature = `T${(seed % 97) + 3}-${(seed >>> 8) % 999}`.toUpperCase();

  return { bgStyle, accentStyle, accentSoftStyle, badges, signature };
}
