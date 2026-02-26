"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, displayName: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Save/update user profile on sign in (catches Google OAuth + email logins)
            if (event === "SIGNED_IN" && session?.user) {
                const u = session.user;
                const fullName =
                    u.user_metadata?.full_name ||
                    u.user_metadata?.display_name ||
                    u.user_metadata?.name ||
                    u.email?.split("@")[0] ||
                    "";

                const { error } = await supabase
                    .from("users_profile")
                    .upsert(
                        {
                            id: u.id,
                            full_name: fullName,
                            email: u.email || "",
                        },
                        { onConflict: "id" }
                    );
                if (error) console.error("Error saving user profile:", error);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const signup = async (email: string, password: string, displayName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                },
            },
        });
        if (error) throw error;

        // Store user data in users_profile table (non-fatal if it fails)
        if (data.user) {
            try {
                const { error: dbError } = await supabase
                    .from("users_profile")
                    .upsert(
                        {
                            id: data.user.id,
                            full_name: displayName,
                            email: data.user.email || "",
                        },
                        { onConflict: "id" }
                    );
                if (dbError) console.error("Error saving user profile:", dbError);
            } catch (profileErr) {
                console.error("Profile creation failed (non-fatal):", profileErr);
            }
        }
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        // Force a hard redirect to clear all state properly
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, login, signup, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
