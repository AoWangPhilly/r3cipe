import { Router } from "express";
import controller from "../controllers/SocialCircle.js";

export const socialCircleRouter: Router = Router();

socialCircleRouter.get("/", controller.getSocialCirclesByUserId);
socialCircleRouter.post("/", controller.createSocialCircle);
socialCircleRouter.put("/", controller.joinCircleByCode); // unused?
socialCircleRouter.get("/:id", controller.getCircleById);
socialCircleRouter.put("/:id", controller.addUserToSocialCircle);
socialCircleRouter.delete("/:id", controller.deleteSocialCircle);
socialCircleRouter.get("/:id/members", controller.getMembersBySocialCircleId);
