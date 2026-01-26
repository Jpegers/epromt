export type OnboardingSlide = {
  title: string;
  text: string;
  image: string; // абсолют/относительный URL
};

const base = import.meta.env.BASE_URL; // важно для GH Pages (/epromt/)

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: "Собери свой промт",
    text: "Создай промт для генерации изображения под свою задачу.",
    image: `${base}onboarding/01.svg`,
  },
  {
    title: "Задай характер видео",
    text: `Определи движение, атмосферу 
и стиль будущего видео.`,
    image: `${base}onboarding/02.svg`,
  },
  {
    title: "Готовые решения",
    text: `Используй шаблоны для быстрого 
 и предсказуемого результата.`,
    image: `${base}onboarding/03.svg`,
  },
  {
    title: "Оживляй изображения",
    text: `Превращай изображения в видео 
  с помощью готовых сценариев`,
    image: `${base}onboarding/04.svg`,
  },
  {
    title: "Как использовать E-Promt",
    text: `1. Собери промт или выбери шаблон
в конструкторе или из готовых решений

2. Открой любую AI-модель
для генерации фото или видео
(например, ChatGPT, Gemini и другие)

3. Вставь промт и добавь данные:
- фото
- описание сцены
- или всё вместе

4. Запусти генерацию и получи результат`,
    image: `${base}onboarding/05.svg`,
  },
];
