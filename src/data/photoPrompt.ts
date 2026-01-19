export type PhotoOption = {
  key: string;
  label: string;
  values: { value: string; ru: string; en: string }[];
};

export const photoPromptConfig: PhotoOption[] = [
  {
    key: 'style',
    label: 'Стиль',
    values: [
      { value: 'portrait', ru: 'Портрет', en: 'portrait photography' },
      { value: 'cinematic', ru: 'Кинематографичный', en: 'cinematic style' },
      { value: 'fashion', ru: 'Фэшн', en: 'fashion photography' }
    ]
  },
  {
    key: 'mood',
    label: 'Настроение',
    values: [
      { value: 'calm', ru: 'Спокойное', en: 'calm mood' },
      { value: 'dramatic', ru: 'Драматичное', en: 'dramatic mood' },
      { value: 'energetic', ru: 'Энергичное', en: 'energetic mood' }
    ]
  },
  {
    key: 'light',
    label: 'Свет',
    values: [
      { value: 'soft', ru: 'Мягкий', en: 'soft light' },
      { value: 'studio', ru: 'Студийный', en: 'studio lighting' },
      { value: 'natural', ru: 'Естественный', en: 'natural light' }
    ]
  }
];
