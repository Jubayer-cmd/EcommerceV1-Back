import { z } from 'zod';

const createBanner = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    image: z.string({
        required_error: 'Image is required',
        }),
        type: z.string({
            required_error: 'Type is required',
        }),
        status: z.boolean({
            required_error: 'Status is required',
        }),

  }),
});

const updateBanner = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    type: z.string().optional(),
    status: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const BannerValidation = {
    createBanner,
    updateBanner
}


