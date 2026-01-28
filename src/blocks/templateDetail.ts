import { TEMPLATE_META_LABELS_RU } from "../data/templateMetaLabels";

export type MediaItem = {
  src: string;
  poster?: string;
};

type TemplateMeta = {
  input: string;
  format: string;
  difficulty: string;
  sourceHint?: string;
};

export type TemplateDetailProps = {
  id: string;
  title: string;
  description: string;
  meta: TemplateMeta;
  media: MediaItem[];
};

export function renderTemplateDetail(
  props: TemplateDetailProps
): HTMLElement {
  const section = document.createElement("section");
  section.className = "template-detail";

  const mediaContainer = document.createElement("div");
  mediaContainer.className = "template-media";

  const ratioMap: Record<string, string> = {
    vertical: "3 / 4",
    horizontal: "16 / 9",
    square: "1 / 1",
    any: "1 / 1",
  };

  const aspect =
    ratioMap[props.meta.format as keyof typeof ratioMap] || "1 / 1";

  (mediaContainer.style as any).aspectRatio = aspect;

  const pauseAllVideos = () => {
    mediaContainer.querySelectorAll("video").forEach((v) => {
      const video = v as HTMLVideoElement;
      if (!video.paused) video.pause();
    });
  };

  const createImageSlide = (src: string): HTMLElement => {
    const slide = document.createElement("div");
    slide.className = "media-slide";

    const wrapper = document.createElement("div");
    wrapper.className = "media-wrapper";

    const loader = document.createElement("div");
    loader.className = "img-loader";
    wrapper.appendChild(loader);

    const img = document.createElement("img");
    img.src = src;
    img.alt = props.title;
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "12px";

    img.addEventListener("load", () => loader.remove());
    img.addEventListener("error", () => loader.remove());

    wrapper.appendChild(img);
    slide.appendChild(wrapper);
    return slide;
  };

  const createVideoSlide = (
      src: string,
      poster?: string
    ): HTMLElement => {
      const slide = document.createElement("div");
      slide.className = "media-slide";

      const wrapper = document.createElement("div");
      wrapper.className = "media-wrapper";

      const loader = document.createElement("div");
      loader.className = "img-loader";
      wrapper.appendChild(loader);

      const video = document.createElement("video");
      video.src = src;
      if (poster) video.poster = poster;

      video.preload = "metadata"; // ❗ важно
      video.muted = true;
      video.playsInline = true;
      video.controls = false;

      video.addEventListener("loadeddata", () => {
        loader.remove();
      });

      video.addEventListener("error", () => {
        loader.remove();
      });

      wrapper.appendChild(video);

      slide.appendChild(wrapper);
      return slide;
    };


  if (!props.media || props.media.length === 0) {
    mediaContainer.appendChild(createImageSlide(""));
  } else if (props.media.length === 1) {
    const item = props.media[0];
    mediaContainer.appendChild(
      item.poster
        ? createVideoSlide(item.src, item.poster)
        : createImageSlide(item.src)
    );
  } else {
    const carousel = document.createElement("div");
    carousel.className = "media-carousel";

    props.media.forEach((item) => {
      const slide = item.poster
        ? createVideoSlide(item.src, item.poster)
        : createImageSlide(item.src);
      carousel.appendChild(slide);
    });

    carousel.addEventListener("scroll", pauseAllVideos);
    mediaContainer.appendChild(carousel);
  }

  const content = document.createElement("div");
  content.className = "template-content";

  const titleEl = document.createElement("h3");
  titleEl.textContent = props.title;

  const metaBlock = document.createElement("div");
  metaBlock.className = "template-meta";

  const inputText =
    TEMPLATE_META_LABELS_RU.input[
      props.meta.input as keyof typeof TEMPLATE_META_LABELS_RU.input
    ];
  const formatText =
    TEMPLATE_META_LABELS_RU.format[
      props.meta.format as keyof typeof TEMPLATE_META_LABELS_RU.format
    ];
  const difficultyText =
    TEMPLATE_META_LABELS_RU.difficulty[
      props.meta.difficulty as keyof typeof TEMPLATE_META_LABELS_RU.difficulty
    ];

  metaBlock.innerHTML = `
    <div class="meta-row"><span>Исходные материалы:</span><strong>${inputText}</strong></div>
    <div class="meta-row"><span>Формат результата:</span><strong>${formatText}</strong></div>
    <div class="meta-row"><span>Условия:</span><strong>${difficultyText}</strong></div>
  `;

  if (props.meta.sourceHint) {
    const hint = document.createElement("div");
    hint.className = "meta-hint";
    hint.textContent = props.meta.sourceHint;
    metaBlock.appendChild(hint);
  }

  const description = document.createElement("p");
  description.className = "template-description";
  description.textContent = props.description;

  content.appendChild(titleEl);
  content.appendChild(metaBlock);
  content.appendChild(description);

  section.appendChild(mediaContainer);
  section.appendChild(content);

  return section;
}
