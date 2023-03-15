import { Router } from "express";
import controller from "../controllers/search.js";

const router: Router = Router();

/* these endpoints correspond to Spoonacular/User recipe models */
router.get("/recipe/:id", controller.getRecipeById);
router.get("/spoonacular", controller.searchSpoonacularRecipes);
router.get("/spoonacular/random", controller.getRandomSpoonacularRecipe);

export default router;
