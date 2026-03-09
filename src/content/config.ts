import { defineCollection, z } from "astro:content";

const career = defineCollection({
  schema: z.object({
    name: z.string(),
    duration: z.string(),
    description: z.string(),
    programDirection: z.string(),
    mission: z.string(),
    vision: z.string(),
    objective: z.string(),
    admissionProfile: z.string(),
    graduateProfile: z.string(),
    professionalField: z.string(),
    studyPlan: z.string(),
  }),
});

// Colección de secciones generales
const homeInfo = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

// Colección de noticias
const news = defineCollection({
  schema: z.object({
    title: z.string(),
    cards: z.array(
      z.object({
        title: z.string(),
        subtitle: z.string(),
        image: z.string(),
        content: z.string(),
      })
    ),
  }),
});

export const collections = { career, homeInfo, news };
