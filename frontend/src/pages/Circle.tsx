import GroupCard from "../components/GroupCard";

// just here as an example
const groupMembers = [
    {
        alt: "Dan",
        src: "https://dan.com",
    },
    {
        alt: "Tyler",
        src: "https://tyler.com",
    },
    {
        alt: "Ao",
        src: "https://ao.com",
    },
    {
        alt: "Abe",
        src: "https://abe.com",
    },
];
export const Circle = () => {
    return (
        <div>
            <h1>Circle</h1>
            <GroupCard
                title="CST480"
                subtitle="Members: 4"
                avatars={groupMembers}
            />

            <GroupCard
                title="Fam"
                subtitle="Members: 4"
                avatars={groupMembers}
            />
        </div>
    );
};

export default Circle;
