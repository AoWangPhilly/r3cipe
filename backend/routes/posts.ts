import { Router } from "express";
import { authorize } from "../middleware/checkAuth.js";
import controller from "../controllers/posts.js";

// Protected Routes to /api/circles/:id/posts
export const postsRouter: Router = Router({ mergeParams: true });

postsRouter.post("/", authorize, controller.addPostToCircle);
postsRouter.get("/", authorize, controller.getPostsByCircleId);