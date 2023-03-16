import { UserInfo } from "./types.js";

// References:
// https://blog.logrocket.com/extend-express-request-object-typescript/#extending-the-express-request-type-in-typescript
// https://plusreturn.com/blog/how-to-extend-express-request-interface-in-typescript/
// https://stackoverflow.com/questions/39040108/import-class-in-definition-file-d-ts

// to make the file a module and avoid the TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            user: UserInfo;
        }
    }
}

/* import { Express } from "express-serve-static-core";

// this Object is sent to the client for AuthContext purposes
export interface UserInfo {
    id: string;
    name: string;
    email: string;
    profileUrl: string;
    expiry: Date;
}

declare module "express-serve-static-core" {
    interface Request {
        user: UserInfo;
    }
} */
