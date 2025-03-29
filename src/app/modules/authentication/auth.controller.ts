/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, RequestHandler, Response } from 'express';

import { User } from '@prisma/client';

import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { authService } from './auth.service';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

// signup
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.createUserService(req.body);

    if (result) {
      const { password, ...dataWithoutPass } = result;
      return sendResponse<Omit<User, 'password'>>(res, {
        success: true,
        statusCode: 200,
        message: 'User created successfully !',
        data: dataWithoutPass,
      });
    }
  },
);
// login
const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await authService.loginUserService(req.body);
    const { refreshToken, accessToken } = result;
    console.log(result);
    const cookieOptions = {
      secure: true,
      httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
      success: true,
      statusCode: 200,
      message: 'User signin successfully!',
      token: accessToken || '',
    });
  },
);

const getRefreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authService.getRefreshTokenService(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'New access token generated successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as User;
  const result = await authService.changePassword(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully !',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reset email sent!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const result = await authService.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
  });
});

const userDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as User;
  const result = await authService.getUserDetails(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User details fetched successfully!',
    data: result,
  });
});

export const authController = {
  createUser,
  loginUser,
  getRefreshToken,
  changePassword,
  forgotPassword,
  userDetails,
  resetPassword,
};
