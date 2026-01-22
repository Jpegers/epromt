// templateMeta.ts

export type TemplateFormat =
  | "vertical"
  | "horizontal"
  | "square"
  | "any";

export type TemplateDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type PhotoInput =
  | "one_photo"
  | "two_three_photos"
  | "any_photo"
  | "suitable_photo";

export type VideoInput =
  | "no_input"
  | "start_frame"
  | "start_end_frame"
  | "image_sequence";
