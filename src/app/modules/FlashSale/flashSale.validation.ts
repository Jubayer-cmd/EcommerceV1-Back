import { z } from "zod";

const createFlashSale = z.object({
  body: z.object({
    name: z.string({
      required_error: "name is required",
    }),

    startDate: z.string({
      required_error: "startDate  is required",
      
    }),

    endDate: z.string({
      required_error: "end Date  is required",
    }),

    discount: z.number({
      required_error: "discount is required",
    }),
  }),
});

const updateFlashSale = z.object({
  body: z.object({
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    discount: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

export const FlashSaleValidation = {
  createFlashSale,
  updateFlashSale,
};
