const { createContext, useContext } = require('react')

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const storeTokenINLS = (serverToken) => {
        console.log("Storing token in localStorage:", serverToken);
        return localStorage.setItem("Token", serverToken);
    };

    return (
        <AuthContext.Provider value={{ storeTokenINLS }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);

    if (!authContextValue) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return authContextValue;
};