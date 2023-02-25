import { Router } from "express";
import controller from "../controllers/UserProfile.js";

export const userProfileRouter: Router = Router();

userProfileRouter.post("/", controller.createUserProfile);
userProfileRouter.get("/", controller.getAllUserProfiles);
userProfileRouter.get("/:userId", controller.getUserProfile);
