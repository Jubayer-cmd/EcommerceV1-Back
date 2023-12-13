import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      // Fixed: Changed "code" to "content" for the content field.
      required_error: "Content is required", // Updated: Changed error message for content.
    }),
    authorId: z.string(), // Added: Validation for authorId.
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    authorId: z.string().optional(), // Added: Validation for authorId.
  }),
});

export const BlogValidation = {
  create,
  update,
};
