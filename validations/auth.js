import { body } from "express-validator";
import UserModel from "../models/user.js";

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail().custom(async (email) => {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error("Этот email уже существует"); 
    }
    return true;
}),
  body("password", "Пароль должен быть от 5 до 10 символов").isLength({ min: 5, max: 10 }),
  body("fullName", "Имя должно быть от 3 до 24 символов").isLength({ min: 3, max: 24 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть от 5 до 10 символов").isLength({ min: 5, max: 10 }),
];