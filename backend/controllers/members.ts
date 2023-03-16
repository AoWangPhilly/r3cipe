import { Request, Response } from "express";
import { getTokenStorage } from "../helpers/tokenStorage.js";
import SocialCircle from "../models/SocialCircle.js";
import UserProfile from "../models/UserProfile.js";

// TODO: remove dead code checking if token exists (bc authorize middleware)

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

/**
 * Remove a member from a circle by memberId
 * 4 cases: Owner removes self, Owner removes member, Member removes self, Member removes other member
 */
function removeMemberFromCircle(req: Request, res: Response) {
    const { token } = req.cookies;
    const tokenStorage = getTokenStorage();
    if (!tokenStorage[token]) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const userId = tokenStorage[token].id;
    const { id, memberId } = req.params;
    SocialCircle.findById(id)
        .then((socialCircle) => {
            if (!socialCircle) {
                return res
                    .status(404)
                    .json({ message: "Social circle not found" });
            }
            if (socialCircle.ownerId.toString() != userId) {
                return res.status(401).json({ message: "Not authorized" });
            }
            if (socialCircle.ownerId.toString() == memberId) {
                if (socialCircle.members.length > 1) {
                    return res
                        .status(400)
                        .json({ message: "Cannot remove owner of circle" });
                } else {
                    SocialCircle.findByIdAndDelete(id)
                        .then(() => {
                            return res
                                .status(200)
                                .json({ message: "Social circle deleted" });
                        })
                        .catch((error: any) => {
                            return res
                                .status(400)
                                .json({ message: error.message });
                        });
                }
            } else {
                SocialCircle.findByIdAndUpdate(id, {
                    $pull: { members: memberId },
                })
                    .then(() => {
                        return res
                            .status(200)
                            .json({ message: "Member removed from circle" });
                    })
                    .catch((error: any) => {
                        return res.status(400).json({ message: error.message });
                    });
            }
        })
        .catch((error: any) => {
            return res.status(400).json({ message: error.message });
        });
}

export default {
    getMembersBySocialCircleId,
    removeMemberFromCircle,
};
