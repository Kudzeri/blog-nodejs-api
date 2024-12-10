import express from "express";
import { postCreate,postUpdate } from "../validations/post.js";
import { handleValidationErrors, checkAuth } from "../utils/index.js";
import * as postController from "../controllers/postController.js";

const router = express.Router();

router.get("/posts", postController.getAll);
router.get("/posts/tags", postController.lastTags);
router.get("/posts/:slug", postController.getOne);
router.post("/posts", postCreate,handleValidationErrors, checkAuth, postController.create);
router.patch("/posts/:slug", postUpdate,handleValidationErrors, checkAuth, postController.update);
router.delete("/posts/:slug", checkAuth, postController.destroy);

export default router;
