import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to parse product form data
 * Handles type coercion for form data values (strings to numbers/booleans)
 */
export const parseProductFormData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Numeric fields to parse
  const numericFields = [
    'price',
    'comparePrice',
    'costPrice',
    'stockQuantity',
    'weight',
    'length',
    'width',
    'height',
    'lowStockThreshold',
  ];

  // Boolean fields to parse
  const booleanFields = [
    'hasVariants',
    'isDefault',
    'isActive',
    'isFeatured',
    'trackQuantity',
    'requiresShipping',
  ];

  // Parse top-level numeric fields
  numericFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      if (typeof req.body[field] === 'string' && req.body[field] !== '') {
        const parsed = field.includes('Quantity') || field.includes('Threshold')
          ? parseInt(req.body[field], 10)
          : parseFloat(req.body[field]);
        req.body[field] = isNaN(parsed) ? undefined : parsed;
      }
    }
  });

  // Parse top-level boolean fields
  booleanFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.body[field] =
        req.body[field] === 'true' || req.body[field] === true;
    }
  });

  // Parse variants array if present
  if (req.body.variants && Array.isArray(req.body.variants)) {
    req.body.variants = req.body.variants.map((variant: any) =>
      parseVariantData(variant),
    );
  }

  // Parse attributes if it's a JSON string
  if (typeof req.body.attributes === 'string') {
    try {
      req.body.attributes = JSON.parse(req.body.attributes);
    } catch {
      req.body.attributes = {};
    }
  }

  // Ensure images is an array
  if (req.body.images !== undefined) {
    req.body.images = Array.isArray(req.body.images)
      ? req.body.images
      : req.body.images
        ? [req.body.images]
        : [];
  }

  next();
};

/**
 * Parse a single variant object
 */
function parseVariantData(variant: any): any {
  const parsed: any = { ...variant };

  // Parse numeric fields
  if (variant.price !== undefined && variant.price !== null) {
    parsed.price =
      typeof variant.price === 'string'
        ? parseFloat(variant.price)
        : variant.price;
  }

  if (variant.comparePrice !== undefined && variant.comparePrice !== null && variant.comparePrice !== '') {
    parsed.comparePrice =
      typeof variant.comparePrice === 'string'
        ? parseFloat(variant.comparePrice)
        : variant.comparePrice;
  } else {
    parsed.comparePrice = undefined;
  }

  if (variant.costPrice !== undefined && variant.costPrice !== null && variant.costPrice !== '') {
    parsed.costPrice =
      typeof variant.costPrice === 'string'
        ? parseFloat(variant.costPrice)
        : variant.costPrice;
  }

  if (variant.stockQuantity !== undefined && variant.stockQuantity !== null) {
    parsed.stockQuantity =
      typeof variant.stockQuantity === 'string'
        ? parseInt(variant.stockQuantity, 10)
        : variant.stockQuantity;
  }

  if (variant.weight !== undefined && variant.weight !== null && variant.weight !== '') {
    parsed.weight =
      typeof variant.weight === 'string'
        ? parseFloat(variant.weight)
        : variant.weight;
  }

  // Parse boolean fields
  if (variant.isDefault !== undefined) {
    parsed.isDefault = variant.isDefault === 'true' || variant.isDefault === true;
  }

  if (variant.isActive !== undefined) {
    parsed.isActive = variant.isActive === 'true' || variant.isActive === true;
  }

  if (variant.trackQuantity !== undefined) {
    parsed.trackQuantity =
      variant.trackQuantity === 'true' || variant.trackQuantity === true;
  }

  // Parse attributes if it's a JSON string
  if (typeof variant.attributes === 'string') {
    try {
      parsed.attributes = JSON.parse(variant.attributes);
    } catch {
      parsed.attributes = {};
    }
  } else {
    parsed.attributes = variant.attributes || {};
  }

  // Ensure images is an array
  parsed.images = Array.isArray(variant.images)
    ? variant.images
    : variant.images
      ? [variant.images]
      : [];

  return parsed;
}

export default parseProductFormData;
