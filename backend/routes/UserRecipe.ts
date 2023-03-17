import { Router } from "express";
import controller from "../controllers/UserRecipe.js";
import { authorize } from "../middleware/checkAuth.js";

export const userRecipeRouter: Router = Router();

userRecipeRouter.get("/", controller.queryRecipes);
userRecipeRouter.post("/", authorize, controller.createRecipe);
userRecipeRouter.put("/:id", authorize, controller.editRecipe);
userRecipeRouter.delete("/:id", authorize, controller.deleteRecipe);

export default userRecipeRouter;
