import { Router } from "express";
import controller from "../controllers/circles.js";
import { authorize } from "../middleware/checkAuth.js";
import { membersRouter } from "./members.js";
import { postsRouter } from "./posts.js";

// TODO!: we might need to filter info sent to frontend for Security
// for ex: /circles/:id/members should NOT return passwords!

export const socialCircleRouter: Router = Router();

socialCircleRouter.get("/", authorize, controller.getSocialCirclesByUserId);
socialCircleRouter.post("/", authorize, controller.createSocialCircle);
socialCircleRouter.get("/:id", authorize, controller.getCircleById);
socialCircleRouter.put("/", authorize, controller.joinCircleByCode);
socialCircleRouter.delete("/:id", authorize, controller.deleteSocialCircle);
// socialCircleRouter.put("/:id", authorize, controller.addUserToSocialCircle); // unused

// Routes for Members & Posts of a specific social circle
socialCircleRouter.use("/:id/members", membersRouter);
socialCircleRouter.use("/:id/posts", postsRouter);