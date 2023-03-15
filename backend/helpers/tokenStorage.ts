/**
 * Centralized Session storage for tokens
 * Get, Set, Delete tokens here
 */

import crypto from "crypto";
import { CookieOptions } from "express";

// this Object is sent to the client for AuthContext purposes
export interface tokenUserInfo {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    expiry: Date;
}

const TOKEN_EXPIRY = 3600; // 1 hr (in seconds)
export const clientCookieOptions: CookieOptions = {
    // secure: true, // TODO!: uncomment out for production!; comment out for Postman
    sameSite: "strict",
};
export const cookieOptions: CookieOptions = {
    ...clientCookieOptions,
    httpOnly: true,
    maxAge: TOKEN_EXPIRY * 1000,
};

// TODO?: check if user is already in tokenStorage & how to handle duplicates
let tokenStorage: { [key: string]: tokenUserInfo } = {};

export function getTokenStorage() {
    return tokenStorage;
}

export function setToken(token: string, tokenInfo: tokenUserInfo) {
    tokenStorage[token] = tokenInfo;
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