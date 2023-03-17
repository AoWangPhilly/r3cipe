import { Request, Response } from "express";
import SocialCircle from "../models/SocialCircle.js";
import { PostList, PostType } from "../types/types.js";
import { constructPostObject } from "../helpers/circles.js";

/**
 * Add a User-created Post to circle by id
 */
async function addPostToCircle(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    const { recipeId, message } = req.body;
    const { title, image } = req.body;

    if (!id || !recipeId || !message || !title) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const socialCircle = await SocialCircle.findById(id);
        if (!socialCircle) {
            return res.status(404).json({ error: "Social circle not found" });
        }
        // Check if user is a member of the circle
        if (!socialCircle.members.includes(user.id)) {
            return res.status(401).json({
                error: "Unauthorized: only members can post to circle",
            });
        }

        const fullPost: PostType = constructPostObject({
            message,
            recipeId,
            title,
            image,
            user,
        });

        const circlePost = await SocialCircle.findByIdAndUpdate(
            id,
            {
                $push: { posts: fullPost },
            },
            { runValidators: true, new: true }
        );
        // console.log(circlePost);

        return res.status(200).json({ post: fullPost });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

/**
 * Return all the posts in a circle by id
 */
async function getPostsByCircleId(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const socialCircle = await SocialCircle.findById(id);
        if (!socialCircle) {
            return res.status(404).json({ error: "Social circle not found" });
        }
        // Check if user is a member of the circle
        if (!socialCircle.members.includes(user.id)) {
            return res.status(401).json({
                error: "Unauthorized: only members can see circle posts",
            });
        }

        let postObjs: PostList[] = [];
        for (let post of socialCircle.posts) {
            const postObj: PostList = {
                userInfo: post.message.userInfo,
                message: post.message.message,
                recipeThumbnail: post.recipeThumbnail,
                timestamp: post.message.timestamp,
            };
            postObjs.push(postObj);
        }
        res.json({ posts: postObjs });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export default {
    addPostToCircle,
    getPostsByCircleId,
};
