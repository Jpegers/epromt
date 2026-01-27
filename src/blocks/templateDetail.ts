import { TEMPLATE_META_LABELS_RU } from "../data/templateMetaLabels";

/**
 * A single media entry consumed by the template detail view. Each entry
 * contains a `src` property pointing to either an image (`.webp`) or a
 * video (`.mp4`). Videos include an optional `poster` property for
 * displaying a preview frame before playback. The absence of a `poster`
 * indicates a photo.
 */
export type MediaItem = {
  src: string;
  poster?: string;
};

/** Meta information describing input requirements and output format. */
type TemplateMeta = {
  input: string;
  format: string;
  difficulty: string;
  sourceHint?: string;
};

/** Props consumed by renderTemplateDetail. */
export type TemplateDetailProps = {
  id: string;
  title: string;
  description: string;
  meta: TemplateMeta;
  media: MediaItem[];
};

/**
 * Render the template detail component. Produces a section with a media
 * area and a content area. The media area maintains a stable aspect
 * ratio; if multiple media items are provided a horizontally scrollable
 * carousel is rendered. Videos include a custom play/pause overlay and
 * pause automatically when the user scrolls to another slide.
 */
export function renderTemplateDetail(
  props: TemplateDetailProps
): HTMLElement {
  // Root section
  const section = document.createElement("section");
  section.className = "template-detail";

  // Media container (aspect ratio will be set inline)
  const mediaContainer = document.createElement("div");
  mediaContainer.className = "template-media";

  // Determine desired aspect ratio from meta.format. Fallback to square.
  const ratioMap: Record<string, string> = {
    vertical: "3 / 4",
    horizontal: "16 / 9",
    square: "1 / 1",
    any: "1 / 1",
  };
  const aspect = ratioMap[(props.meta.format as string) || "any"] || "1 / 1";
  (mediaContainer.style as any).aspectRatio = aspect;

  // Helper: pause all videos in the container
  const pauseAllVideos = () => {
    const videos = mediaContainer.querySelectorAll("video");
    videos.forEach((v) => {
      const videoEl = v as HTMLVideoElement;
      if (!videoEl.paused) videoEl.pause();
    });
  };

  /**
   * Create an image slide with a loading shimmer. The shimmer is removed
   * once the image has loaded or errored. This prevents layout shifts
   * while the image is loading.
   */
  const createImageSlide = (src: string): HTMLElement => {
    const slide = document.createElement("div");
    slide.className = "media-slide";
    const wrapper = document.createElement("div");
    wrapper.className = "media-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";

    const loader = document.createElement("div");
    loader.className = "img-loader";
    wrapper.appendChild(loader);

    const img = document.createElement("img");
    img.src = src;
    img.alt = props.title;
    img.loading = "lazy";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "12px";

    img.addEventListener("load", () => {
      loader.remove();
    });
    img.addEventListener("error", () => {
      loader.remove();
    });

    wrapper.appendChild(img);
    slide.appendChild(wrapper);
    return slide;
  };

  /**
   * Create a video slide with a custom play/pause button and a loading
   * shimmer. Playback does not begin automatically; the user must
   * explicitly press play. The play button switches to a pause icon
   * during playback. A smaller pause button is displayed while the
   * video is playing, positioned in the top left corner.
   */
  const createVideoSlide = (src: string, poster?: string): HTMLElement => {
    const slide = document.createElement("div");
    slide.className = "media-slide";
    const wrapper = document.createElement("div");
    wrapper.className = "media-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";

    const loader = document.createElement("div");
    loader.className = "img-loader";
    wrapper.appendChild(loader);

    const video = document.createElement("video");
    video.src = src;
    if (poster) video.poster = poster;
    video.preload = "none";
    video.controls = false;
    video.muted = true;
    video.playsInline = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.borderRadius = "12px";

    // Remove loader once enough data is available to display first frame
    const onLoaded = () => {
      loader.remove();
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("canplay", onLoaded);
    };
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("canplay", onLoaded);

    wrapper.appendChild(video);

    // Play/Pause button
    const playBtn = document.createElement("button");
    playBtn.className = "play-btn";
    playBtn.textContent = "▶";
    playBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (video.paused) {
        pauseAllVideos();
        video.play();
      } else {
        video.pause();
      }
    });
    wrapper.appendChild(playBtn);

    // Update button appearance on play/pause
    video.addEventListener("play", () => {
      playBtn.classList.add("small");
      playBtn.textContent = "⏸";
    });
    video.addEventListener("pause", () => {
      playBtn.classList.remove("small");
      playBtn.textContent = "▶";
    });

    slide.appendChild(wrapper);
    return slide;
  };

  // Build media content
  if (!props.media || props.media.length === 0) {
    // No media: still render empty area to maintain layout
    const placeholder = createImageSlide("");
    mediaContainer.appendChild(placeholder);
  } else if (props.media.length === 1) {
    const item = props.media[0];
    // Determine if this is a video based on presence of poster
    if (item.poster) {
      mediaContainer.appendChild(createVideoSlide(item.src, item.poster));
    } else {
      mediaContainer.appendChild(createImageSlide(item.src));
    }
  } else {
    // Carousel for multiple items
    const carousel = document.createElement("div");
    carousel.className = "media-carousel";
    props.media.forEach((item) => {
      const slide = item.poster
        ? createVideoSlide(item.src, item.poster)
        : createImageSlide(item.src);
      carousel.appendChild(slide);
    });
    // Pause all videos when scrolling to avoid playing hidden clips
    carousel.addEventListener("scroll", () => {
      pauseAllVideos();
    });
    mediaContainer.appendChild(carousel);
  }

  // Content container
  const content = document.createElement("div");
  content.className = "template-content";

  // Title
  const titleEl = document.createElement("h3");
  titleEl.textContent = props.title;
  content.appendChild(titleEl);

  // Meta block
  const metaBlock = document.createElement("div");
  metaBlock.className = "template-meta";
  const inputText = TEMPLATE_META_LABELS_RU.input[
    props.meta.input as keyof typeof TEMPLATE_META_LABELS_RU.input
  ];
  const formatText = TEMPLATE_META_LABELS_RU.format[
    props.meta.format as keyof typeof TEMPLATE_META_LABELS_RU.format
  ];
  const difficultyText = TEMPLATE_META_LABELS_RU.difficulty[
    props.meta.difficulty as keyof typeof TEMPLATE_META_LABELS_RU.difficulty
  ];

  const inputRow = document.createElement("div");
  inputRow.className = "meta-row";
  inputRow.innerHTML = `<span>Исходные материалы:</span><strong>${inputText}</strong>`;
  metaBlock.appendChild(inputRow);

  const formatRow = document.createElement("div");
  formatRow.className = "meta-row";
  formatRow.innerHTML = `<span>Формат результата:</span><strong>${formatText}</strong>`;
  metaBlock.appendChild(formatRow);

  const difficultyRow = document.createElement("div");
  difficultyRow.className = "meta-row";
  difficultyRow.innerHTML = `<span>Условия:</span><strong>${difficultyText}</strong>`;
  metaBlock.appendChild(difficultyRow);

  if (props.meta.sourceHint) {
    const hintEl = document.createElement("div");
    hintEl.className = "meta-hint";
    hintEl.textContent = props.meta.sourceHint;
    metaBlock.appendChild(hintEl);
  }
  content.appendChild(metaBlock);

  // Description
  const description = document.createElement("p");
  description.className = "template-description";
  description.textContent = props.description;
  content.appendChild(description);

  // Assemble
  section.appendChild(mediaContainer);
  section.appendChild(content);
  return section;
}