import UserProfile from "../backend/models/UserProfile.js";
import Inventory from "../backend/models/Inventory.js";
import axios, { AxiosError } from "axios";
import { MONGO_URL } from "../backend/config/config.js";
import mongoose from "mongoose";

const BASE_URL = "http://localhost:3000";

// create tests for the auth controller
describe("POST /signup", () => {
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
        await UserProfile.deleteOne({ email: "user@example.com" });
        await mongoClient.connection.close();
    });

    test("Invalid fields", async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
                name: "test",
                email: "test",
                password: "test",
            });
        } catch (error: any) {
            const response = error.response;
            expect(response.data.errors).toEqual([
                "Invalid email",
                "Password must have at least 6 characters",
            ]);
            expect(response.status).toEqual(400);
        }
    });
    test("User already exists", async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
                name: "test",
                email: "test@gmail.com",
                password: "test123",
            });
        } catch (error: any) {
            const response = error.response;

            expect(response.status).toEqual(400);
            expect(response.data.errors).toEqual(["Email already exists"]);
        }
    });

    test("Valid fields", async () => {
        const testUser = {
            name: "test",
            email: "user@example.com",
            password: "test123",
        };

        const response = await axios.post(
            `${BASE_URL}/api/auth/signup`,
            testUser
        );
        expect(response.status).toEqual(200);
        expect(response.data).toBeDefined();
    });

    test("Inventory created", async () => {
        const userInventory = await Inventory.findOne({
            email: "user@example.com",
        });
        console.log(userInventory);
        expect(userInventory?.pantry).toHaveLength(0);
        expect(userInventory?.favoritedRecipes).toHaveLength(0);
        expect(userInventory?.myRecipes).toHaveLength(0);
    });
});

// describe("POST /login", () => {
//     test("Invalid fields", async () => {});
//     test("User does not exist", async () => {});
//     test("Invalid password", async () => {});
//     test("Valid fields", async () => {});
// });
