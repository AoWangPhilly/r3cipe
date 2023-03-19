import { MONGO_URL } from "../backend/config/config.js";
import mongoose from "mongoose";
import axios from "axios";
import UserProfile from "../backend/models/UserProfile.js";
import Inventory from "../backend/models/Inventory.js";

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
    await UserProfile.deleteOne({ email: "user@example.com" });
    await mongoClient.connection.close();
});

describe("GET pantry", () => {
    test("Get pantry without logging in", async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/api/user/inventory/pantry`
            );
            expect(response.status).toEqual(200);
            expect(response.data.pantry.length).toBeGreaterThan(0);
        } catch (error: any) {
            expect(error.response.status).toEqual(401);
        }
    });

    test("Get pantry after logging in", async () => {
        const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: "test",
            email: "user@example.com",
            password: "test12345",
        });
        const response = await axios.get(
            `${BASE_URL}/api/user/inventory/pantry`,
            {
                headers: {
                    Cookie: `${signupResponse.headers["set-cookie"]![0]}`, // replace sessionId with the actual session ID obtained after logging in
                },
            }
        );

        expect(response.status).toEqual(201);
        expect(response.data.length).toEqual(0);
    });
});

describe("PUT pantry", () => {
    test("Put pantry", async () => {
        try {
            const loginResponse = await axios.post(
                `${BASE_URL}/api/auth/login`,
                {
                    name: "test",
                    email: "user@example.com",
                    password: "test12345",
                }
            );

            const response = await axios.put(
                `${BASE_URL}/api/user/inventory/pantry/`,
                {
                    pantry: ["test 1", "test 2", "test 3"],
                },
                {
                    headers: {
                        Cookie: `${loginResponse.headers["set-cookie"]![0]}`, // replace sessionId with the actual session ID obtained after logging in
                    },
                }
            );
            expect(response.status).toEqual(201);
            expect(response.data.pantry.length).toEqual(3);

            const userProfile = await UserProfile.findOne({
                email: "user@example.com",
            });
            const inventory = await Inventory.findOne({
                user: userProfile?._id,
            });
            await Inventory.deleteOne({ _id: inventory?._id });
        } catch (error: any) {
            console.log(error.response.data);
        }
    });
});

describe("GET favorite recipes", () => {
    test("Get favorite recipes", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        const response = await axios.get(
            `${BASE_URL}/api/user/inventory/favorite`,
            {
                headers: {
                    Cookie: `${loginResponse.headers["set-cookie"]![0]}`, // replace sessionId with the actual session ID obtained after logging in
                },
            }
        );

        expect(response.status).toEqual(201);
        expect(response.data).toEqual([]);
    });
});
