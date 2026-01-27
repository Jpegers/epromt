/**
 * Media helper for templates.
 *
 * This module exposes utilities to resolve media file paths for photo and
 * video templates based on a simple naming convention. Each template has
 * one or more numbered files: the first photo preview is `<id>_1.webp`, the
 * second is `<id>_2.webp`, and so on. For videos the previews follow the
 * same pattern while the actual video files live in the `videos` folder
 * using the same index and `.mp4` extension. Because the UI determines
 * whether a media item is an image or a video by context (photo vs video
 * mode), no explicit `type` field is returned – the presence of a
 * `poster` value marks video entries.
 */

export type MediaItem = {
  /** Path to the media asset. For photos this points to the `.webp` file,
   *  for videos it points to the `.mp4` file. */
  src: string;
  /** Optional poster image for videos. When defined the consumer should
   *  render a video player with this poster as the preview. */
  poster?: string;
};

/**
 * Number of photo previews available per template. Keys correspond to the
 * template `id` and values to the highest numeric suffix present in
 * `/public/previews/photo`. These values are compiled at build time and
 * should be updated whenever new preview images are added.
 */
const photoCounts: Record<string, number> = {
  night_flash_street_portrait: 4,
  night_riverside_motion: 3,
  bathroom_flash_mirror: 2,
  escalator_candid: 2,
  fitting_room_mirror_selfie: 2,
  studio_backstage_moment: 2,
  elevator_flash_portrait: 2,
  daylight_sidewalk_candid: 2,
  car_backseat_selfie: 2,
};

/**
 * Number of video clips available per template. Keys correspond to the
 * template `id` and values to the highest numeric suffix present in
 * `/public/videos`. These values are compiled at build time and should
 * be updated whenever new clips are added.
 */
const videoCounts: Record<string, number> = {
  cinematic_start_to_end: 2,
};

/**
 * Resolve the list of media entries for a given template. When in
 * `photo` mode each entry represents an image; for `video` mode each
 * entry represents a video clip with its poster. The consumer should
 * determine how to render each entry based on the presence of the
 * `poster` property. If no media is found an empty array is returned.
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
        src: `previews/photo/${id}_${i}.webp`,
      });
    }
    return items;
  } else {
    const count = videoCounts[id];
    if (!count) return [];
    const items: MediaItem[] = [];
    for (let i = 1; i <= count; i++) {
      items.push({
        src: `videos/${id}_${i}.mp4`,
        poster: `previews/video/${id}_${i}.webp`,
      });
    }
    return items;
  }
}

/**
 * Returns the URL for the preview image of a template.
 *
 * The contract dictates that preview images are stored in the
 * `previews/<mode>/<id>_<index>.webp` directory, where `<index>`
 * starts at 1. This helper returns the preview URL for the first
 * media item of a template. It falls back to the conventional
 * `<id>_1.webp` path when no media items are defined for the given
 * template. This encapsulation ensures a single point of truth for
 * preview generation across the project.
 */
export function getPreviewImage(
  mode: "photo" | "video",
  id: string
): string {
  const list = getMediaList(mode, id);
  if (list.length > 0) {
    const item: any = list[0];
    // For video items the preview is stored on the `poster` property.
    // For photo items the preview is stored on the `src` property.
    return item.poster ?? item.src;
  }
  // Fallback to the first media filename if nothing else is defined.
  return `previews/${mode}/${id}_1.webp`;
}