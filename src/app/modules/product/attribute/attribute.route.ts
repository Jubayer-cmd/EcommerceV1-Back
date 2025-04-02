import express from 'express';
import { attributeController } from './attribute.controller';
import validateRequest from '../../../middleware/validateRequest';
import { AttributeValidation } from './attribute.validation';

const router = express.Router();

// Attribute routes
router.post(
  '/',
  validateRequest(AttributeValidation.createAttribute),
  attributeController.createAttribute,
);

router.get('/', attributeController.getAllAttributes);

router.get('/:id', attributeController.getAttributeById);

router.patch(
  '/:id',
  validateRequest(AttributeValidation.updateAttribute),
  attributeController.updateAttribute,
);

router.delete('/:id', attributeController.deleteAttribute);

// Attribute Value routes (nested under attribute)
router.post(
  '/:attributeId/values',
  validateRequest(AttributeValidation.createAttributeValue),
  attributeController.createAttributeValue,
);

router.get('/:attributeId/values', attributeController.getAttributeValues);

router.patch(
  '/values/:valueId',
  validateRequest(AttributeValidation.updateAttributeValue),
  attributeController.updateAttributeValue,
);

router.delete('/values/:valueId', attributeController.deleteAttributeValue);

export const attributeRoutes = router;
