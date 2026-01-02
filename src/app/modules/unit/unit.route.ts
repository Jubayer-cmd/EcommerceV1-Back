import express from 'express';
import { unitController } from './unit.controller';
import validateRequest from '../../middleware/validateRequest';
import { UnitValidation } from './unit.validation';

const router = express.Router();

router.post(
  '/create-unit',
  validateRequest(UnitValidation.createUnit),
  unitController.createUnit,
);

router.get('/', unitController.getAllUnits);

router.get('/:id', unitController.getUnitById);

router.patch(
  '/:id',
  validateRequest(UnitValidation.updateUnit),
  unitController.updateUnit,
);

router.delete('/:id', unitController.deleteUnit);

export const unitRoutes = router;
