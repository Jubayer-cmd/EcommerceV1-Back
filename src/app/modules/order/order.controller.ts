import { Order } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import pick from '../../../utils/pick';
import sendResponse from '../../../utils/sendResponse';
import { orderFilterableFields } from './order.constants';
import { orderService } from './order.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderService.createOrder(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  },
);

const getOrders: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, orderFilterableFields);
    const result = await orderService.getAllOrders(filters, options);

    sendResponse<Order[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getOrderByUserId: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderService.getAllOrdersByUserId(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders fetched successfully',
      data: result,
    });
  },
);

const getOrderById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderService.getOrderById(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order fetched successfully',
      data: result,
    });
  },
);

const updateOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderService.updateOrder(req.params.id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order updated successfully',
      data: result,
    });
  },
);

const deleteOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await orderService.deleteOrder(req.params.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order deleted successfully',
      data: result,
    });
  },
);

export const orderController = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  getOrderByUserId,
  deleteOrder,
};
