import { Router } from "express";
import controller from "../controllers/auth.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../data/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/signup", controller.signup);
router.get("/checkLogin", controller.checkLogin);

export default router;
