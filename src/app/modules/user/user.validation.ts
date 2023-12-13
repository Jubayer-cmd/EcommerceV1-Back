// Add validation for the User model using zod
import { z } from "zod";

const createUser = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string({
      required_error: "Password is required",
    }),
    image: z.string().optional(), // Added: Validation for the "image" field and made it optional.
    role: z.enum(["admin", "user", "superadmin"]), // Added: Ensure the "role" is either "admin" or "user".
    contactNo: z.string(), // Added: Validation for "contactNo."
    address: z.string().optional(), // Updated: Made the "address" field optional.
  }),
});

const updateUser = z.object({
  body: z.object({
    name: z.string().optional(), // Made the "name" field optional for updates.
    email: z.string().optional(), // Made the "email" field optional for updates.
    password: z.string().optional(), // Made the "password" field optional for updates.
    image: z.string().optional(), // Added: Validation for the "image" field and made it optional.
    role: z.enum(["admin", "user"]).optional(), // Made the "role" field optional for updates.
    contactNo: z.string().optional(), // Made the "contactNo" field optional for updates.
    address: z.string().optional(), // Updated: Made the "address" field optional for updates.
  }),
});

export const UserValidation = {
  createUser,
  updateUser,
};
