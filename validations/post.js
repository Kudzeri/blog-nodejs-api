import { body } from "express-validator";
import PostModel from "../models/post.js";

export const postCreate = [
  body("slug", "Минимальная длина slug 3 символа")
    .isLength({ min: 3 })
    .isString()
    .custom(async (slug) => {
      const existingPost = await PostModel.findOne({ slug });
      if (existingPost) {
        throw new Error("Этот slug уже существует");
      }
      return true;
    }),
  body("title", "Минимальная длина заголовка 3 символа")
    .isLength({ min: 3 })
    .isString(),
  body("text", "Минимальная длина текста 10 символов")
    .isLength({ min: 10 })
    .isString(),
  body("tags", "Неверный формат тэгов").optional().isArray(),
];

export const postUpdate = [
  body("title", "Минимальная длина заголовка 3 символа")
    .isLength({ min: 3 })
    .isString(),
  body("text", "Минимальная длина текста 10 символов")
    .isLength({ min: 10 })
    .isString(),
  body("tags", "Неверный формат тэгов").optional().isArray(),
];
