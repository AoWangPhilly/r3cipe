import { Router } from "express";
import controller from "../controllers/Inventory.js";
import { authorize } from "../middleware/checkAuth.js";

// Routes to /api/user/inventory
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

inventoryRouter.get("/review/:id", authorize, controller.getUserReviewForRecipe);
inventoryRouter.put("/review/:id", authorize, controller.updateUserReviewForRecipe);