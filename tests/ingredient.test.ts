import { MONGO_URL } from "../backend/config/config.js";
import mongoose from "mongoose";
import axios from "axios";
import UserProfile from "../backend/models/UserProfile.js";
import Ingredient from "../backend/models/Ingredient.js";

const BASE_URL = "http://localhost:3000";

let mongoClient: typeof mongoose;

beforeAll(async () => {
    // connect to the database
    try {
        mongoClient = await mongoose.connect(MONGO_URL);
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    await mongoClient.connection.close();
});

describe("GET ingredients", () => {
    test("Get all ingredients", async () => {
        const response = await axios.get(`${BASE_URL}/api/ingredients/`);
        expect(response.status).toEqual(200);
        expect(response.data.ingredients.length).toBeGreaterThan(0);
    });
});

describe("GET ingredient by ID", () => {
    test("Get ingredient by ID", async () => {
        const id = 11482;
        const response = await axios.get(`${BASE_URL}/api/ingredients/${id}`);
        expect(response.status).toEqual(200);
        expect(response.data.ingredient.name).toEqual("Acorn Squash");
    });

    test("Get ingredient by invalid ID", async () => {
        const id = "invalid";

        try {
            const response = await axios.get(
                `${BASE_URL}/api/ingredients/${id}`
            );
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toEqual(404);
            expect(response.data).toEqual({ error: "Ingredient not found" });
        }
    });
});
