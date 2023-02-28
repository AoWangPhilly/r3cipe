import { Router } from "express";
import controller from "../controllers/SocialCircle.js";

export const socialCircleRouter: Router = Router();

socialCircleRouter.post("/", controller.createSocialCircle);
socialCircleRouter.get("/", controller.getAllSocialCircle);
socialCircleRouter.get("/:userId", controller.getSocialCircle);
socialCircleRouter.put("/:userId", controller.updateSocialCircle);
socialCircleRouter.delete("/:userId", controller.deleteSocialCircle);
