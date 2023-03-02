import { Router } from "express";
import controller from "../controllers/auth.js";

const router = Router();

router.post("/login", controller.login);
router.post("/logout", controller.logout);
// router.post("/signup", controller.signup);
router.get("/checkLogin", controller.checkLogin);

export default router;
