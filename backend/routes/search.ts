import { Router } from "express";
import controller from "../controllers/search.js";

const router: Router = Router();

// this is just temporary for testing
router.get("/spoonacular", controller.searchSpoonacularRecipes);
router.get("/recipe/:id", controller.getRecipeById);
router.post("/user", (req, res) => {
    // controller.createSpoonacularRecipe();
    res.json();
});

export default router;
