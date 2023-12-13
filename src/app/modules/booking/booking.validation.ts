import { z } from "zod";

const BookingStatusValues = z.enum([
  "pending",
  "confirmed",
  "canceled",
  "completed",
]);

const create = z.object({
  body: z.object({
    serviceId: z.string({
      required_error: "Service ID is required",
    }),
    userId: z.string({
      required_error: "User ID is required",
    }),
    date: z.string({
      // You can adjust this to validate the date format.
      required_error: "Date is required",
    }),
    status: BookingStatusValues,
  }),
});

const update = z.object({
  body: z.object({
    serviceId: z.string().optional(),
    userId: z.string().optional(),
    date: z.string().optional(), // Adjust for optional date format validation.
    status: BookingStatusValues.optional(),
  }),
});

export const BookingValidation = {
  create,
  update,
};
