import { PrismaClient } from '@prisma/client';
import ApiError from '../../../errors/ApiError';

const prisma = new PrismaClient();

const addProductToWishlist = async (
  userId: string,
  productId: string,
): Promise<any> => {
  const wishlist = await prisma.wishlist.upsert({
    where: { id: userId }, // Assuming `id` is the unique identifier for Wishlist
    update: {
      products: {
        connect: { id: productId },
      },
    },
    create: {
      id: userId,
      userId,
      products: {
        connect: { id: productId },
      },
    },
    include: {
      products: true,
    },
  });

  return wishlist;
};

const getWishlistByUserId = async (userId: string): Promise<any> => {
  const wishlist = await prisma.wishlist.findFirst({
    where: {
      userId,
    },
    include: {
      products: true,
    },
  });

  return wishlist || { error: 'Wishlist not found' };
};

const removeProductFromWishlist = async (
  wishlistId: string,
  productId: string,
): Promise<any> => {
  const updatedWishlist = await prisma.wishlist.update({
    where: {
      id: wishlistId,
    },
    data: {
      products: {
        disconnect: {
          id: productId,
        },
      },
    },
    include: {
      products: true,
    },
  });

  return updatedWishlist;
};

export const wishlistService = {
  addProductToWishlist,
  getWishlistByUserId,
  removeProductFromWishlist,
};
