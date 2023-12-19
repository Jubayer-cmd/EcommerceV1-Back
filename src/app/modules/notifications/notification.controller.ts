import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { notificationService } from './notification.service';

const addNotification = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationService.sendNotification(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification created successfully',
    data: result,
  });
});

const addNotificationToAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.sendNotificationToAllUsers(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notification created successfully',
      data: result,
    });
  },
);

const getNotificationByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.getUserNotifications(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notifications fetched successfully',
      data: result,
    });
  },
);

const removeAllNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await notificationService.deleteAllUserNotifications(
      req.params.id,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Notification deleted successfully',
      data: result,
    });
  },
);

export const notificationController = {
  addNotification,
  getNotificationByUserId,
  removeAllNotification,
  addNotificationToAllUsers,
};
