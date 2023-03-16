import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorMsg } from "../types/types.js";
import { cookieOptions } from "../helpers/tokenStorage.js";
import { deleteToken, getTokenStorage } from "../helpers/tokenStorage.js";

/**
 * only allow access if user logged in
 * send error response if they're not
 */
export const authorize: RequestHandler = (
    req: Request,
    res: Response<ErrorMsg>,
    next: NextFunction
) => {
    const token = req.cookies.token;
    const tokenStorage = getTokenStorage();

    // if invalid token, clear the token from cookies
    if (!token) {
        return res.status(401).json({ errors: ["Unauthorized: no token"] });
    } else if (!tokenStorage.hasOwnProperty(token)) {
        console.log("invalid token");
        return res
            .clearCookie("token", cookieOptions)
            .status(401)
            .json({ errors: ["Unauthorized: invalid token"] });
    } else {
        // check if token is expired
        if (tokenStorage[token].expiry < new Date()) {
            console.log("token expired");
            deleteToken(token);
            res.clearCookie("token", cookieOptions);
            return res
                .status(401)
                .json({ errors: ["Unauthorized: token expired"] });
        }
    }

    // add authenticated User info to Request
    req.user = tokenStorage[token];

    next();
};
