import express from 'express';
import { createUserController, updateUserController, deleteUserController } from "../controllers/userController.js";
// import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// router.use(authenticateToken);
router.post('/', createUserController);
router.put('/:id', updateUserController);
router.delete('/:id', deleteUserController);

export default router;
