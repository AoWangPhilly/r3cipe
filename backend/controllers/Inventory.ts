import Inventory from "../models/Inventory.js";
import { NextFunction, Request, Response } from "express";
import { getTokenStorage } from "../helpers/tokenStorage.js";

const createInventory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            throw new Error("Invalid token");
        }

        const inventory = await Inventory.create({
            userId: tokenStorage[token].id,
        });
        inventory.save();
        // Send response
        res.status(201).json(inventory);
    } catch (error) {
        next(error);
    }
};

const updatePantry = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const { pantry } = req.body;
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        inventory.pantry = pantry;
        inventory.save();
        // Send response
        res.status(201).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getPantry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        const tokenStorage = getTokenStorage();
        if (!tokenStorage[token]) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const inventory = await Inventory.findOne({
            userId: tokenStorage[token].id,
        });
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        // Send response
        res.status(201).json(inventory.pantry);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
export default {
    createInventory,
    updatePantry,
    getPantry,
};
