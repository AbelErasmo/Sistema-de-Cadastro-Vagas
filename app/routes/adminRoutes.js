
import express from "express";
import SuperAdminController from "../controllers/adminController.js";

const router = express.Router();

// Rotas para gerenciamento de usuários
router.post("/users", SuperAdminController.createUser);
router.put("/users/:userId", SuperAdminController.updateUser);
router.delete("/users/:userId", SuperAdminController.deleteUser);
router.get("/users", SuperAdminController.listUsers);
router.get("/users/:userId", SuperAdminController.getUserById);

export default router;
