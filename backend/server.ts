import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "./config/config.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";
import { ingredientRouter } from "./routes/Ingredient.js";
import { inventoryRouter } from "./routes/Inventory.js";
import searchRouter from "./routes/search.js";
import { userRecipeRouter } from "./routes/UserRecipe.js";
import { socialCircleRouter } from "./routes/SocialCircle.js";

import { userProfileRouter } from "./routes/UserProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

let app = express();

/**
 * Connect to MongoDB
 */
mongoose.set("strictQuery", true);
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.log("DB connection failed");
    });

/* Middleware */
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true, // tells client to send token
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Express REST API endpoints
 */
app.use("/api/auth", authRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/user/inventory", inventoryRouter);
app.use("/api/search", searchRouter);
app.use("/api/user/recipes", userRecipeRouter);
app.use("/api/circles", socialCircleRouter);

app.use("/api/user/profiles", userProfileRouter); // TODO: DELETE

// run server
const port = 3000;
const host = "localhost";
const protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
