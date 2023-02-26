import { Router } from "express";
import controller from "../controllers/SpoonacularRecipe.js";

const router: Router = Router();

// this is just temporary for testing
router.post("/", (req, res) => {
    controller.createSpoonacularRecipe();
    res.send();
});

export default router;
