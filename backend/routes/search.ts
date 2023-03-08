import { Router } from "express";
import controller from "../controllers/search.js";

const router: Router = Router();

// this is just temporary for testing
router.post("/spoonacular", (req, res) => {
    // controller.createSpoonacularRecipe();
    res.json();
});

router.post("/user", (req, res) => {
    // controller.createSpoonacularRecipe();
    res.json();
});

export default router;
