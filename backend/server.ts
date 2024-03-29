import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "./config/config.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import fs from "fs";

import authRouter from "./routes/auth.js";
import { ingredientRouter } from "./routes/Ingredient.js";
import { inventoryRouter } from "./routes/Inventory.js";
import searchRouter from "./routes/search.js";
import { userRecipeRouter } from "./routes/UserRecipe.js";
import { socialCircleRouter } from "./routes/circles.js";

import multer from "multer";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let publicStaticFolder = path.resolve(__dirname, "public");

dotenv.config({ path: path.join(__dirname, "../.env") });

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

/**
 * Connect to MongoDB
 */
mongoose.set("strictQuery", true);
mongoose
    .connect(config.mongo.url, {
        dbName: process.env.STAGE?.toLowerCase(),
        retryWrites: true,
        w: "majority",
    })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.log("DB connection failed");
    });

/* Middleware */
// app.use(limiter);
// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.crossOriginEmbedderPolicy());
// app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.originAgentCluster());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://spoonacular.com",
            "https://food.tylers.works"
        ],
        credentials: true, // tells client to send token
    })
);
app.use(cookieParser());
app.use(express.json());

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
    let path;
    if (process.env.stage === "DEV") {
        path = "http://localhost:3000/images/" + req.file?.filename;
    } else {
        path = "https://food.tylers.works/images/" + req.file?.filename;
    }
    res.json({ path: path });
});

app.get("/images/:filename", (req, res) => {
    //try to get file at ../data/images/filename
    //if it exists, send it to client
    //if it doesn't exist, send 404
    // res.sendFile(path.join(__dirname, "../data/images", req.params.filename));
    //check if file exists first
    try {
        if (
            fs.existsSync(
                path.join(__dirname, "../data/images", req.params.filename)
            )
        ) {
            res.sendFile(
                path.join(__dirname, "../data/images", req.params.filename),
                (err) => {
                    if (err) {
                        console.log(
                            "file is not truly there",
                            req.params.filename
                        );
                    }
                }
            );
        } else {
            res.status(404).send("File not found");
        }
    } catch (err) {
        console.error("get image error: ", err);
    }
});
//********************************************************
//********************************************************

app.use("/api/auth", authRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/user/inventory", inventoryRouter);
app.use("/api/search", searchRouter);
app.use("/api/user/recipes", userRecipeRouter);
app.use("/api/circles", socialCircleRouter);

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
