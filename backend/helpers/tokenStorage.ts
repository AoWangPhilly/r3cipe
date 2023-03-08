export interface tokenUserInfo {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    expiry: Date;
}

// TODO?: check if user is already in tokenStorage & how to handle duplicates
const tokenStorage: { [key: string]: tokenUserInfo } = {};

export function getTokenStorage() {
    return tokenStorage;
}

export function setToken(token: string, tokenInfo: tokenUserInfo) {
    tokenStorage[token] = tokenInfo;
}

export function deleteToken(token: string) {
    delete tokenStorage[token];
}
