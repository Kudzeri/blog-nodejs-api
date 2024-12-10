import express from "express";
import { loginValidator, registerValidator } from "../validations/auth.js";
import { handleValidationErrors, checkAuth } from "../utils/index.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerValidator,handleValidationErrors, userController.register);
router.post("/login", loginValidator,handleValidationErrors, userController.login);
router.get("/profile", checkAuth, userController.getMe);

export default router;
