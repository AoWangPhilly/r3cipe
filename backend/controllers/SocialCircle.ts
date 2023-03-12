import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import SocialCircle, { ISocialCircle } from "../models/SocialCircle.js";

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
    const { id } = req.params;
    return SocialCircle.findById(id)
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
    const { id } = req.params;
    const { name, ownerId, posts, members, profileUrl } = req.body;
    try {
        const socialCircle: ISocialCircle | null =
            await SocialCircle.findByIdAndUpdate(id, {
                name,
                ownerId,
                posts,
                members,
                profileUrl,
            });

        if (!socialCircle) {
            res.status(404).json({ message: "Not found" });
        }
        return res.status(200).json({ socialCircle });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSocialCircle = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    return SocialCircle.findByIdAndDelete(id)
        .then((socialCircle) =>
            socialCircle
                ? res.status(200).json({ socialCircle })
                : res.status(404).json({ message: "Not found" })
        )
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const addMember = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { memberId } = req.body;
    try {
        // check if member already exists
        const existingMember = await SocialCircle.findOne({
            _id: id,
            members: { $in: [memberId] },
        });
        if (existingMember) {
            return res.status(400).json({ message: "Member already exists" });
        }

        const socialCircle: ISocialCircle | null =
            await SocialCircle.findByIdAndUpdate(id, {
                $push: { members: memberId },
            });

        if (!socialCircle) {
            return res.status(404).json({ message: "Not found" });
        }
        return res.status(200).json({ socialCircle });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

const removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const { memberId } = req.body;
    try {
        const socialCircle: ISocialCircle | null =
            await SocialCircle.findByIdAndUpdate(id, {
                $pull: { members: memberId },
            }); // $pull removes the first instance of the value

        if (!socialCircle) {
            res.status(404).json({ message: "Not found" });
        }
        return res.status(200).json({ socialCircle });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const changeOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { ownerId } = req.body;
    try {
        const getSocialCircle = await SocialCircle.findById(id);
        const originalOwnerId = getSocialCircle?.ownerId;

        if (originalOwnerId === ownerId) {
            return res
                .status(400)
                .json({ message: "You are already the owner" });
        }

        const socialCircle: ISocialCircle | null =
            await SocialCircle.findByIdAndUpdate(id, {
                ownerId,
            });

        if (!socialCircle) {
            res.status(404).json({ message: "Not found" });
        }

        await SocialCircle.findByIdAndUpdate(id, {
            $pull: { members: ownerId },
        });

        await SocialCircle.findByIdAndUpdate(id, {
            $push: { members: originalOwnerId },
        });
        return res.status(200).json({ socialCircle });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const addPost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { postId } = req.body;
    try {
        const socialCircle: ISocialCircle | null =
            await SocialCircle.findByIdAndUpdate(id, {
                $push: { posts: postId },
            });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const removePost = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { postId } = req.body;
    try {
        const socialCircle: ISocialCircle | null =
            await SocialCircle.findByIdAndUpdate(id, {
                $pull: { posts: postId },
            });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    //     const { id } = req.params;
    //     try {
    //         const socialCircle: ISocialCircle | null =
    //             await SocialCircle.findById(id);
    //         if (!socialCircle) {
    //             res.status(404).json({ message: "Not found" });
    //         }
    //         const posts = await Post.find({ _id: { $in: socialCircle?.posts } });
    //         return res.status(200).json({ posts });
    //     } catch (error: any) {
    //         res.status(400).json({ message: error.message });
    //     }
};

export default {
    createSocialCircle,
    getSocialCircle,
    getAllSocialCircle,
    updateSocialCircle,
    deleteSocialCircle,
    addMember,
    removeMember,
    changeOwner,
    addPost,
    removePost,
    getPosts,
};
