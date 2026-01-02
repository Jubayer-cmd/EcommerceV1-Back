import express from 'express';
import { ENUM_USER_ROLE } from '../../../interface/common';
import auth from '../../middleware/auth';
import { blogsController } from './blog.controller';

const router = express.Router();

router.post('/create-blogs', blogsController.insertIntoDB);

router.get('/', blogsController.getblogs);

router.get('/:id', blogsController.getblogsById);

router.delete('/:id', blogsController.deleteFromDB);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), blogsController.updateIntoDB);

export const blogsRoutes = router;
