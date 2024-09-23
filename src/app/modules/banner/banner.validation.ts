import { z } from 'zod';

const createBanner = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    type: z.string({
      required_error: 'Type is required',
    }),
    // Validate the image file as part of the body
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

const updateBanner = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.any().optional(),
    type: z.string().optional(),
    status: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const BannerValidation = {
  createBanner,
  updateBanner,
};
