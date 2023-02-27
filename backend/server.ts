import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import axios from "axios";
import * as fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { config } from "./config/config.js";

import { userProfileRouter } from "./routes/UserProfile.js";
import spoonacularRecipeRouter from "./routes/SpoonacularRecipe.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_KEY = process.env.API_KEY;

// console.log(API_KEY);
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

app.use(express.static(path.join(__dirname, "public")));

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);
app.use(express.json());

/**
 * Routes
 */
app.use("/api/user/profiles", userProfileRouter);
app.use("/api/recipe", spoonacularRecipeRouter); // TODO: change

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// run server
const port = 3000;
const host = "localhost";
const protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});