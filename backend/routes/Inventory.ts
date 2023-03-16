import { Router } from "express";
import controller from "../controllers/inventory.js";

export const inventoryRouter: Router = Router();

inventoryRouter.put("/pantry", controller.updatePantry);
inventoryRouter.get("/pantry", controller.getPantry);
inventoryRouter.get("/favorite", controller.getFavoriteRecipes);
inventoryRouter.put("/favorite/:id", controller.addRecipeToFavorite);
inventoryRouter.delete("/favorite/:id", controller.removeRecipeFromFavorite);
inventoryRouter.get("/myrecipes", controller.getMyRecipes);
