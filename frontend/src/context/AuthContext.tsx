import axios from "axios";
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
    // let response = await axios.get("/api/checkLogin", {
    //     withCredentials: true,
    // });
    // return response.status === 200;
    //TODO change this to API call
    return true;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const [isAuth, setIsAuth] = useState(false);

    React.useEffect(() => {
        checkAuth().then((result) => {
            setIsAuth(result);
        });
    }, []);

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
