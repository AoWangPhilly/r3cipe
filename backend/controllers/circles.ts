import { Request, Response } from "express";
import SocialCircle from "../models/SocialCircle.js";
import { UserProfileId } from "../models/UserProfile.js";
import {
    constructPostObjectList,
    filterMemberContent,
} from "../helpers/circles.js";

/**
 * Return circle by mongo id
 */
const getCircleById = async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    try {
        const socialCircle = await SocialCircle.findById(id)
            .populate<{ ownerId: UserProfileId }>("ownerId")
            .populate<{ members: UserProfileId[] }>("members");

        // console.log(socialCircle);
        if (!socialCircle) {
            return res.status(404).json({ error: "Social circle not found" });
        }
        // check if socialCircle.members contains userId
        let memberIdList = socialCircle.members.map((member) => member._id);
        for (let id of memberIdList) {
            if (id.toString() === user.id) {
                // Filter content sent to client
                const filtOwner = filterMemberContent([
                    socialCircle.ownerId,
                ])[0];
                const filtMembers = filterMemberContent(socialCircle.members);
                const postList = constructPostObjectList(socialCircle.posts);
                return res.status(200).json({
                    socialCircle: {
                        _id: socialCircle._id,
                        description: socialCircle.description,
                        name: socialCircle.name,
                        profileUrl: socialCircle.profileUrl,
                        owner: filtOwner,
                        members: filtMembers,
                        posts: postList,
                    },
                });
            }
        }
        return res
            .status(401)
            .json({ error: "You're not a member of this circle" });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * TODO: check if exists based on id, not name
 * Create social circle with User as the owner
 */
const createSocialCircle = async (req: Request, res: Response) => {
    const user = req.user;

    const { name } = req.body;
    const { description } = req.body;
    //i added imageUrl to the body (just a string)
    if (!name || !description) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // check if social circle already exists
        const existingSocialCircle = await SocialCircle.findOne({
            name,
        });
        if (existingSocialCircle) {
            return res
                .status(400)
                .json({ message: "Social circle already exists" });
        }

        const socialCircle = new SocialCircle({
            name: name,
            description: description,
            profileUrl: req.body.imageUrl,
            ownerId: user.id,
            members: [user.id],
        });
        const savedSocialCircle = await socialCircle.save();
        res.status(201).json({ socialCircle: savedSocialCircle });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Return the social circles that the User is in
 */
const getSocialCirclesByUserId = async (req: Request, res: Response) => {
    const user = req.user;
    try {
        const socialCircles = await SocialCircle.find({
            // select documents that contain userId in members array
            members: { $in: [user.id] },
        });
        res.status(200).json({ socialCircles });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Add User to a circle based on the circle's mongo id
 * Gets id from req.body
 */
const joinCircleByCode = async (req: Request, res: Response) => {
    console.log("here1");

    const user = req.user;
    const { id } = req.body;
    try {
        const socialCircle = await SocialCircle.findById(id);
        if (!socialCircle) {
            return res.status(404).json({ error: "Social circle not found" });
        }
        if (socialCircle.members.includes(user.id)) {
            return res
                .status(400)
                .json({ error: "You are already a member of this circle" });
        }
        socialCircle.members.push(user.id);
        const savedSocialCircle = await socialCircle.save();
        res.status(200).json({ socialCircle: savedSocialCircle });
    } catch (error: any) {
        /* one possible error: invalid mongo id that could not be cast */
        // console.log(error.message);
        res.status(404).json({ error: "Social circle not found" });
        // res.status(400).json({ error: "Could not join circle" });
    }
};

/**
 * Add User to a circle based on the circle's mongo id
 * Gets id from req.params
 */
const addUserToSocialCircle = async (req: Request, res: Response) => {
    console.log("here2");

    const user = req.user;
    const { id } = req.params;
    try {
        const socialCircle = await SocialCircle.findById(id);
        if (!socialCircle) {
            return res.status(404).json({ error: "Social circle not found" });
        }
        if (socialCircle.members.includes(user.id)) {
            return res
                .status(400)
                .json({ error: "You are already a member of this circle" });
        }
        socialCircle.members.push(user.id);
        const savedSocialCircle = await socialCircle.save();
        return res.status(200).json({ socialCircle: savedSocialCircle });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Nuke the social circle by mongo id; need to be owner of circle
 */
const deleteSocialCircle = async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    // check if circle exists
    const socialCircle = await SocialCircle.findById(id);
    if (!socialCircle) {
        return res.status(404).json({ error: "Social circle not found" });
    }

    // check if user is owner of social circle
    if (socialCircle.ownerId.toString() !== user.id) {
        return res.status(401).json({ error: "Unauthorized to delete circle" });
    }

    return SocialCircle.findByIdAndDelete(id)
        .then((socialCircle) => res.status(200).json({ socialCircle }))
        .catch((error) => {
            res.status(500).json({ error });
        });
};

export default {
    createSocialCircle,
    getSocialCirclesByUserId,
    joinCircleByCode,
    getCircleById,
    addUserToSocialCircle,
    deleteSocialCircle,
};
