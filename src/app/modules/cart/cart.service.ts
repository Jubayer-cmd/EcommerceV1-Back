import { Cart, CartItem } from '@prisma/client';
import prisma from '../../../utils/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const insertIntoDB = async (
  userId: string,
  productId: string,
  quantity: number,
  productVariantId?: string,
): Promise<any> => {
  // Validate product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, hasVariants: true },
  });

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // If product has variants, variant ID is required
  if (product.hasVariants && !productVariantId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Variant selection is required for this product',
    );
  }

  // If variant ID provided, validate it belongs to the product
  if (productVariantId) {
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: productVariantId,
        productId: productId,
        isActive: true,
      },
    });

    if (!variant) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalid variant for this product',
      );
    }
  }

  let userCart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        userId,
        items: {
          create: [],
        },
      },
      include: {
        items: true,
      },
    });
  }

  // Check if same product+variant already in cart
  const existingItem = userCart.items.find(
    (item) =>
      item.productId === productId &&
      item.productVariantId === (productVariantId || null),
  );

  if (existingItem) {
    // Update quantity instead of creating new item
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: {
        product: true,
        variant: true,
      },
    });
    return updatedItem;
  }

  // Create new cart item
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: userCart.id,
      productId,
      productVariantId: productVariantId || null,
      quantity,
    },
    include: {
      product: true,
      variant: true,
    },
  });

  return cartItem;
};

const getcartById = async (id: string): Promise<Cart | null> => {
  const result = await prisma.cart.findUnique({
    where: {
      userId: id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              thumbnailUrl: true,
              price: true,
              hasVariants: true,
            },
          },
          variant: {
            select: {
              id: true,
              sku: true,
              price: true,
              stockQuantity: true,
              option1Value: true,
              option2Value: true,
              option3Value: true,
              images: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<CartItem | null> => {
  const result = await prisma.cartItem.delete({
    where: {
      id,
    },
  });
  return result;
};

export const cartService = {
  insertIntoDB,
  getcartById,
  deleteFromDB,
};
