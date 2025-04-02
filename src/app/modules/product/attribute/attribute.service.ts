import { ProductAttribute, ProductAttributeValue } from '@prisma/client';
import prisma from '../../../../utils/prisma';

const createAttribute = async (data: any): Promise<ProductAttribute> => {
  const result = await prisma.productAttribute.create({
    data,
  });
  return result;
};

const getAllAttributes = async (): Promise<ProductAttribute[]> => {
  return await prisma.productAttribute.findMany({
    include: { values: true },
    orderBy: { name: 'asc' },
    where: { isActive: true },
  });
};

const getAttributeById = async (
  id: string,
): Promise<ProductAttribute | null> => {
  return await prisma.productAttribute.findUnique({
    where: { id },
    include: { values: true },
  });
};

const updateAttribute = async (
  id: string,
  payload: Partial<ProductAttribute>,
): Promise<ProductAttribute> => {
  return await prisma.productAttribute.update({
    where: { id },
    data: payload,
    include: { values: true },
  });
};

const deleteAttribute = async (id: string): Promise<ProductAttribute> => {
  return await prisma.productAttribute.delete({
    where: { id },
  });
};

// Simplified attribute value methods
const createAttributeValue = async (
  attributeId: string,
  data: { value: string },
): Promise<ProductAttributeValue> => {
  const value = await prisma.productAttributeValue.create({
    data: {
      value: data.value,
      attributeId,
    },
  });

  return value;
};

const getAttributeValues = async (
  attributeId: string,
): Promise<ProductAttributeValue[]> => {
  return await prisma.productAttributeValue.findMany({
    where: { attributeId },
    orderBy: { value: 'asc' },
  });
};

const updateAttributeValue = async (
  id: string,
  data: { value: string },
): Promise<ProductAttributeValue> => {
  return await prisma.productAttributeValue.update({
    where: { id },
    data: {
      value: data.value,
    },
  });
};

const deleteAttributeValue = async (
  id: string,
): Promise<ProductAttributeValue> => {
  return await prisma.productAttributeValue.delete({
    where: { id },
  });
};

export const attributeService = {
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
