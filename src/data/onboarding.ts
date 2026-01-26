export type OnboardingSlide = {
  title: string;
  text: string;
  image: string; // абсолют/относительный URL
};

const base = import.meta.env.BASE_URL; // важно для GH Pages (/epromt/)

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: "Собери свой промт",
    text: "Собери промт для генерации изображения под свою задачу",
    image: `${base}onboarding/01.svg`,
  },
  {
    title: "Задай характер видео",
    text: "Собери промт для генерации видео: движение, атмосфера, стиль",
    image: `${base}onboarding/02.svg`,
  },
  {
    title: "Готовые решения",
    text: "Используй готовые шаблоны для быстрых результатов",
    image: `${base}onboarding/03.svg`,
  },
  {
    title: "Оживляй изображения",
    text: "Берёшь картинку → добавляешь видео-характер → получаешь видео",
    image: `${base}onboarding/04.svg`,
  },
  {
    title: "Как использовать E-Promt",
    text: `1. Собери промт или выбери шаблон
    В конструкторе или из готовых решений

    2. Перейди в любую AI-модель
    Для генерации фото или видео
    (например, ChatGPT, Gemini или другие сервисы)

    3. Вставь промт и добавь входные данные
    — фото
    — описание сцены
    — или всё вместе

    4. Запусти генерацию и получи результат`,
    image: `${base}onboarding/05.svg`,
    },      
];
