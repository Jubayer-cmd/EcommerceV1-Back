import { z } from "zod";

const createProduct = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string().optional(), // Updated: Changed to string validation and made it optional.
    image: z.string().optional(), // Added: Validation for the "image" field and made it optional.
    price: z.number({
      required_error: "Price is required",
    }),
    categoryId: z.string().optional(), // Added: Validation for the "categoryId" field and made it optional.
    stock: z.boolean(), // Added: Validation for the "stock" field.
    quantity: z.number(), // Updated: Changed to number validation.
    saleCount: z.number(), // Updated: Changed to number validation.
  }),
});

const updateProduct = z.object({
  body: z.object({
    name: z.string().optional(), // Updated: Made the "name" field optional for updates.
    description: z.string().optional(), // Updated: Changed to string validation and made it optional.
    image: z.string().optional(), // Added: Validation for the "image" field and made it optional.
    price: z.number().optional(), // Updated: Made the "price" field optional for updates.
    categoryId: z.string().optional(), // Added: Validation for the "categoryId" field and made it optional.
    stock: z.boolean().optional(), // Made the "stock" field optional for updates.
    quantity: z.number().optional(), // Updated: Made the "quantity" field optional for updates.
    saleCount: z.number().optional(), // Updated: Made the "saleCount" field optional for updates.
  }),
});

export const ProductValidation = {
  createProduct,
  updateProduct,
};
