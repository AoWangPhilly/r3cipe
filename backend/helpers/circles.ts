import { MessageType, RecipeThumbnailType, UserInfo } from "../types/types.js";
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

export function constructPostObject({
    message,
    recipeId,
    title,
    image,
    user,
}: {
    message: string;
    recipeId: string;
    title: string;
    image: string;
    user: UserInfo;
}) {
    const messageBlock: MessageType = {
        // _id: socialCircle.id,
        userInfo: {
            name: user.name,
            userId: user.id,
            userImage: user.profileUrl,
        },
        message: message,
        timestamp: new Date(),
    };

    const recipeThumbnailBlock: RecipeThumbnailType = {
        title: title,
        image: image,
        id: recipeId,
    };

    return {
        message: messageBlock,
        recipeThumbnail: recipeThumbnailBlock,
    };
}
