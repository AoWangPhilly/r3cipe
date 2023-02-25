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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
const API_KEY = process.env.API_KEY;
// console.log(API_KEY);

let app = express();

/**
 * Connect to Mongoose
 */
mongoose.set("strictQuery", true);
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
        console.log("connected!");
    })
    .catch((error) => {
        console.log(error);
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
 * Routers
 */
app.use("/api/user/profiles", userProfileRouter);

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
