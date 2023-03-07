import React, { createContext, useState } from "react";

interface AuthContextProps {
    isAuth: boolean;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps>({
    isAuth: false,
    setIsAuth: () => {},
});

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const checkAuth = async () => {
    let response = await fetch("/api/auth/checkLogin", {
        method: "GET",
        credentials: "include",
    });
    return response.status === 200;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        checkAuth().then((result) => {
            setIsAuth(result);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
