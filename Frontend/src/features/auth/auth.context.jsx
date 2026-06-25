import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ authLoading, setAuthLoading ] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await getMe()
                if (data && data.user) {
                    const localEdits = localStorage.getItem(`profile_edits_${data.user.username}`);
                    if (localEdits) {
                        setUser({ ...data.user, ...JSON.parse(localEdits) });
                    } else {
                        setUser(data.user);
                    }
                }
            } catch (err) {
                console.log("Session recovery failed or no active session:", err.message)
            } finally {
                setAuthLoading(false)
            }
        }
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, authLoading }} >
            {children}
        </AuthContext.Provider>
    )
}