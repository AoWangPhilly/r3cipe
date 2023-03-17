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
import { inventoryRouter } from "./routes/inventory.js";
import searchRouter from "./routes/search.js";
import { userRecipeRouter } from "./routes/userRecipe.js";
import { socialCircleRouter } from "./routes/circles.js";

import { userProfileRouter } from "./routes/UserProfile.js";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let publicStaticFolder = path.resolve(__dirname, "out", "public");

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

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
//********************************************************
// Upload image // this can be moved
//********************************************************
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../data/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
    //return file name to client
    let path = "http://localhost:3000/images/" + req.file?.filename;
    res.json({ path: path });
});

app.get("/images/:filename", (req, res) => {
    //try to get file at ../data/images/filename
    //if it exists, send it to client
    //if it doesn't exist, send 404
    // res.sendFile(path.join(__dirname, "../data/images", req.params.filename));
    res.sendFile(
        path.join(__dirname, "../data/images", req.params.filename),
        (err) => {
            if (err) {
                res.sendStatus(404);
            }
        }
    );
});
//********************************************************
//********************************************************

app.use("/api/auth", authRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/user/inventory", inventoryRouter);
app.use("/api/search", searchRouter);
app.use("/api/user/recipes", userRecipeRouter);
app.use("/api/circles", socialCircleRouter);

app.use("/api/user/profiles", userProfileRouter); // TODO: DELETE

// serving react app for deployment
app.use(express.static("public"));
app.get("/*", (req, res) => {
    res.sendFile("index.html", { root: publicStaticFolder });
});

// run server
const port = 3000;
const host = "localhost";
const protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
