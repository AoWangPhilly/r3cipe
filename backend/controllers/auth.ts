import { CookieOptions, Request, Response } from "express";
import * as argon2 from "argon2";
import crypto from "crypto";
import { loginSchema } from "../models/UserProfile.js";
import { ErrorMsg } from "../types.js";
import { findUserByEmail } from "../helpers/UserProfile.js";

const TOKEN_EXPIRY = 3600; // 1 hr (in seconds)

interface tokenUserInfo {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    expiry: Date;
}

// TODO: check if email is already in tokenStorage & how to handle duplicates
// need to export this for middleware
const tokenStorage: { [key: string]: tokenUserInfo } = {};

const clientCookieOptions: CookieOptions = {
    // secure: true, // comment out for Dev in Postman!!!
    sameSite: "strict",
};
const cookieOptions: CookieOptions = {
    ...clientCookieOptions,
    httpOnly: true,
    maxAge: TOKEN_EXPIRY * 1000,
};

/**
 * check if user is logged in for React app to update state
 * return: user info if logged in
 */
function checkLogin(req: Request, res: Response) {
    const { token } = req.cookies;
    if (tokenStorage.hasOwnProperty(token)) {
        // check if token is expired
        if (tokenStorage[token].expiry > new Date()) {
            console.log("token expired");
            delete tokenStorage[token];
            res.clearCookie("token", cookieOptions);
        } else {
            return res
                .status(200)
                .json({ message: "Authenticated", user: tokenStorage[token] });
        }
    }
    return res.status(400).json({ message: "Unauthenticated" });
}

// TODO
// I set this up in the frontend to send a request to this endpoint with:
// { name: string,  email: string, password: string, }
// if successful, set cookies
// else send response message with error
// -tyler
async function signup(req: Request, res: Response) {}

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
    const tokenInfo: tokenUserInfo = {
        id: user.userProfile.id,
        name: user.userProfile.name,
        email: user.userProfile.email,
        profileUrl: user.userProfile.profileUrl!,
        expiry: new Date(Date.now() + TOKEN_EXPIRY * 1000),
    };

    const token = crypto.randomBytes(32).toString("hex");
    tokenStorage[token] = tokenInfo;
    // console.log(tokenStorage);
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
    if (!tokenStorage.hasOwnProperty(token)) {
        console.log("token invalid");
    }
    delete tokenStorage[token];

    // res.clearCookie("loggedIn", clientCookieOptions);
    return res.clearCookie("token", cookieOptions).json({ message: "success" });
}

export default {
    login,
    logout,
    signup,
    checkLogin,
};
