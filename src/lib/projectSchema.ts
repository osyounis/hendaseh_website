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
export type Project = z.infer<typeof ProjectSchema>;
