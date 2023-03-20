import { Router } from "express";
import controller from "../controllers/search.js";

// Routes to /api/search
const router: Router = Router();

/* these endpoints correspond to Spoonacular/User recipe models */
router.get("/spoonacular", controller.searchSpoonacularRecipes);
router.get("/spoonacular/random", controller.getRandomSpoonacularRecipe);
router.get("/spoonacular/recent", controller.getRecentRecipes);

router.get("/recipe/:id", controller.getRecipeById);
router.get("/recipe/:id/review", controller.getRecipeReview);

export default router;
