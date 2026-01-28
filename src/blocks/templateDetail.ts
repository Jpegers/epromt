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

  const pauseAllVideos = () => {
  mediaContainer.querySelectorAll("video").forEach((v) => {
    const video = v as HTMLVideoElement;
    video.pause();
    video.currentTime = 0;

    const btn = video.parentElement?.querySelector(".play-btn") as HTMLElement;
    if (btn) btn.style.display = "";
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
      let isPlaying = false;

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

      const playBtn = document.createElement("button");
      playBtn.className = "play-btn";
      playBtn.textContent = "▶";

      playBtn.addEventListener("click", () => {
        const pauseAllVideos = () => {
        mediaContainer.querySelectorAll("video").forEach((v) => {
          const video = v as HTMLVideoElement;
          video.pause();
          video.currentTime = 0;

          const btn = video.parentElement?.querySelector(".play-btn") as HTMLElement;
          if (btn) btn.style.display = "";
        });

      video.addEventListener("click", () => {
        if (!video.paused) {
          video.pause();
          playBtn.style.display = "";
        }
      });
    };

        video.play().catch(() => {});
        playBtn.style.display = "none";
      });

      video.addEventListener("pause", () => {
        playBtn.style.display = "";
      });

      wrapper.appendChild(video);
      wrapper.appendChild(playBtn);


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
    const dots = document.createElement("div");
dots.className = "media-dots";
const slidesCount = props.media.length;
for (let i = 0; i < slidesCount; i++) {
  const d = document.createElement("span");
  d.className = "dot" + (i === 0 ? " active" : "");
  d.addEventListener("click", () => {
    pauseAllVideos();
    carousel.scrollTo({ left: carousel.clientWidth * i, behavior: "smooth" });
  });
  dots.appendChild(d);
}
carousel.addEventListener("scroll", () => {
  const idx = Math.round(carousel.scrollLeft / carousel.clientWidth);
  Array.from(dots.children).forEach((el, i) =>
    el.classList.toggle("active", i === idx)
  );
  pauseAllVideos();
});
mediaContainer.appendChild(carousel);
mediaContainer.appendChild(dots);

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
