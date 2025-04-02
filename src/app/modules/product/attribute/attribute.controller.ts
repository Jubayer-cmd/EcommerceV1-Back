import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catchAsync';
import sendResponse from '../../../../utils/sendResponse';
import { attributeService } from './attribute.service';

const createAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.createAttribute(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute created successfully',
    data: result,
  });
});

const getAllAttributes = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.getAllAttributes();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attributes retrieved successfully',
    data: result,
  });
});

const getAttributeById = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.getAttributeById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute retrieved successfully',
    data: result,
  });
});

const updateAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.updateAttribute(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute updated successfully',
    data: result,
  });
});

const deleteAttribute = catchAsync(async (req: Request, res: Response) => {
  const result = await attributeService.deleteAttribute(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute deleted successfully',
    data: result,
  });
});

// Simplified attribute value controllers
const createAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const { attributeId } = req.params;
  const result = await attributeService.createAttributeValue(
    attributeId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute value created successfully',
    data: result,
  });
});

const getAttributeValues = catchAsync(async (req: Request, res: Response) => {
  const { attributeId } = req.params;
  const result = await attributeService.getAttributeValues(attributeId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute values retrieved successfully',
    data: result,
  });
});

const updateAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const { valueId } = req.params;
  const result = await attributeService.updateAttributeValue(valueId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute value updated successfully',
    data: result,
  });
});

const deleteAttributeValue = catchAsync(async (req: Request, res: Response) => {
  const { valueId } = req.params;
  const result = await attributeService.deleteAttributeValue(valueId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attribute value deleted successfully',
    data: result,
  });
});

export const attributeController = {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  getAttributeValues,
  updateAttributeValue,
  deleteAttributeValue,
};
