import { Unit } from '@prisma/client';
import prisma from '../../../utils/prisma';

const createUnit = async (data: any): Promise<Unit> => {
  const result = await prisma.unit.create({
    data,
  });
  return result;
};

const getAllUnits = async (): Promise<Unit[]> => {
  const result = await prisma.unit.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const getUnitById = async (id: string): Promise<Unit | null> => {
  const result = await prisma.unit.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateUnit = async (
  id: string,
  payload: Partial<Unit>,
): Promise<Unit> => {
  const result = await prisma.unit.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteUnit = async (id: string): Promise<Unit> => {
  const result = await prisma.unit.delete({
    where: {
      id,
    },
  });
  return result;
};

export const unitService = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
};
