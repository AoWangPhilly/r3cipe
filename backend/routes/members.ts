import { Router } from "express";
import controller from "../controllers/members.js";
import { authorize } from "../middleware/checkAuth.js";

// Protected Routes to /api/circles/:id/members
export const membersRouter: Router = Router({ mergeParams: true });

// TODO!: we might need to filter info sent to frontend for Security
// /circles/:id/members should NOT return passwords!
membersRouter.get("/", authorize, controller.getMembersBySocialCircleId);
membersRouter.delete("/", authorize, controller.removeMemberFromCircle);
