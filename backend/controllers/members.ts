import { Request, Response } from "express";
import SocialCircle from "../models/SocialCircle.js";
import UserProfile from "../models/UserProfile.js";

/**
 * Get list of members in circle
 */
const getMembersBySocialCircleId = async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    try {
        const socialCircle = await SocialCircle.findById(id);
        if (!socialCircle) {
            return res.status(404).json({ error: "Social circle not found" });
        }
        // Check if user is a member of the circle
        if (!socialCircle.members.includes(user.id)) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const members = await UserProfile.find({
            _id: { $in: socialCircle.members },
        });

        return res.status(200).json({ members: members });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

/**
 * Remove a member from a circle by memberId
 * 4 cases: Owner removes self, Owner removes member, Member removes self, Member removes other member
 */
async function removeMemberFromCircle(req: Request, res: Response) {
    const user = req.user;
    const { id } = req.params;
    const { memberId } = req.body;

    if (!id || !memberId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // check if circle exists & member in circle
    const socialCircle = await SocialCircle.findById(id);
    if (!socialCircle) {
        return res.status(404).json({ error: "Social circle not found" });
    }
    if (!socialCircle.members.includes(memberId)) {
        return res.status(404).json({ error: "Member is not in circle" });
    }

    const circleOwnerId = socialCircle.ownerId.toString();

    // User is the Circle owner
    if (circleOwnerId === user.id) {
        /* Case 1: Owner removes self */
        if (circleOwnerId === memberId) {
            return res
                .status(400)
                .json({ error: "Owner cannot remove self from circle" });
        } else {
            /* Case 2: Owner removes member */
            // if member DNE, nothing happens
            console.log(memberId);
            const result = await SocialCircle.findByIdAndUpdate(
                id,
                {
                    $pull: { members: memberId }, // remove memberId from members[]
                },
                { new: true } // return document after update
            );
            return res
                .status(204)
                .json({ message: "Successfully removed member" });
        }
    }
    // User is a Circle member
    else {
        /* Case 3: Member removes owner */
        if (circleOwnerId === memberId) {
            return res
                .status(401)
                .json({ error: "Member cannot remove owner of circle" });
        } else if (user.id === memberId) {
            /* Case 4: Member removes self */
            // if member DNE, nothing happens
            const result = await SocialCircle.findByIdAndUpdate(
                id,
                {
                    $pull: { members: memberId },
                },
                { new: true }
            );
            return res
                .status(204)
                .json({ message: "Successfully removed self" });
        } else {
            /* Case 5: Member removes other member */
            return res
                .status(401)
                .json({ error: "Member cannot remove other members" });
        }
    }

    return res.json();
}

export default {
    getMembersBySocialCircleId,
    removeMemberFromCircle,
};
