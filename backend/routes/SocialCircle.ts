import { Router } from "express";
import controller from "../controllers/SocialCircle.js";

export const socialCircleRouter: Router = Router();

socialCircleRouter.post("/", controller.createSocialCircle);
socialCircleRouter.get("/", controller.getAllSocialCircle);
socialCircleRouter.get("/:id", controller.getSocialCircle);
socialCircleRouter.put("/:id", controller.updateSocialCircle);
socialCircleRouter.delete("/:id", controller.deleteSocialCircle);
