import { Router } from "express";
import controller from "../controllers/Ingredient.js";

export const ingredientRouter: Router = Router();

ingredientRouter.post("/", controller.createIngredient);
ingredientRouter.get("/", controller.getIngredients);
ingredientRouter.get("/:id", controller.getIngredientById);
ingredientRouter.put("/:id", controller.updateIngredient);
ingredientRouter.delete("/:id", controller.deleteIngredient);
