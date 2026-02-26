"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserDropdownProps {
    user: User;
    logout: () => Promise<void>;
}

export default function UserDropdown({ user, logout }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    // Get display name from user metadata
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || "User";
    const photoURL = user.user_metadata?.avatar_url || null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1a1a1a] hover:bg-[#252525] transition border border-[#2a2a2a] hover:border-[#d4af7f]"
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage src={photoURL || ""} alt={displayName} />
                    <AvatarFallback className="text-sm bg-[#0a0a0a] text-[#d4af7f]">
                        {getInitials(displayName)}
                    </AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium hidden md:block">{displayName}</span>

                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0a0a0a] border border-[#2a2a2a] shadow-2xl overflow-hidden z-50"
                    >
                        {/* USER INFO */}
                        <div className="p-4 border-b border-[#1f1f1f] bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar className="h-12 w-12 border-2 border-[#2a2a2a]">
                                    <AvatarImage src={photoURL || ""} alt={displayName} />
                                    <AvatarFallback className="text-lg bg-[#1a1a1a] text-[#d4af7f]">
                                        {getInitials(displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">{displayName}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* SECTIONS */}
                        <div className="p-2 space-y-1 bg-[#0a0a0a]">

                            <Link
                                href="/profile"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                            >
                                <UserIcon className="w-4 h-4 text-gray-500 group-hover:text-[#d4af7f] transition-colors" />
                                <span>My Profile</span>
                            </Link>

                            <div className="my-1 h-px bg-[#1f1f1f] mx-2" />

                            <button
                                onClick={async () => {
                                    await logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all group"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
