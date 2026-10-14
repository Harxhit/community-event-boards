"use client";

import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

interface User {
    userId: string;
    name: string;
    email: string;
    username: string;
    role: "User" | "Admin";
    bookMarkedEvents: string[]
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
}

let sessionRequest: Promise<User | null> | null = null;

function fetchSession(): Promise<User | null> {
    if (!sessionRequest) {
        sessionRequest = axios
            .get("/api/auth/me")
            .then((response) => response.data.user as User)
            .catch(() => null)
            .finally(() => {
                sessionRequest = null;
            });
    }

    return sessionRequest;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        setLoading(true)
        
        const sessionUser = await fetchSession()
        setUser(sessionUser)
        setLoading(false)
    };
 
    useEffect(() => {
        void refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}