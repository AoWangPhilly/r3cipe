import { MONGO_URL } from "../backend/config/config.js";
import mongoose from "mongoose";
import axios from "axios";
import UserProfile from "../backend/models/UserProfile.js";
import SocialCircle from "../backend/models/SocialCircle";

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
    await UserProfile.deleteOne({ email: "test@example.com" });
    await UserProfile.deleteOne({ email: "user@example.com" });
    await SocialCircle.deleteOne({ name: "test" });
    await SocialCircle.deleteOne({ name: "example" });

    await mongoClient.connection.close();
});

describe("GET circles by UID", () => {
    test("Get user circle", async () => {
        const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
            name: "test",
            email: "user@example.com",
            password: "test12345",
        });
        const response = await axios.get(`${BASE_URL}/api/circles/`, {
            headers: {
                Cookie: `${signupResponse.headers["set-cookie"]![0]}`, // replace sessionId with the actual session ID obtained after logging in
            },
        });
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ socialCircles: [] });
    });
});

describe("POST circles", () => {
    test("Create user circle", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        const response = await axios.post(
            `${BASE_URL}/api/circles/`,

            {
                name: "test",
                description: "test",
            },
            {
                headers: { Cookie: loginResponse.headers["set-cookie"]![0] },
            }
        );

        expect(response.status).toEqual(201);
        expect(response.data.socialCircle["name"]).toEqual("test");
    });

    test("Create user circle with same name", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });
        try {
            const response = await axios.post(
                `${BASE_URL}/api/circles/`,

                {
                    name: "test",
                    description: "test",
                },
                {
                    headers: {
                        Cookie: loginResponse.headers["set-cookie"]![0],
                    },
                }
            );
        } catch (error: any) {
            expect(error.response.data.message).toEqual(
                "Social circle already exists"
            );
            expect(error.response.status).toEqual(400);
        }
    });
});

describe("GET circles by ID", () => {
    test("Get user circle by Valid ID", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        const response = await axios.post(
            `${BASE_URL}/api/circles/`,

            {
                name: "example",
                description: "test",
            },
            {
                headers: {
                    Cookie: loginResponse.headers["set-cookie"]![0],
                },
            }
        );

        const circleByIdResponse = await axios.get(
            `${BASE_URL}/api/circles/${response.data.socialCircle["_id"]}`,
            {
                headers: {
                    Cookie: loginResponse.headers["set-cookie"]![0],
                },
            }
        );

        expect(circleByIdResponse.status).toEqual(200);
    });

    test("Get user circle by Invalid ID", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        try {
            const response = await axios.post(
                `${BASE_URL}/api/circles/`,

                {
                    name: "example",
                    description: "test",
                },
                {
                    headers: {
                        Cookie: loginResponse.headers["set-cookie"]![0],
                    },
                }
            );

            const circleByIdResponse = await axios.get(
                `${BASE_URL}/api/circles/invalid`,
                {
                    headers: {
                        Cookie: loginResponse.headers["set-cookie"]![0],
                    },
                }
            );
        } catch (error: any) {
            expect(error.response.data.message).toEqual(
                "Social circle already exists"
            );
            expect(error.response.status).toEqual(400);
        }
    });
});

describe("PUT join circles by code", () => {
    test("Already a member", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        const circle = await SocialCircle.findOne({ name: "test" });
        try {
            const response = await axios.put(
                `${BASE_URL}/api/circles`,
                { id: circle?._id },
                {
                    headers: {
                        Cookie: loginResponse.headers["set-cookie"]![0],
                    },
                }
            );
        } catch (error: any) {
            expect(error.response.data.error).toEqual(
                "You are already a member of this circle"
            );
            expect(error.response.status).toEqual(400);
        }
    });

    test("Join circle", async () => {
        try {
            const signupResponse = await axios.post(
                `${BASE_URL}/api/auth/signup`,
                {
                    name: "test",
                    email: "test@example.com",
                    password: "test12345",
                }
            );

            const circle = await SocialCircle.findOne({ name: "test" });
            const response = await axios.put(
                `${BASE_URL}/api/circles`,
                { id: circle?._id },
                {
                    headers: {
                        Cookie: signupResponse.headers["set-cookie"]![0],
                    },
                }
            );
            expect(response.status).toEqual(200);
            expect(response.data.socialCircle.members).toHaveLength(2);
        } catch (error: any) {
            console.log(error);
        }
    });
});

describe("DELETE remove social circle", () => {
    test("Remove social circle", async () => {
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: "user@example.com",
            password: "test12345",
        });

        const response = await axios.post(
            `${BASE_URL}/api/circles/`,
            {
                name: "example",
                description: "test",
            },
            {
                headers: {
                    Cookie: loginResponse.headers["set-cookie"]![0],
                },
            }
        );
    });
});
