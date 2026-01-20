import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/me', { withCredentials: true });
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setTimeout(() => { }, 2000);
        await axios.post(
            "/api/auth/login",
            { email, password },
            { withCredentials: true }
        )
        const res = await axios.get(
            "/api/auth/me",
            { withCredentials: true }
        )
        setUser(res.data);
    };

    const register = async (username, email, password) => {
        await axios.post(
            "/api/auth/register",
            { username, email, password },
            { withCredentials: true }
        )
        const res = await axios.get(
            "/api/auth/me",
            { withCredentials: true }
        )
        setUser(res.data);
    }

    const logout = async () => {
        await axios.post(
            "/api/auth/logout",
            {},
            { withCredentials: true }
        );
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);