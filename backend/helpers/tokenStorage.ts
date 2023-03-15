/**
 * Centralized Session storage for tokens
 * Get, Set, Delete tokens here
 */

// this Object is sent to the client for AuthContext purposes
export interface tokenUserInfo {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    expiry: Date;
}

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
