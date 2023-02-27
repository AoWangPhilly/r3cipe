import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import UserProfile from "../models/UserProfile.js";

const createUserProfile = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, profileUrl } = req.body;
    const userProfile = new UserProfile({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password,
        profileUrl,
    });
    return userProfile
        .save()
        .then((userProfile) => {
            res.status(201).json({ userProfile });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
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

const updateUserProfile = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    return UserProfile.findByIdAndUpdate(userId, req.body, { new: true })
        .then((userProfile) => {
            if (userProfile) {
                return res.status(201).json({ userProfile });
            } else {
                return res.status(404).json({ message: "not found" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
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
