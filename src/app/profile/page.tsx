"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Sparkles, TrendingUp, Zap, Calendar, Award, Heart, ShoppingBag, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [persona, setPersona] = useState<string | null>(null);
    const [quizGender, setQuizGender] = useState<string | null>(null);
    const [dbName, setDbName] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Fetch full name from users_profile (works for both email + Google signup)
    useEffect(() => {
        if (!user) return;
        const fetchName = async () => {
            const { data } = await supabase
                .from("users_profile")
                .select("full_name")
                .eq("id", user.id)
                .single();
            if (data?.full_name) setDbName(data.full_name);
        };
        fetchName();
    }, [user]);

    // Load persona from Supabase (or fallback to localStorage)
    useEffect(() => {
        const loadPersona = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from("quiz_result")
                    .select("persona_name, gender")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();
                if (!error && data) {
                    setPersona(data.persona_name);
                    setQuizGender(data.gender);
                    return;
                }
            }
            // Fallback: check localStorage
            const localPersona = localStorage.getItem("userPersona");
            const localGender = localStorage.getItem("quizGender");
            if (localPersona) {
                setPersona(localPersona);
                setQuizGender(localGender === "male" ? "Boy" : localGender === "female" ? "Girl" : localGender);
            }
        };
        loadPersona();
    }, [user]);

    // FIX 1 — Loading spinner so it never flashes a redirect
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#d4af7f] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Resolve display name: prefer DB value, fall back to metadata, then email prefix
    const displayName =
        dbName ||
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "You";
    const photoURL = user.user_metadata?.avatar_url || null;
    const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently';
    const memberSince = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white px-4 sm:px-6 lg:px-8 pb-12 pt-10">
            <div className="max-w-7xl mx-auto">

                {/* FIX 3 — Back button so page works even without a fixed navbar above */}
                <button
                    onClick={() => router.push("/")}
                    className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#d4af7f] transition group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                        Hi,{" "}
                        <span className="text-[#d4af7f]">{displayName}</span>{" "}
                        👋
                    </h1>
                    <p className="text-gray-400 text-sm font-mono tracking-widest uppercase mt-2 letter-spacing-wider">
                        {user.email}
                    </p>
                    <p className="text-gray-600 text-xs mt-3 tracking-wide">Welcome to your style dashboard.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => router.push("/outfit")}
                        className="group bg-gradient-to-br from-[#d4af7f] to-[#b8860b] p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(212,175,127,0.3)] transition text-left"
                    >
                        <Sparkles className="w-8 h-8 text-black mb-3" />
                        <h3 className="text-xl font-bold text-black mb-1">AI Stylist</h3>
                        <p className="text-sm text-black/80">Get outfit suggestions</p>
                    </button>

                    <button
                        onClick={() => router.push("/quiz")}
                        className="group bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl hover:border-[#d4af7f] transition text-left"
                    >
                        <Zap className="w-8 h-8 text-[#d4af7f] mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Style Quiz</h3>
                        <p className="text-sm text-gray-400">Discover your vibe</p>
                    </button>

                    <button
                        onClick={() => router.push("/#trend")}
                        className="group bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl hover:border-[#d4af7f] transition text-left"
                    >
                        <TrendingUp className="w-8 h-8 text-[#d4af7f] mb-3" />
                        <h3 className="text-xl font-bold text-white mb-1">Trending</h3>
                        <p className="text-sm text-gray-400">See what's hot</p>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Profile Card */}
                        <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a] shadow-xl">
                            <div className="flex items-center gap-6 mb-6">
                                <Avatar className="h-20 w-20 border-4 border-[#2a2a2a]">
                                    <AvatarImage src={photoURL || ""} alt={displayName} />
                                    <AvatarFallback className="text-2xl bg-[#1a1a1a] text-[#d4af7f]">
                                        {getInitials(displayName)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">{displayName}</h2>
                                    <p className="text-gray-400 text-sm font-mono">{user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#2a2a2a]">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#d4af7f]">0</p>
                                    <p className="text-xs text-gray-500 mt-1">Outfits</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#d4af7f]">0</p>
                                    <p className="text-xs text-gray-500 mt-1">Saved</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-[#d4af7f]">Free</p>
                                    <p className="text-xs text-gray-500 mt-1">Plan</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#d4af7f]" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                                    <div className="w-10 h-10 rounded-full bg-[#d4af7f]/10 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-[#d4af7f]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white font-medium">Account Created</p>
                                        <p className="text-xs text-gray-500">{createdAt}</p>
                                    </div>
                                </div>

                                <div className="h-32 flex items-center justify-center border border-dashed border-[#333] rounded-xl">
                                    <p className="text-gray-500 text-sm">Start creating outfits to see activity</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">

                        {/* Style Persona Card */}
                        <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#d4af7f]" />
                                Your Style Persona
                            </h3>
                            {persona ? (
                                <div className="text-center space-y-3">
                                    <div className="text-4xl">
                                        {persona?.includes("Minimalist") ? "🤍" :
                                            persona?.includes("Edgy") ? "🔥" :
                                                persona?.includes("Romantic") ? "🌸" :
                                                    persona?.includes("Playful") ? "🎨" :
                                                        persona?.includes("Comfort") ? "☁️" :
                                                            persona?.includes("Streetwear") ? "🔥" :
                                                                persona?.includes("Gentleman") ? "💼" :
                                                                    persona?.includes("Casual") ? "🌊" :
                                                                        persona?.includes("Athleisure") ? "⚡" : "✨"}
                                    </div>
                                    <p className="text-xl font-bold text-[#d4af7f]">{persona}</p>
                                    {quizGender && (
                                        <p className="text-sm text-gray-400">{quizGender}</p>
                                    )}
                                    <button
                                        onClick={() => router.push("/outfit")}
                                        className="mt-2 w-full py-2 rounded-lg border border-[#2a2a2a] hover:border-[#d4af7f] transition text-sm text-gray-300"
                                    >
                                        View My Fits
                                    </button>
                                    <button
                                        onClick={() => router.push("/quiz")}
                                        className="w-full py-2 rounded-lg border border-[#2a2a2a] hover:border-[#d4af7f] transition text-sm text-gray-500"
                                    >
                                        Retake Quiz
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center space-y-3">
                                    <p className="text-sm text-gray-500">You haven't taken the quiz yet!</p>
                                    <button
                                        onClick={() => router.push("/quiz")}
                                        className="w-full py-2 rounded-lg bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition text-sm"
                                    >
                                        Take Style Quiz
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Casual</span>
                                    <span className="text-sm text-[#d4af7f]">0%</span>
                                </div>
                                <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] w-0"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Formal</span>
                                    <span className="text-sm text-[#d4af7f]">0%</span>
                                </div>
                                <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] w-0"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-400">Trendy</span>
                                    <span className="text-sm text-[#d4af7f]">0%</span>
                                </div>
                                <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#d4af7f] to-[#b8860b] w-0"></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Create outfits to unlock your style profile
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-[#111] rounded-2xl p-6 border border-[#2a2a2a]">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-[#d4af7f]" />
                                For You
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/quiz")}
                                    className="w-full p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-[#d4af7f] transition text-left"
                                >
                                    <p className="text-sm font-medium text-white mb-1">Take Style Quiz</p>
                                    <p className="text-xs text-gray-500">Discover your unique vibe</p>
                                </button>

                                <button
                                    onClick={() => router.push("/#trend")}
                                    className="w-full p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-[#d4af7f] transition text-left"
                                >
                                    <p className="text-sm font-medium text-white mb-1">Browse Trending</p>
                                    <p className="text-xs text-gray-500">See what's popular now</p>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Sign Out — FIX 2: corrected typo hover:border-red-500/30 */}
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#1a1a1a] flex justify-center">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-[#111] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition font-medium border border-red-500/10 hover:border-red-500/30 text-sm tracking-wide"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>

        </div>
    );
}