/**
 * Media helper for templates.
 *
 * The original implementation assumed media assets lived in a pair of
 * `previews/<mode>/…` and `videos/` folders. In the new version of the
 * application the static assets are organised under the `public/media`
 * directory. Preview images live in `media/photo_preview` and
 * `media/video_preview`, and the actual content files live in
 * `media/photo_content` and `media/video_content`. Each template lists
 * how many content entries it has via the `content` array in the JSON
 * definitions. This module centralises all path resolution logic so that
 * the rest of the UI does not need to be aware of the underlying folder
 * structure.
 *
 * When requesting a list of media for a template the helper reads the
 * corresponding JSON to determine how many items exist. For photo
 * templates it returns an array of objects containing a `src` pointing
 * to each numbered WebP image. For video templates it returns an array
 * where each entry has a `src` pointing to the numbered MP4 file and a
 * `poster` pointing to the single preview image for that template. The
 * presence of the `poster` field signals to the consumer that the item
 * should be rendered as a video.
 */

export type MediaItem = {
  /**
   * Path to the media asset. For photos this points to the `.webp` file,
   * for videos it points to the `.mp4` file. The path is relative to
   * the web root (Vite copies the contents of the `public` folder to the
   * root of the build output).
   */
  src: string;
  /**
   * Optional poster image for videos. When defined the consumer should
   * render a video player with this poster as the preview. For photos
   * this field is omitted.
   */
  poster?: string;
};

import photoTemplates from "./templates.photo.json";
import videoTemplates from "./templates.video.json";

/**
 * Compute a lookup of content counts for photo and video templates.
 *
 * The JSON files for templates declare a `content` array when multiple
 * media items are available. If the `content` field is missing the
 * template is assumed to have a single media file.
 */
const photoCounts: Record<string, number> = {};
const videoCounts: Record<string, number> = {};

// Populate counts from the imported template definitions.
for (const item of (photoTemplates.items as any[])) {
  if (Array.isArray(item.content) && item.content.length > 0) {
    photoCounts[item.id] = item.content.length;
  } else {
    photoCounts[item.id] = 1;
  }
}
for (const item of (videoTemplates.items as any[])) {
  if (Array.isArray(item.content) && item.content.length > 0) {
    videoCounts[item.id] = item.content.length;
  } else {
    videoCounts[item.id] = 1;
  }
}

/**
 * Resolve the list of media entries for a given template.
 *
 * For photos this returns one entry per image located in
 * `media/photo_content/{id}_{n}.webp` where `n` starts at 1. For
 * videos this returns one entry per clip located in
 * `media/video_content/{id}_{n}.mp4` with a shared poster from
 * `media/video_preview/{id}.webp`.
 *
 * @param mode Either `photo` or `video` depending on the template type.
 * @param id   The template identifier as declared in the JSON data.
 */
export function getMediaList(
  mode: "photo" | "video",
  id: string
): MediaItem[] {
  if (mode === "photo") {
    const count = photoCounts[id];
    if (!count) return [];
    const items: MediaItem[] = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        src: `media/photo_content/${id}_${i}.webp`,
      });
    }
    return items;
  } else {
    const count = videoCounts[id];
    if (!count) return [];
    const poster = `media/video_preview/${id}.webp`;
    const items: MediaItem[] = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        src: `media/video_content/${id}_${i}.mp4`,
        poster,
      });
    }
    return items;
  }
}

/**
 * Returns the URL for the preview image of a template.
 *
 * Photo templates use a single preview stored in
 * `media/photo_preview/{id}.webp`, and video templates use
 * `media/video_preview/{id}.webp`. If no media is defined for the
 * template this helper falls back to these conventional paths. This
 * encapsulates the logic for preview generation across the project.
 */
export function getPreviewImage(
  mode: "photo" | "video",
  id: string
): string {
  if (mode === "photo") {
    return `media/photo_preview/${id}.webp`;
  } else {
    return `media/video_preview/${id}.webp`;
  }
}