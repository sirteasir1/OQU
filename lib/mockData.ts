/**
 * Mock Data Service  
 * Simulates AI-generated content and quiz data
 * NO REAL AI CALLS - All data is pre-defined with context-aware logic
 */

import { Topic, Grade, Interest, LessonContent, LessonCard, Quiz, QuizQuestion } from '@/types';

// Static topic database - Kazakhstan Math Curriculum (Expanded)
export const TOPICS_BY_GRADE: Record<Grade, Topic[]> = {
  7: [
    // Algebra
    { id: 'g7-linear-eq', title: 'Линейные Уравнения', description: 'Решение уравнений с одной переменной', grade: 7 },
    { id: 'g7-linear-inequalities', title: 'Линейные Неравенства', description: 'Решение и построение графиков неравенств', grade: 7 },
    { id: 'g7-ratios-proportions', title: 'Отношения и Пропорции', description: 'Работа с отношениями и пропорциональными зависимостями', grade: 7 },
    { id: 'g7-percentages', title: 'Проценты', description: 'Вычисление процентов и процентного изменения', grade: 7 },
    // Number Systems
    { id: 'g7-integers', title: 'Целые Числа', description: 'Операции с положительными и отрицательными числами', grade: 7 },
    { id: 'g7-fractions', title: 'Дроби и Десятичные', description: 'Операции с дробями и десятичными числами', grade: 7 },
    { id: 'g7-rational-numbers', title: 'Рациональные Числа', description: 'Понимание и работа с рациональными числами', grade: 7 },
    // Geometry
    { id: 'g7-geometry', title: 'Основы Геометрии', description: 'Фигуры, углы и базовые построения', grade: 7 },
    { id: 'g7-perimeter-area', title: 'Периметр и Площадь', description: 'Вычисление периметра и площади многоугольников', grade: 7 },
    { id: 'g7-triangles', title: 'Треугольники', description: 'Свойства и типы треугольников', grade: 7 },
    { id: 'g7-circles', title: 'Окружности', description: 'Длина окружности, радиус и диаметр', grade: 7 },
    // Statistics
    { id: 'g7-data-interpretation', title: 'Интерпретация Данных', description: 'Чтение и интерпретация графиков и диаграмм', grade: 7 },
    { id: 'g7-averages', title: 'Средние Значения', description: 'Среднее, медиана, мода и размах', grade: 7 },
  ],
  8: [
    // Algebra
    { id: 'g8-algebra', title: 'Алгебраические Выражения', description: 'Упрощение и вычисление выражений', grade: 8 },
    { id: 'g8-factoring', title: 'Разложение на Множители', description: 'Факторизация многочленов и выражений', grade: 8 },
    { id: 'g8-simultaneous-eq', title: 'Системы Уравнений', description: 'Решение систем линейных уравнений', grade: 8 },
    { id: 'g8-polynomials', title: 'Многочлены', description: 'Операции с многочленами', grade: 8 },
    { id: 'g8-exponents', title: 'Степени и Показатели', description: 'Законы степеней и научная нотация', grade: 8 },
    // Geometry
    { id: 'g8-pythagoras', title: 'Теорема Пифагора', description: 'Вычисления для прямоугольных треугольников', grade: 8 },
    { id: 'g8-volume-surface', title: 'Объем и Площадь Поверхности', description: 'Расчеты для 3D фигур', grade: 8 },
    { id: 'g8-transformations', title: 'Преобразования', description: 'Отражение, поворот и перенос', grade: 8 },
    { id: 'g8-similarity', title: 'Подобие', description: 'Подобные фигуры и масштабные коэффициенты', grade: 8 },
    { id: 'g8-coordinate-geometry', title: 'Координатная Геометрия', description: 'Построение графиков на координатной плоскости', grade: 8 },
    // Statistics & Probability
    { id: 'g8-statistics', title: 'Основы Статистики', description: 'Сбор и анализ данных', grade: 8 },
    { id: 'g8-probability-intro', title: 'Введение в Вероятность', description: 'Основные концепции вероятности', grade: 8 },
  ],
  9: [
    // Algebra
    { id: 'g9-quadratic', title: 'Квадратные Уравнения', description: 'Решение уравнений x² различными методами', grade: 9 },
    { id: 'g9-quadratic-formula', title: 'Формула Корней', description: 'Использование квадратной формулы', grade: 9 },
    { id: 'g9-inequalities-systems', title: 'Системы Неравенств', description: 'Решение и построение систем неравенств', grade: 9 },
    { id: 'g9-functions-graphs', title: 'Функции и Графики', description: 'Понимание функций и их графиков', grade: 9 },
    { id: 'g9-radical-expressions', title: 'Корни и Радикалы', description: 'Упрощение квадратных корней и радикалов', grade: 9 },
    // Geometry
    { id: 'g9-trigonometry', title: 'Введение в Тригонометрию', description: 'Основы синуса, косинуса, тангенса', grade: 9 },
    { id: 'g9-circle-theorems', title: 'Теоремы об Окружности', description: 'Свойства окружностей и углов', grade: 9 },
    { id: 'g9-polygons', title: 'Многоугольники', description: 'Внутренние и внешние углы', grade: 9 },
    { id: 'g9-area-volume', title: 'Площадь и Объем', description: 'Сложные фигуры и тела', grade: 9 },
    // Probability & Statistics
    { id: 'g9-probability', title: 'Вероятность', description: 'Сложная вероятность и дерево вероятностей', grade: 9 },
    { id: 'g9-statistics-advanced', title: 'Продвинутая Статистика', description: 'Стандартное отклонение и дисперсия', grade: 9 },
    // Number Theory
    { id: 'g9-sequences', title: 'Последовательности', description: 'Арифметические и геометрические прогрессии', grade: 9 },
    { id: 'g9-number-theory', title: 'Теория Чисел', description: 'Простые числа, множители и делимость', grade: 9 },
  ],
  10: [
    // Algebra & Functions
    { id: 'g10-functions', title: 'Функции', description: 'Понимание f(x) и функциональной нотации', grade: 10 },
    { id: 'g10-quadratic-functions', title: 'Квадратные Функции', description: 'Параболы и преобразования', grade: 10 },
    { id: 'g10-exponential', title: 'Показательные Функции', description: 'Модели роста и убывания', grade: 10 },
    { id: 'g10-logarithms', title: 'Логарифмы', description: 'Свойства и применения', grade: 10 },
    { id: 'g10-rational-functions', title: 'Рациональные Функции', description: 'Функции с дробями', grade: 10 },
    // Trigonometry
    { id: 'g10-trig-identities', title: 'Тригонометрические Тождества', description: 'Основные триг. тождества', grade: 10 },
    { id: 'g10-trig-equations', title: 'Решение Триг. Уравнений', description: 'Решение уравнений с sin, cos, tan', grade: 10 },
    { id: 'g10-unit-circle', title: 'Единичная Окружность', description: 'Понимание единичной окружности', grade: 10 },
    // Sequences & Series
    { id: 'g10-sequences', title: 'Последовательности и Ряды', description: 'Арифметические и геометрические ряды', grade: 10 },
    { id: 'g10-sigma-notation', title: 'Сигма-нотация', description: 'Обозначения сумм и формулы', grade: 10 },
    // Analytic Geometry
    { id: 'g10-coordinate-systems', title: 'Системы Координат', description: 'Декартовы и полярные координаты', grade: 10 },
    { id: 'g10-conic-sections', title: 'Конические Сечения', description: 'Окружности, эллипсы, параболы, гиперболы', grade: 10 },
    { id: 'g10-matrices', title: 'Введение в Матрицы', description: 'Операции с матрицами и применения', grade: 10 },
    // Statistics
    { id: 'g10-statistics', title: 'Статистический Анализ', description: 'Проверка гипотез и распределения', grade: 10 },
  ],
  11: [
    // Calculus
    { id: 'g11-limits', title: 'Пределы', description: 'Понимание пределов и непрерывности', grade: 11 },
    { id: 'g11-derivatives', title: 'Производные', description: 'Правила дифференцирования', grade: 11 },
    { id: 'g11-calculus', title: 'Применение Анализа', description: 'Оптимизация и связанные скорости', grade: 11 },
    { id: 'g11-integration', title: 'Интегралы', description: 'Первообразные и определенные интегралы', grade: 11 },
    // Advanced Algebra
    { id: 'g11-vectors', title: 'Векторы', description: 'Операции с векторами и применения', grade: 11 },
    { id: 'g11-complex', title: 'Комплексные Числа', description: 'Мнимые числа и комплексная плоскость', grade: 11 },
    { id: 'g11-matrices-advanced', title: 'Продвинутые Матрицы', description: 'Определители и обратные матрицы', grade: 11 },
    { id: 'g11-binomial-theorem', title: 'Бином Ньютона', description: 'Разложение биномиальных выражений', grade: 11 },
    // Trigonometry
    { id: 'g11-trig-advanced', title: 'Продвинутая Тригонометрия', description: 'Формулы суммы и разности', grade: 11 },
    { id: 'g11-inverse-trig', title: 'Обратные Триг. Функции', description: 'Арксинус, арккосинус, арктангенс', grade: 11 },
    // Probability & Statistics
    { id: 'g11-probability-advanced', title: 'Продвинутая Вероятность', description: 'Биномиальное и нормальное распределения', grade: 11 },
    { id: 'g11-combinatorics', title: 'Комбинаторика', description: 'Перестановки и сочетания', grade: 11 },
    // Differential Equations
    { id: 'g11-differential-eq', title: 'Дифференциальные Уравнения', description: 'Введение в дифференциальные уравнения', grade: 11 },
    { id: 'g11-parametric', title: 'Параметрические Уравнения', description: 'Кривые, заданные параметрами', grade: 11 },
    { id: 'g11-polar-coordinates', title: 'Полярные Координаты', description: 'Работа в полярной системе координат', grade: 11 },
  ],
};

/**
 * Get all topics for a specific grade
 */
export function getTopicsByGrade(grade: Grade): Topic[] {
  return TOPICS_BY_GRADE[grade] || [];
}

/**
 * Get a single topic by ID
 */
export function getTopicById(topicId: string): Topic | null {
  for (const grade in TOPICS_BY_GRADE) {
    const topics = TOPICS_BY_GRADE[grade as unknown as Grade];
    const topic = topics.find(t => t.id === topicId);
    if (topic) return topic;
  }
  return null;
}
