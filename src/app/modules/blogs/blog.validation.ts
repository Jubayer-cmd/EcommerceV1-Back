import { z } from 'zod';

const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
    authorId: z.string(),
    image: z
      .any({
        required_error: 'Image is required',
      })
      .refine(
        (file) => {
          return file && file.mimetype && file.mimetype.startsWith('image/');
        },
        {
          message: 'Image must be a valid image file (jpg, png, etc.)',
        },
      ),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    authorId: z.string().optional(),
    image: z
      .any()
      .optional()
      .refine(
        (file) => {
          if (!file) return true;
          return file && file.mimetype && file.mimetype.startsWith('image/');
        },
        {
          message: 'Image must be a valid image file (jpg, png, etc.)',
        },
      ),
  }),
});

export const BlogValidation = {
  create,
  update,
};
