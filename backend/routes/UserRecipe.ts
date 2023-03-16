import { Router } from "express";
import controller from "../controllers/userRecipe.js";

export const userRecipeRouter: Router = Router();

userRecipeRouter.post("/", controller.createRecipe);
userRecipeRouter.put("/:id", controller.editRecipe);
userRecipeRouter.delete("/:id", controller.deleteRecipe);
userRecipeRouter.get("/", controller.queryRecipes);

export default userRecipeRouter;
