import { Request, Response } from "express";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import SocialCircle from "../models/SocialCircle.js";
import UserProfile from "../models/UserProfile.js";

/**
 * Get list of members in circle
 */
const getMembersBySocialCircleId = async (req: Request, res: Response) => {
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();
    if (!tokenStorage[token]) {
        return res.status(401).json({ message: "Invalid token" });
    }
    const userId = tokenStorage[token].id;
    const { id } = req.params;
    try {
        const socialCircle = await SocialCircle.findById(id);
        if (!socialCircle) {
            return res.status(404).json({ message: "Social circle not found" });
        }
        if (!socialCircle.members.includes(userId)) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const members = await UserProfile.find({
            _id: { $in: socialCircle.members },
        });

        return res.status(200).json({ members: members });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export default {
    getMembersBySocialCircleId,
};
