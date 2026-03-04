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
