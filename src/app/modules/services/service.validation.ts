import { z } from "zod";

const createService = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string().optional(), // Updated: Made the "description" field optional.
    image: z.string().optional(), // Added: Validation for the "image" field and made it optional.
    price: z.number({
      required_error: "Price is required",
    }),
  }),
});

const updateService = z.object({
  body: z.object({
    name: z.string().optional(), // Made the "name" field optional for updates.
    description: z.string().optional(), // Made the "description" field optional for updates.
    image: z.string().optional(), // Added: Validation for the "image" field and made it optional.
    price: z.number().optional(), // Made the "price" field optional for updates.
  }),
});

export const ServiceValidation = {
  createService,
  updateService,
};
