import { MONGO_URL } from "../backend/config/config.js";
import mongoose from "mongoose";
import axios from "axios";

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
    // Closing the DB connection allows Jest to exit successfully.
    await mongoClient.connection.close();
});

describe("GET /recipe/:id", () => {
    test("Get Spoonacular Recipe with Invalid ID", async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/search/recipe/invalid`
            );
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toEqual(404);
            expect(response.data.error).toEqual("recipe not found");
        }
    });

    test("Get Spoonacular Recipe with Valid ID", async () => {
        const response = await axios.get(
            `${BASE_URL}/api/search/recipe/716429`
        );
        expect(response.status).toEqual(200);
        expect(response.data.recipe.recipe.title).toEqual(
            "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs"
        );
    });

    test("Get User Recipe with Invalid ID", async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/search/recipe/u_invalid`
            );
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toEqual(404);
            expect(response.data.error).toEqual("user recipe not found");
        }
    });

    test("Get User Recipe with Valid ID", async () => {
        const response = await axios.get(
            `${BASE_URL}/api/search/recipe/u7b966e16-8ee0-4054-a9aa-c7ed40c9a4ab`
        );
        expect(response.status).toEqual(200);
        expect(response.data.recipe.recipe.title).toEqual("Fantasic milk 1");
    });
});

describe("GET /spoonacular", () => {
    test("Get Spoonacular Recipes with Missing Fields", async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/search/spoonacular`
            );
        } catch (error: any) {
            const response = error.response;
            expect(response.status).toEqual(400);
            expect(response.data.error).toEqual("no parameters provided");
        }
    });

    test("Get Spoonacular Recipes with Valid Query", async () => {
        const response = await axios.get(
            `${BASE_URL}/api/search/spoonacular?query=pasta`
        );
        expect(response.status).toEqual(200);
        expect(
            response.data.spoonacularRecipeResult.recipes.length
        ).toBeLessThanOrEqual(16);
    });
});
