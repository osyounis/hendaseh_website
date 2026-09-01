import { z } from 'zod';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'expected 6-digit hex color');

export const TierSchema = z.enum(['flagship', 'showcase', 'card']);
export type Tier = z.infer<typeof TierSchema>;

export const ProjectSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    tagline: z.string().optional(),
    cardStat: z.string().optional(),
    description: z.string().min(1),
    tier: TierSchema,
    featured: z.boolean(),
    private: z.boolean().default(false),
    /**
     * The organisation a private project belongs to, rendered as
     * `${org} · PRIVATE` on its card. Optional: without it the badge reads a
     * plain `PRIVATE`.
     *
     * SEPARATE FROM `private` ON PURPOSE, and this is the durable lesson. The
     * badge used to hardcode `USCG · PRIVATE` for anything with `private:
     * true`, which was correct only by coincidence: every private project
     * happened to be Coast Guard work. The moment one was not, it silently
     * inherited an organisation it has no relationship with, on a public page.
     * A privacy flag says a repository is closed. It says nothing whatever
     * about who owns the work, and welding the two together mislabels the next
     * private project rather than failing loudly.
     */
    org: z.string().min(1).optional(),
    technologies: z.array(z.string().min(1)).min(1),
    keywords: z.array(z.string().min(1)).optional(),
    category: z.string().min(1),
    stats: z.string(),
    detailPath: z.string().startsWith('/').optional(),
    buttonText: z.string().optional(),
    image: z.string().startsWith('/').optional(),
    imageAlt: z.string().optional(),
    links: z
      .object({
        github: z.url().optional(),
        live: z.url().optional(),
        appStore: z.url().optional(),
      })
      .default({}),
    brand: z
      .object({
        gradient: z.object({ from: hex, to: hex }),
        iconArt: z.string().optional(),
      })
      .optional(),
    appStoreLive: z.boolean().optional(),
    appStoreRating: z.object({ value: z.string(), count: z.number().int().positive() }).optional(),
  })
  .strict();

export const ProjectsFileSchema = z.object({ projects: z.array(ProjectSchema).min(1) }).strict();

/**
 * Nahtadi's App Store reviews.
 *
 * `id` IS THE LOAD-BEARING FIELD, added in sub-project 5 (B-C) so the weekly
 * fact sync can protect these entries. Apple's customer-reviews RSS returns a
 * stable per-review id and only a rolling window of recent reviews, so a sync
 * that matched on author or title would eventually "lose" every stored review
 * and helpfully delete all six. `scripts/appstore-sync.mjs` looks each stored
 * review up BY ID across every configured storefront and exits 1 if one cannot
 * be found. It never deletes.
 *
 * `storefront` records where the review was published. App Store data is
 * per-country: these six are 4 US and 2 JO, and neither feed alone contains
 * them all.
 *
 * Strict, like the catalog schema: a stray field is an error, not a shrug.
 */
export const NahtadiReviewSchema = z
  .object({
    id: z.string().regex(/^\d+$/, 'expected Apple\u2019s numeric review id'),
    storefront: z.string().length(2),
    title: z.string().min(1),
    author: z.string().min(1),
    date: z.string().min(1),
    text: z.string().min(1),
  })
  .strict();

export const NahtadiReviewsFileSchema = z
  .object({ reviews: z.array(NahtadiReviewSchema).min(1) })
  .strict();

export type NahtadiReview = z.infer<typeof NahtadiReviewSchema>;
export type Project = z.infer<typeof ProjectSchema>;
