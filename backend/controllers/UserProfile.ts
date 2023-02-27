import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import UserProfile, {
    createUserProfileSchema,
    updateUserProfileSchema,
} from "../models/UserProfile.js";

const createUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createUserProfileSchema.parse(req.body);
        const { name, email, password, profileUrl } = validatedData;
        const userProfile = new UserProfile({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            password,
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
        const userProfileId = req.params.userProfileId;
        const updatedUserProfile = await UserProfile.findByIdAndUpdate(
            userProfileId,
            validatedData,
            { new: true }
        );
        if (updatedUserProfile) {
            res.status(200).json({ userProfile: updatedUserProfile });
        } else {
            res.status(404).json({ message: "User profile not found" });
        }
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
