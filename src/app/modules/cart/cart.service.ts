import { Cart, CartItem } from '@prisma/client';
import prisma from '../../../utils/prisma';

const insertIntoDB = async (
  userId: string,
  productId: string,
  quantity: number,
): Promise<any> => {
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
          create: [], // Include the items property
        },
      },
      include: {
        items: true, // Fetch the items after creating the cart
      },
    });
  }

  // Now you can safely access userCart.id
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: userCart.id,
      productId, // Provided productId
      quantity, // Provided quantity
    },
    include: {
      product: true, // Optionally include the product details in the response
    },
  });

  // Fetch updated cart with items
  userCart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: true,
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
      items: true,
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
