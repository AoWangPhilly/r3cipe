import { Router } from "express";
import controller from "../controllers/Ingredient.js";

export const ingredientRouter: Router = Router();

ingredientRouter.post("/", controller.createIngredient);
ingredientRouter.get("/", controller.getIngredients);
ingredientRouter.get("/:userId", controller.getIngredientById);
ingredientRouter.put("/:userId", controller.updateIngredient);
ingredientRouter.delete("/:userId", controller.deleteIngredient);
