import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import config from '../../config/envConfig';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../utils/jwtHelpers';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization token
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // Check if the header starts with 'Bearer '
      if (!authHeader.startsWith('Bearer ')) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid authorization format. Must start with Bearer',
        );
      }

      // Remove 'Bearer' prefix from token and trim any whitespace
      const token = authHeader.replace(/^Bearer\s+/, '').trim();

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Empty token provided');
      }

      // Verify token
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret,
      );

      req.user = verifiedUser;

      // Role-based guard
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
