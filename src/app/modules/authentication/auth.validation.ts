import { z } from "zod";

const loginZodSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string({
      required_error: "Password is required",
    }),
  }).refine(data => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ['body'],
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

export const AuthValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
