/**
 * Centralized Session storage for tokens
 * Get, Set, Delete tokens here
 */

import crypto from "crypto";
import { CookieOptions } from "express";
import { UserInfo } from "../types/types.js";

const TOKEN_EXPIRY = 3600; // 1 hr (in seconds)
export const clientCookieOptions: CookieOptions = {
    secure: true,
    sameSite: "strict",
};
export const cookieOptions: CookieOptions = {
    ...clientCookieOptions,
    httpOnly: true,
    maxAge: TOKEN_EXPIRY * 1000,
};

// TODO?: check if user is already in tokenStorage & how to handle duplicates
let tokenStorage: { [key: string]: UserInfo } = {};

export function getTokenStorage() {
    return tokenStorage;
}

export function setToken(token: string, tokenInfo: UserInfo) {
    tokenStorage[token] = tokenInfo;
    // console.log(tokenStorage);
}

export function deleteToken(token: string) {
    delete tokenStorage[token];
}

export function generateToken() {
    return crypto.randomBytes(32).toString("hex");
}

export function generateTokenExpiry() {
    return new Date(Date.now() + TOKEN_EXPIRY * 1000);
}
