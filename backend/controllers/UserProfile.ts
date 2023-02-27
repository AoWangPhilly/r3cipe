import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import UserProfile, {
    createUserProfileSchema,
    IUserProfile,
    updateUserProfileSchema,
} from "../models/UserProfile.js";
import * as argon2 from "argon2";

const createUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createUserProfileSchema.parse(req.body);
        const { name, email, password, profileUrl } = validatedData;
        const hashedPassword = await argon2.hash(password);
        const userProfile = new UserProfile({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password: hashedPassword,
            profileUrl,
        });
        const savedUserProfile = await userProfile.save();
        res.status(201).json({ userProfile: savedUserProfile });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const getUserProfile = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    return UserProfile.findById(userId)
        .then((userProfile) =>
            userProfile
                ? res.status(200).json({ userProfile })
                : res.status(404).json({ message: "Not found" })
        )
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getAllUserProfiles = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return UserProfile.find()
        .then((userProfile) => res.status(200).json({ userProfile }))
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = updateUserProfileSchema.parse(req.body);
        const { name, email, password, profileUrl } =
            validatedData as IUserProfile;
        const userId = req.params.userId;
        const userProfile = await UserProfile.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ message: "not found" });
        }
        if (name) {
            userProfile.name = name;
        }

        if (email) {
            userProfile.email = email;
        }

        if (profileUrl) {
            userProfile.profileUrl = profileUrl;
        }

        if (password) {
            userProfile.password = await argon2.hash(password);
        }
        const updatedUserProfile = await userProfile.save();
        res.status(201).json({ userProfile: updatedUserProfile });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUserProfile = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    return UserProfile.findByIdAndDelete(userId)
        .then((userProfile) => {
            userProfile
                ? res.status(201).json({ userProfile, message: "deleted" })
                : res.status(404).json({ message: "not found" });
        })
        .catch((error) => res.status(500).json({ error }));
};

export default {
    createUserProfile,
    getUserProfile,
    getAllUserProfiles,
    updateUserProfile,
    deleteUserProfile,
};
