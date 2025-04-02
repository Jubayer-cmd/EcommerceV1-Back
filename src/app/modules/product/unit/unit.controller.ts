import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catchAsync';
import sendResponse from '../../../../utils/sendResponse';
import { Unit } from '@prisma/client';
import { unitService } from './unit.service';

const createUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await unitService.createUnit(req.body);
  sendResponse<Unit>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit created successfully',
    data: result,
  });
});

const getAllUnits = catchAsync(async (req: Request, res: Response) => {
  const result = await unitService.getAllUnits();
  sendResponse<Unit[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Units retrieved successfully',
    data: result,
  });
});

const getUnitById = catchAsync(async (req: Request, res: Response) => {
  const result = await unitService.getUnitById(req.params.id);
  sendResponse<Unit>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit retrieved successfully',
    data: result,
  });
});

const updateUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await unitService.updateUnit(req.params.id, req.body);
  sendResponse<Unit>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit updated successfully',
    data: result,
  });
});

const deleteUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await unitService.deleteUnit(req.params.id);
  sendResponse<Unit>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unit deleted successfully',
    data: result,
  });
});

export const unitController = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
