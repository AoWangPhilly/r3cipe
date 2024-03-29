import { Request, Response } from "express";
import * as argon2 from "argon2";
import { ErrorMsg, UserInfo } from "../types/types.js";
import UserProfile, {
    createUserProfileSchema,
    loginSchema,
} from "../models/UserProfile.js";
import Inventory from "../models/Inventory.js";
import { findUserByEmail } from "../helpers/UserProfile.js";
import {
    cookieOptions,
    deleteToken,
    generateToken,
    generateTokenExpiry,
    getTokenStorage,
    setToken,
} from "../helpers/tokenStorage.js";

/**
 * check if user is logged in for React app to update state
 * return: user info if logged in
 */
function checkLogin(req: Request, res: Response) {
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();
    if (tokenStorage.hasOwnProperty(token)) {
        // check if token is expired
        if (tokenStorage[token].expiry < new Date()) {
            console.log("token expired");
            deleteToken(token);
            // delete tokenStorage[token];
            res.clearCookie("token", cookieOptions);
        } else {
            return res
                .status(200)
                .json({ message: "Authenticated", user: tokenStorage[token] });
        }
    }
    return res.status(400).json({ message: "Unauthenticated" });
}
/**
 * creates a new user from email, name, and password
 * also initializes Inventory for that user
 */
async function signup(req: Request, res: Response) {
    let parseResult = createUserProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
        // extract Zod error message
        let errors = parseResult.error.errors.map((error) => {
            return error.message;
        });
        // console.log(errors);
        return res.status(400).json({ errors: errors });
    }

    const { name, email, password, profileUrl } = parseResult.data;

    // check if user exists
    const user = await findUserByEmail(email);
    if (user.errors) {
        if (user.errors[0] == "500") {
            console.log(500);
            return res.status(500).json({ errors: user.errors?.slice(1) });
        }
    }

    if (!user.userProfile) {
        // create new user
        const hashedPassword = await argon2.hash(password);
        // add to mongo
        const userProfile = new UserProfile({
            name,
            email,
            password: hashedPassword,
            profileUrl,
        });
        const savedUserProfile = await userProfile.save();

        // Initialize Inventory
        console.log(savedUserProfile._id);
        const inventory = new Inventory({ userId: savedUserProfile._id });

        /* await Inventory.create({
            userId: userProfile._id,
        }); */
        const savedInventory = await inventory.save();

        if (!savedInventory || !savedUserProfile) {
            return res.status(500).json({ errors: ["Internal server error"] });
        }

        const token = generateToken();

        const tokenInfo: UserInfo = {
            id: savedUserProfile._id.toString(),
            name,
            email,
            profileUrl: savedUserProfile.profileUrl!,
            expiry: generateTokenExpiry(),
        };
        setToken(token, tokenInfo);

        return res
            .cookie("token", token, cookieOptions)
            .json({ message: "success" });
    } else {
        return res.status(400).json({ errors: ["Email already exists"] });
    }
}

/**
 * Request body: { username: string, password: string }
 * return: set cookies
 */
async function login(
    req: Request,
    res: Response<ErrorMsg | { message: string }>
) {
    let parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        // extract Zod error message
        let errors = parseResult.error.errors.map((error) => {
            return error.message;
        });
        // console.log(errors);
        return res.status(400).json({ errors: errors });
    }

    const { email, password } = parseResult.data;

    // check if user exists
    const user = await findUserByEmail(email);

    if (user.errors) {
        if (user.errors[0] == "404") {
            return res.status(404).json({ errors: user.errors.slice(1) });
        } else if (user.errors[0] == "500") {
            console.log(500);
            return res.status(500).json({ errors: user.errors?.slice(1) });
        }
    }

    // added bc TS is annoying
    if (!user.userProfile) {
        return res.status(404).json({ errors: ["User not found"] });
    }

    // check if password is correct
    let isPasswordCorrect;
    try {
        isPasswordCorrect = await argon2.verify(
            user.userProfile.password,
            password
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }

    if (!isPasswordCorrect) {
        return res.status(400).json({ errors: ["Incorrect password"] });
    }

    // create user info for token
    const tokenInfo: UserInfo = {
        id: user.userProfile.id,
        name: user.userProfile.name,
        email: user.userProfile.email,
        profileUrl: user.userProfile.profileUrl!,
        expiry: generateTokenExpiry(),
    };

    const token = generateToken();
    setToken(token, tokenInfo);

    return res
        .cookie("token", token, cookieOptions)
        .json({ message: "success" });
}

async function logout(req: Request, res: Response) {
    // sometimes there's no cookies property in Postman - this might be unnecessary
    if (!req.cookies) {
        console.log(req.cookies);
        console.log("No cookies");
        return res.json();
    }

    const { token } = req.cookies;

    if (!token) {
        console.log("already logged out");
        return res.json();
    }
    const tokenStorage = getTokenStorage();
    if (!tokenStorage.hasOwnProperty(token)) {
        console.log("token invalid");
    }
    deleteToken(token);
    // delete tokenStorage[token];

    // res.clearCookie("loggedIn", clientCookieOptions);
    return res.clearCookie("token", cookieOptions).json({ message: "success" });
}

export default {
    login,
    logout,
    signup,
    checkLogin,
};
