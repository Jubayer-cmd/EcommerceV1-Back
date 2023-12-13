// Add validation for the UserReview model using zod
import { z } from "zod";

const createUserReview = z.object({
  body: z.object({
    rating: z.number({
      required_error: "Rating is required",
    }),
    content: z.string().optional(), // Updated: Made the "content" field optional.
    serviceId: z.string(), // Added: Validation for "serviceId".
    productId: z.string(), // Added: Validation for "productId".
    userId: z.string(), // Added: Validation for "userId".
  }),
});

const updateUserReview = z.object({
  body: z.object({
    rating: z.number().optional(), // Made the "rating" field optional for updates.
    content: z.string().optional(), // Made the "content" field optional for updates.
    serviceId: z.string().optional(), // Made the "serviceId" field optional for updates.
    productId: z.string().optional(), // Made the "productId" field optional for updates.
    userId: z.string().optional(), // Made the "userId" field optional for updates.
  }),
});

export const UserReviewValidation = {
  createUserReview,
  updateUserReview,
};
