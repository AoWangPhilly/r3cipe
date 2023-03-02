import { CookieOptions, Request, Response } from "express";
import * as argon2 from "argon2";
import crypto from "crypto";
import { loginSchema } from "../models/UserProfile.js";
import { ErrorMsg } from "../types.js";
import { findUserByEmail } from "../helpers/UserProfile.js";

// need to export this for middleware
const tokenStorage: { [key: string]: string } = {};

const clientCookieOptions: CookieOptions = {
    secure: true,
    sameSite: "strict",
};
const cookieOptions: CookieOptions = {
    ...clientCookieOptions,
    httpOnly: true,
};

/**
 * Request body: { username: string, password: string }
 * return: set cookies
 * TODO: might need to check if email is already in tokenStorage?
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

    // check if password is correct
    let isPasswordCorrect;
    try {
        isPasswordCorrect = await argon2.verify(
            user.userProfile!.password,
            password
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ errors: ["Internal server error"] });
    }

    if (!isPasswordCorrect) {
        return res.status(400).json({ errors: ["Incorrect password"] });
    }

    // console.log(user);
    const token = crypto.randomBytes(32).toString("hex");
    tokenStorage[token] = email;
    return res
        .cookie("token", token, cookieOptions)
        .cookie("loggedIn", true, clientCookieOptions)
        .json({ message: "success" });
}

export default {
    login,
};
