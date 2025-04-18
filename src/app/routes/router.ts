import express from 'express';

import { blogsRoutes } from '../modules/blogs/blog.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { categoryRoutes } from '../modules/category/category.route';
import { orderRoutes } from '../modules/order/order.route';
import { productRoutes } from '../modules/product/product.route';
import { reviewsRoutes } from '../modules/reviews/reviews.route';
import { serviceRoutes } from '../modules/services/service.route';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/authentication/auth.route';
import { brandRoutes } from '../modules/brand/brand.route';
import { subCategoryRoutes } from '../modules/sub-category/subCategory.route';
import { questionRoutes } from '../modules/product-question/proQues.route';
import { cartRoutes } from '../modules/cart/cart.route';
import { wishlistRoutes } from '../modules/wishlist/wishlist.route';
import { notificationRoutes } from '../modules/notifications/notification.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { supportTicketsRoutes } from '../modules/supportTicket/supportTicket.route';
import { bannerRoutes } from '../modules/banner/banner.route';
import { productReviewRoutes } from '../modules/product-Review/productReview.route';
import { promotionRoutes } from '../modules/promotion/promotion.route';
import { unitRoutes } from '../modules/unit/unit.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },

  {
    path: '/user',
    route: userRoutes,
  },

  {
    path: '/categories',
    route: categoryRoutes,
  },

  {
    path: '/blogs',
    route: blogsRoutes,
  },

  {
    path: '/',
    route: serviceRoutes,
  },

  {
    path: '/products',
    route: productRoutes,
  },

  {
    path: '/',
    route: reviewsRoutes,
  },

  {
    path: '/',
    route: BookingRoutes,
  },

  {
    path: '/',
    route: orderRoutes,
  },

  {
    path: '/brand',
    route: brandRoutes,
  },

  {
    path: '/banner',
    route: bannerRoutes,
  },

  {
    path: '/subcategories',
    route: subCategoryRoutes,
  },

  {
    path: '/product-question',
    route: questionRoutes,
  },

  {
    path: '/product-review',
    route: productReviewRoutes,
  },

  {
    path: '/cart',
    route: cartRoutes,
  },

  {
    path: '/wishlist',
    route: wishlistRoutes,
  },

  {
    path: '/notification',
    route: notificationRoutes,
  },
  {
    path: '/promotion',
    route: promotionRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },

  {
    path: '/support',
    route: supportTicketsRoutes,
  },
  {
    path: '/units',
    route: unitRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route?.route));
export default router;
