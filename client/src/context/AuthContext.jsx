import { createContext, useState, useEffect, useContext, Children } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if(savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (useData, token) => {
        localStorage.setItem('user', JSON.stringify(useData));
        localStorage.setItem('token', token);
        setUser(useData);
    }

    const updateUser = (updatedData) => {
        setUser((prev) => {
            const nextUser = { ...prev, ...updatedData };
            localStorage.setItem('user', JSON.stringify(nextUser));
            return nextUser;
        });
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

