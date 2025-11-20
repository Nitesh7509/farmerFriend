import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { backendurl } from "../App";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    // Verify token on mount and restore user session
    useEffect(() => {
        const verifyAndRestoreSession = async () => {
            const storedToken = localStorage.getItem("token");
            
            if (storedToken) {
                try {
                    const response = await axios.get(`${backendurl}/api/user/verify-token`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    
                    if (response.data.valid && response.data.user) {
                        setUser(response.data.user);
                        setRole(response.data.user.role);
                        setToken(storedToken);
                    } else {
                        // Invalid token, clear storage
                        localStorage.removeItem("token");
                        setToken(null);
                    }
                } catch (error) {
                    console.error("Token verification failed:", error);
                    localStorage.removeItem("token");
                    setToken(null);
                }
            }
            setLoading(false);
        };

        verifyAndRestoreSession();
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const login = (userData, userRole, authToken) => {
        setUser(userData);
        setRole(userRole);
        setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

