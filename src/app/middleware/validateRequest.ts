import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z, ZodEffects } from 'zod';

// Define the structure of your request
interface ParsedRequest {
  body: Record<string, any>; // You can define more specific types if needed
  query: Record<string, any>;
  params: Record<string, any>;
  cookies: Record<string, any>;
}

const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Include files in the schema validation under the body
      const parsedData: ParsedRequest = {
        body: {
          ...req.body,
          image: Array.isArray(req.files) ? null : req.files?.image || null, // Ensure it defaults to null if not present
        },
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      };

      await schema.parseAsync(parsedData);
      return next();
    } catch (error) {
      // Return validation errors to the client
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      } else {
        next(error); // Handle unexpected errors
      }
    }
  };

export default validateRequest;
