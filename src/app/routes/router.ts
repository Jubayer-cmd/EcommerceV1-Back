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

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/',
    route: userRoutes,
  },
  {
    path: '/',
    route: categoryRoutes,
  },
  {
    path: '/',
    route: blogsRoutes,
  },
  {
    path: '/',
    route: serviceRoutes,
  },
  {
    path: '/',
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
    path: '/sub-category',
    route: subCategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route?.route));
export default router;
