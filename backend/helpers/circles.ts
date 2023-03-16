import { UserProfileId } from "../models/UserProfile.js";

/**
 * Filter passwords & timestamps from list of members
 */
export function filterMemberContent(members: UserProfileId[]) {
    return members.map((member) => {
        return {
            _id: member._id,
            name: member.name,
            profileUrl: member.profileUrl,
        };
    });
}
