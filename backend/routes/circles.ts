import { Router } from "express";
import controller from "../controllers/circles.js";
import { membersRouter } from "./members.js";

// TODO!: we might need to filter info sent to frontend for Security
// for ex: /circles/:id/members should NOT return passwords!

export const socialCircleRouter: Router = Router();

socialCircleRouter.get("/", controller.getSocialCirclesByUserId);
socialCircleRouter.post("/", controller.createSocialCircle);
socialCircleRouter.put("/", controller.joinCircleByCode); // unused?
socialCircleRouter.get("/:id", controller.getCircleById);
socialCircleRouter.put("/:id", controller.addUserToSocialCircle);
socialCircleRouter.delete("/:id", controller.deleteSocialCircle);

// Routes for Members of a specific social circle
socialCircleRouter.use("/:id/members", membersRouter);