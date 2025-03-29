import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret, verify } from 'jsonwebtoken';

import ApiError from '../errors/ApiError';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};
const createResetToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: expireTime,
  });
};
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  try {
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
    }

    // Check if token is properly formatted
    if (token.trim() === '') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Empty token provided');
    }

    const isVerified = verify(token, secret) as JwtPayload;
    return isVerified;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.log('JWT Verification Error:', error);

    // Provide more specific error messages based on error type
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        `Invalid token: ${error.message}`,
      );
    } else if (error.name === 'TokenExpiredError') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired');
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
  createResetToken,
};
