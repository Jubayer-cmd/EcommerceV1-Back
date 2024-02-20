import { z } from "zod";

const createFlashSaleProduct = z.object({
  body: z.object({
    flashSaleId: z.string({
      required_error: "flash Sale is required",
    }),

    productId: z.string({
      required_error: "product  is required",
    }),
  }),
});

const updateFlashSaleProduct = z.object({
  body: z.object({
    flashSaleId: z.string().optional(),
    productId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const FlashSaleProductValidation = {
  createFlashSaleProduct,
  updateFlashSaleProduct,
};
