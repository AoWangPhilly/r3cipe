import { Router } from "express";
import controller from "../controllers/members.js";

export const membersRouter: Router = Router({ mergeParams: true });

// TODO: remove passwords from response
membersRouter.get("/", controller.getMembersBySocialCircleId);
