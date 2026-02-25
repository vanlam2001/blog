import { defineCollection, z } from "astro:content";

const parseDate = (value: unknown) => {
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parts = value.split("/").map(Number);
    if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
      const [day, month, year] = parts;
      return new Date(Date.UTC(year, month - 1, day));
    }
  }
  return new Date(String(value));
};

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.preprocess((value) => parseDate(value), z.date()),
    layout: z.string().optional(),
    header: z
      .object({
        teaser: z.string().optional()
      })
      .optional(),
    description: z.string().optional()
  })
});

export const collections = {
  posts: postsCollection
};
