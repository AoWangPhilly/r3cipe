import { Router } from "express";
import controller from "../controllers/inventory.js";
import { authorize } from "../middleware/checkAuth.js";

export const inventoryRouter: Router = Router();

inventoryRouter.put("/pantry", authorize, controller.updatePantry);
inventoryRouter.get("/pantry", authorize, controller.getPantry);
inventoryRouter.get("/favorite", authorize, controller.getFavoriteRecipes);
inventoryRouter.put("/favorite/:id", authorize, controller.addRecipeToFavorite);
inventoryRouter.delete(
    "/favorite/:id",
    authorize,
    controller.removeRecipeFromFavorite
);
inventoryRouter.get("/myrecipes", authorize, controller.getMyRecipes);
