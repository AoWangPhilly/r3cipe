import UserProfile from "../models/UserProfile.js";

export async function findUserByEmail(providedEmail: string) {
    try {
        const userProfile = await UserProfile.findOne({ email: providedEmail });
        return userProfile
            ? { userProfile }
            : { errors: ["404", "Email not found"] };
    } catch (error) {
        console.log(error);
        return { errors: ["500", "Internal server error"] };
    }
}
