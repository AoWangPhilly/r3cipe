import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import axios from "axios";
import * as fs from "fs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env")});
const API_KEY = process.env.API_KEY;
// console.log(API_KEY);

const ingredients = JSON.parse(
    fs.readFileSync("../data/ingredients.json", "utf8")
);
let app = express();

app.use(express.static(path.join(__dirname, "public")));


app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    })
);
app.use(express.json());


app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// run server
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
