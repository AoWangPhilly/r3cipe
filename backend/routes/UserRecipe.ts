import { Router } from "express";
import controller from "../controllers/UserRecipe.js";

export const userRecipeRouter: Router = Router();

userRecipeRouter.post("/", controller.createRecipe);
userRecipeRouter.put("/:id", controller.editRecipe);
userRecipeRouter.delete("/:id", controller.deleteRecipe);

export default userRecipeRouter;
