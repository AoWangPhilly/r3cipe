import { Router } from "express";
import controller from "../controllers/search.js";

const router: Router = Router();

router.get("/recipe/:id", controller.getRecipeById);
router.get("/spoonacular", controller.searchSpoonacularRecipes);

export default router;
