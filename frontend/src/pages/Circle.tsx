import CircleSidebar from "../components/CircleSidebar";
import GroupCard from "../components/GroupCard";

// just here as an example
const groupMembers = [
    {
        alt: "Dan",
        src: "dan.com",
    },
    {
        alt: "Tyler",
        src: "tyler.com",
    },
    {
        alt: "Ao",
        src: "ao.com",
    },
    {
        alt: "Abe",
        src: "abe.com",
    },
    {
        alt: "z",
        src: "z.com",
    },
    {
        alt: "b",
        src: "b.com",
    },
];

const Circle = () => {
    return (
        <div>
            <h1>Circle</h1>
            <CircleSidebar />
            <GroupCard
                title="CST480"
                subtitle={`Members: ${groupMembers.length}`}
                avatars={groupMembers}
                code="1234"
            />

            <GroupCard
                title="Fam"
                subtitle={`Members: ${groupMembers.length}`}
                avatars={groupMembers}
                code="5678"
            />
        </div>
    );
};

export default Circle;
