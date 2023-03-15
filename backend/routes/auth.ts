import { Router } from "express";
import controller from "../controllers/auth.js";
import { authorize } from "../middleware/checkAuth.js";

const router = Router();

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/signup", controller.signup);
router.get("/checkLogin", controller.checkLogin);

// TODO: DELETE
router.get("/dummy", authorize, (req, res) => {
    res.json({ message: "classified" });
});

export default router;
