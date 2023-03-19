import React, { createContext, useState } from "react";

interface AuthContextProps {
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuth: false,
    setIsAuth: () => {},
    name: "",
    setName: () => {},
    userId: "",
    setUserId: () => {},
});

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const checkAuth = async () => {
    let response = await fetch("/api/auth/checkLogin", {
        method: "GET",
        credentials: "include",
    });
    return response.json();
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        checkAuth().then((data) => {
            // console.log(data);
            if (data.message === "Authenticated") {
                setIsAuth(true);
                setName(data.user.name);
                setUserId(data.user.id);
            } else {
                setIsAuth(false);
            }
            setLoading(false);
        });
    }, []);



    if (loading) {
        return <>...</>;
    }

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                setIsAuth,
                name,
                setName,
                userId,
                setUserId,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
