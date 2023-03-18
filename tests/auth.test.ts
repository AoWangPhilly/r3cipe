import UserProfile from "../backend/models/UserProfile.js";
import Inventory from "../backend/models/Inventory.js";
import axios, { AxiosError } from "axios";
import { MONGO_URL } from "../backend/config/config.js";
import mongoose from "mongoose";
import { getTokenStorage } from "../backend/helpers/tokenStorage.js";

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
        expect(userInventory?.pantry).toHaveLength(0);
        expect(userInventory?.favoritedRecipes).toHaveLength(0);
        expect(userInventory?.myRecipes).toHaveLength(0);
    });
});

describe("POST /login", () => {
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
        await UserProfile.deleteOne({ email: "user@example.com" });
        // Closing the DB connection allows Jest to exit successfully.
        await mongoClient.connection.close();
    });
    test("Invalid fields", async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: "test",
                password: "test",
            });
        } catch (error: any) {
            const response = error.response;
            expect(response.data.errors).toEqual([
                "Email is invalid",
                "Password must have at least 6 characters",
            ]);
            expect(response.status).toEqual(400);
        }
    });

    test("Invalid password", async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: "test@gmail.com",
                password: "test12345",
            });
        } catch (error: any) {
            const response = error.response;
            expect(response.data.errors).toEqual(["Incorrect password"]);
            expect(response.status).toEqual(400);
        }
    });
    test("Valid fields", async () => {
        await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: "test",
            email: "user@example.com",
            password: "test12345",
        });

        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });
        expect(response.status).toEqual(200);
        expect(response.data).toBeDefined();
    });
});

describe("POST /logout", () => {
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

    test("Not logged in", async () => {
        const response = await axios.post(`${BASE_URL}/api/auth/logout`);
        expect(getTokenStorage()).toEqual({});
    });

    test("Logged in", async () => {
        await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: "test",
            email: "user@example.com",
            password: "test12345",
        });

        expect(getTokenStorage()).toHaveLength(1);

        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });
        const logoutResponse = await axios.post(`${BASE_URL}/api/auth/logout`);

        expect(getTokenStorage()).toEqual({});
    });
});

describe("GET /checkLogin", () => {
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
        await UserProfile.deleteOne({ email: "user@example.com" });
        // Closing the DB connection allows Jest to exit successfully.
        await mongoClient.connection.close();
    });

    test("Not logged in", async () => {
        const response = await axios.get(`${BASE_URL}/api/auth/checkLogin`);
        expect(response.status).toEqual(400);
        expect(response.data).toEqual({ message: "Unauthenticated" });
    });

    test("Logged in", async () => {
        await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: "test",
            email: "user@example.com",
            password: "test12345",
        });

        await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        const response = await axios.get(`${BASE_URL}/api/auth/checkLogin`);
        expect(response.status).toEqual(200);
    });
});
