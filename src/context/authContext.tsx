"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithOtp: (email: string) => Promise<void>;
    verifyLoginOtp: (email: string, token: string) => Promise<void>;
    signup: (email: string, password: string, displayName: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearLocalQuizData = () => {
    localStorage.removeItem("userPersona");
    localStorage.removeItem("quizGender");
    localStorage.removeItem("quizPersona");
    localStorage.removeItem("stylePersona");
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            if (event === "SIGNED_IN" && session?.user) {
                const u = session.user;
                const fullName =
                    u.user_metadata?.full_name ||
                    u.user_metadata?.display_name ||
                    u.user_metadata?.name ||
                    u.email?.split("@")[0] || "";

                const { error } = await supabase
                    .from("users_profile")
                    .upsert(
                        { id: u.id, full_name: fullName, email: u.email || "" },
                        { onConflict: "id" }
                    );
                if (error) console.error("Error saving user profile:", error);
            }

            if (event === "SIGNED_IN") {
                clearLocalQuizData();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // ── Direct password login (no OTP) — kept for internal use ───────────────
    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    // ── Step 1 of login OTP flow: verify password then send OTP ──────────────
    const loginWithOtp = async (email: string) => {
        // Password already verified by login page before calling this
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false },
        });
        if (error) throw error;
    };

    // ── Step 2 of login OTP flow: verify the OTP token ───────────────────────
    const verifyLoginOtp = async (email: string, token: string) => {
        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "email", // matches signInWithOtp
        });
        if (error) throw error;
    };

    const signup = async (email: string, password: string, displayName: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
        });
        if (error) throw error;
        clearLocalQuizData();
        if (data.user) {
            try {
                await supabase.from("users_profile").upsert(
                    { id: data.user.id, full_name: displayName, email: data.user.email || "" },
                    { onConflict: "id" }
                );
            } catch (profileErr) {
                console.error("Profile creation failed (non-fatal):", profileErr);
            }
        }
    };

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
    };

    const logout = async () => {
        clearLocalQuizData();
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{
            user, session, loading,
            login, loginWithOtp, verifyLoginOtp,
            signup, loginWithGoogle, logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};