import { Router } from "express";
import controller from "../controllers/circles.js";
import { membersRouter } from "./members.js";
import { authorize } from "../middleware/checkAuth.js";

// TODO!: we might need to filter info sent to frontend for Security
// for ex: /circles/:id/members should NOT return passwords!

export const socialCircleRouter: Router = Router();

socialCircleRouter.get("/", authorize, controller.getSocialCirclesByUserId);
socialCircleRouter.post("/", authorize, controller.createSocialCircle);
socialCircleRouter.get("/:id", authorize, controller.getCircleById);
socialCircleRouter.put("/", authorize, controller.joinCircleByCode); // unused?
socialCircleRouter.put("/:id", authorize, controller.addUserToSocialCircle);
socialCircleRouter.delete("/:id", authorize, controller.deleteSocialCircle);

// Routes for Members of a specific social circle
socialCircleRouter.use("/:id/members", membersRouter);
