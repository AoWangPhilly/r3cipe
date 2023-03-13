import { Router } from "express";
import controller from "../controllers/SocialCircle.js";

export const socialCircleRouter: Router = Router();

socialCircleRouter.post("/", controller.createSocialCircle);
socialCircleRouter.get("/", controller.getSocialCirclesByUserId);
socialCircleRouter.put("/:id", controller.joinSocialCircle);
socialCircleRouter.delete("/:id", controller.deleteSocialCircle);
// socialCircleRouter.get("/", controller.getAllSocialCircle);
// socialCircleRouter.get("/:id", controller.getSocialCircle);
// socialCircleRouter.put("/:id", controller.updateSocialCircle);
// socialCircleRouter.put("/:id/addMember", controller.addMember);
// socialCircleRouter.put("/:id/removeMember", controller.removeMember);
// socialCircleRouter.put("/:id/changeOwner", controller.changeOwner);
// socialCircleRouter.delete("/:id", controller.deleteSocialCircle);
// socialCircleRouter.put("/:id/addPost", controller.addPost);
// socialCircleRouter.put("/:id/removePost", controller.removePost);
// socialCircleRouter.get("/:id/posts", controller.getPosts);
