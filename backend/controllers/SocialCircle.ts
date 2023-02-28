import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import SocialCircle from "../models/SocialCircle.js";

const createSocialCircle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { ownerId, name } = req.body;
        const socialCircle = new SocialCircle({
            _id: new mongoose.Types.ObjectId(),
            name,
            ownerId,
        });
        const savedSocialCircle = await socialCircle.save();
        res.status(201).json({ socialCircle: savedSocialCircle });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const getSocialCircle = (req: Request, res: Response, next: NextFunction) => {
    const { socialCircleId } = req.params;
    return SocialCircle.findById(socialCircleId)
        .then((socialCircle) =>
            socialCircle
                ? res.status(200).json({ socialCircle })
                : res.status(404).json({ message: "Not found" })
        )
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const getAllSocialCircle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return SocialCircle.find()
        .then((socialCircle) => res.status(200).json({ socialCircle }))
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const updateSocialCircle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { socialCircleId } = req.params;
        const { name, ownerId, posts, members, profileUrl } = req.body;
        const socialCircle = await SocialCircle.findById(socialCircleId);
        if (socialCircle) {
            socialCircle.name = name;
            socialCircle.ownerId = ownerId;
            socialCircle.posts = posts;
            socialCircle.members = members;
            socialCircle.profileUrl = profileUrl;
            const savedSocialCircle = await socialCircle.save();
            res.status(201).json({ socialCircle: savedSocialCircle });
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSocialCircle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { socialCircleId } = req.params;
    return SocialCircle.findByIdAndDelete(socialCircleId)
        .then((socialCircle) =>
            socialCircle
                ? res.status(200).json({ socialCircle })
                : res.status(404).json({ message: "Not found" })
        )
        .catch((error) => {
            res.status(500).json({ error });
        });
};

export default {
    createSocialCircle,
    getSocialCircle,
    getAllSocialCircle,
    updateSocialCircle,
    deleteSocialCircle,
};
