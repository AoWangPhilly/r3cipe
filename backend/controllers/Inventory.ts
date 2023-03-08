import Inventory from "../models/Inventory.js";
import { NextFunction, Request, Response } from "express";

const createInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Create inventory
        const inventory = await Inventory.create(req.body);
        // Send response
        res.status(201).json(inventory);
    } catch (error) {
        next(error);
    }
};
