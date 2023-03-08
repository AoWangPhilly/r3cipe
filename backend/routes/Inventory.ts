import { Router } from "express";
import controller from "../controllers/Inventory.js";

export const inventoryRouter: Router = Router();

inventoryRouter.post("/", controller.createInventory);
inventoryRouter.put("/pantry", controller.updatePantry);
inventoryRouter.get("/pantry", controller.getPantry);
