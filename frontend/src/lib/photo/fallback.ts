/**
 * Photo fallback resolver.
 *
 * Per SKILL.md "Photo Fallback System" — every photo slot must gracefully
 * fall back to a default placeholder if the user-uploaded file is missing.
 * Build NEVER fails because a photo is absent.
 *
 * For Layer 1, the only photo is the hero portal silhouette. Default fallback
 * is the SVG at /photos/defaults/silhouette-portal.svg shipped with the build.
 *
 * In v1 this is a static map. Phase 2: replace with build-time existence check
 * (scripts/check_photos.py) that swaps `userPath` for `default` when missing.
 */

export type PhotoSlot =
  | "hero-silhouette"
  | "about-portrait"
  | "travel-default";

const PHOTO_MAP: Record<PhotoSlot, { user: string; fallback: string }> = {
  "hero-silhouette": {
    user: "/photos/profile/hero.jpg",
    fallback: "/photos/defaults/silhouette-portal.svg",
  },
  "about-portrait": {
    user: "/photos/about/portrait.jpg",
    fallback: "/photos/defaults/silhouette-standing.svg",
  },
  "travel-default": {
    user: "",
    fallback: "/photos/defaults/gradient-mountain.svg",
  },
};

/**
 * Returns the URL to use for a photo slot.
 *
 * v1: always returns the fallback (Layer 1 ships with default silhouette
 * regardless of user upload). v1.1+ will check file existence at build time.
 */
export function getPhoto(slot: PhotoSlot): string {
  // For now: always default. Phase 2 will check `existsAtBuildTime(slot.user)`.
  return PHOTO_MAP[slot].fallback;
}
