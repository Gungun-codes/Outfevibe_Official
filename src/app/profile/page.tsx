"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSavedOutfits } from "@/app/hooks/useSavedOutfits";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut, Sparkles, Heart, Bookmark,
  Flame, Camera, ExternalLink, ChevronRight,
  Zap, LayoutDashboard, Star,
} from "lucide-react";

// ── Persona trait map ──
const PERSONA_TRAITS: Record<string, {
  emoji: string;
  traits: string[];
  colors: string[];
  vibe: string;
}> = {
  Minimalist:  { emoji: "🤍", traits: ["Clean lines", "Neutral tones", "Less is more", "Timeless pieces"], colors: ["White", "Beige", "Grey", "Black"], vibe: "Quiet luxury with intention" },
  Edgy:        { emoji: "🔥", traits: ["Bold statements", "Dark palette", "Leather & chains", "Rule-breaking"], colors: ["Black", "Red", "Charcoal", "Metallics"], vibe: "Fierce, fearless, unapologetic" },
  Romantic:    { emoji: "🌸", traits: ["Soft fabrics", "Floral prints", "Feminine silhouettes", "Pastel tones"], colors: ["Blush", "Lavender", "Cream", "Dusty rose"], vibe: "Dreamy and effortlessly soft" },
  Playful:     { emoji: "🎨", traits: ["Bold colours", "Fun prints", "Mix & match", "Statement pieces"], colors: ["Yellow", "Coral", "Electric blue", "Hot pink"], vibe: "Joyful, expressive, always surprising" },
  Comfort:     { emoji: "☁️", traits: ["Cosy fabrics", "Relaxed fits", "Effortless styling", "Everyday wear"], colors: ["Oatmeal", "Sage", "Dusty blue", "Warm brown"], vibe: "Laid-back but always put together" },
  Streetwear:  { emoji: "🏙️", traits: ["Oversized fits", "Sneaker culture", "Graphic tees", "Urban edge"], colors: ["White", "Black", "Neon accents", "Camo"], vibe: "Street-smart, culture-driven" },
  Gentleman:   { emoji: "💼", traits: ["Tailored fits", "Classic pieces", "Smart casual", "Polished details"], colors: ["Navy", "Charcoal", "White", "Camel"], vibe: "Refined masculinity with class" },
  Casual:      { emoji: "🌊", traits: ["Easy outfits", "Versatile basics", "Comfortable cuts", "Everyday style"], colors: ["Denim blue", "White", "Olive", "Tan"], vibe: "Relaxed confidence for every day" },
  Athleisure:  { emoji: "⚡", traits: ["Performance fabrics", "Sporty silhouettes", "Functional style", "Active lifestyle"], colors: ["Black", "Grey", "Electric blue", "Neon green"], vibe: "Always ready to move and look good doing it" },
};

const BADGE_META: Record<string, { emoji: string; label: string; desc: string }> = {
  "3_day_streak":          { emoji: "🔥", label: "3-Day Streak",          desc: "Visited 3 days in a row" },
  "week_warrior":          { emoji: "⚡", label: "Week Warrior",           desc: "7 consecutive days" },
  "fortnight_fashionista": { emoji: "💎", label: "Fortnight Fashionista", desc: "14 consecutive days" },
  "style_legend":          { emoji: "👑", label: "Style Legend",           desc: "30 consecutive days" },
};

const SKIN_COLORS: Record<string, string> = {
  Fair:     "#f5d0c0",
  Wheatish: "#e8b98a",
  Dusky:    "#c68642",
  Tan:      "#a0522d",
  Deep:     "#4a2c0a",
};

const SHAPE_ICONS: Record<string, string> = {
  Hourglass:           "⏳",
  Rectangle:           "▬",
  Pear:                "🍐",
  Apple:               "🍎",
  "Inverted Triangle": "▽",
};

function getPersonaData(persona: string | null) {
  if (!persona) return null;
  const key = Object.keys(PERSONA_TRAITS).find((k) => persona.includes(k));
  return key ? PERSONA_TRAITS[key] : null;
}

interface UserProfileData {
  full_name:            string | null;
  body_shape:           string | null;
  skin_tone:            string | null;
  profile_image:        string | null;
  streak_count:         number;
  longest_streak:       number;
  badges:               string[];
  last_streak_date:     string | null;
  streak_reward_active: boolean;
}

// ── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({ value, label, accent = false }: { value: number | string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-4 rounded-2xl bg-[#0f0f0f] border border-[#1e1e1e]">
      <span className={`text-2xl font-black tracking-tight ${accent ? "text-[#d4af7f]" : "text-white"}`}>{value}</span>
      <span className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ProfileDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [persona,    setPersona]    = useState<string | null>(null);
  const [quizGender, setQuizGender] = useState<string | null>(null);
  const [activeTab,  setActiveTab]  = useState<"liked" | "saved">("liked");
  const [profile,    setProfile]    = useState<UserProfileData>({
    full_name:            null,
    body_shape:           null,
    skin_tone:            null,
    profile_image:        null,
    streak_count:         0,
    longest_streak:       0,
    badges:               [],
    last_streak_date:     null,
    streak_reward_active: false,
  });

  const { likedOutfits, savedOutfits, loading: outfitsLoading } = useSavedOutfits(user?.id);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("users_profile")
      .select("full_name, body_shape, skin_tone, profile_image, streak_count, longest_streak, badges, last_streak_date, streak_reward_active")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile({
          full_name:            data.full_name            ?? null,
          body_shape:           data.body_shape           ?? null,
          skin_tone:            data.skin_tone            ?? null,
          profile_image:        data.profile_image        ?? null,
          streak_count:         data.streak_count         ?? 0,
          longest_streak:       data.longest_streak       ?? 0,
          badges:               data.badges               ?? [],
          last_streak_date:     data.last_streak_date     ?? null,
          streak_reward_active: data.streak_reward_active ?? false,
        });
      });
  }, [user]);

  useEffect(() => {
    const load = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("quiz_result")
          .select("persona_name, gender")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (!error && data) { setPersona(data.persona_name); setQuizGender(data.gender); return; }
      }
      const lp = localStorage.getItem("userPersona");
      const lg = localStorage.getItem("quizGender");
      if (lp) { setPersona(lp); setQuizGender(lg === "male" ? "Him" : lg === "female" ? "Her" : lg); }
    };
    load();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-7 h-7 rounded-full border-2 border-[#d4af7f] border-t-transparent animate-spin" />
    </div>
  );
  if (!user) return null;

  const getInitials = (name: string | null | undefined) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  const displayName =
    profile.full_name || user.user_metadata?.display_name || user.user_metadata?.full_name ||
    user.user_metadata?.name || user.email?.split("@")[0] || "You";

  const photoURL = user.user_metadata?.avatar_url || null;
  const personaData = getPersonaData(persona);
  const activeOutfits = activeTab === "liked" ? likedOutfits : savedOutfits;
  const today = new Date().toISOString().split("T")[0];
  const doneToday = profile.last_streak_date === today;

  // streak progress
  const milestones = [3, 7, 14, 30];
  const nextMilestone = milestones.find((m) => profile.streak_count < m);
  const prevMilestone = nextMilestone ? (milestones[milestones.indexOf(nextMilestone) - 1] ?? 0) : 30;
  const streakProgress = nextMilestone
    ? ((profile.streak_count - prevMilestone) / (nextMilestone - prevMilestone)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-md border-b border-[#161616] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LayoutDashboard className="w-4 h-4 text-[#d4af7f]" />
          <span className="text-sm font-semibold tracking-wide text-white">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          {profile.streak_count > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-full border border-orange-400/15">
              <Flame className="w-3 h-3" /> {profile.streak_count} day streak
            </span>
          )}
          <button onClick={() => router.push("/")} className="text-xs text-neutral-500 hover:text-[#d4af7f] transition px-3 py-1.5 rounded-lg hover:bg-[#d4af7f]/5">
            ← Home
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── IDENTITY CARD ── */}
        <div className="relative rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden">
          {/* subtle gradient bar at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af7f]/40 to-transparent" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-18 w-18 sm:h-20 sm:w-20 border-2 border-[#252525] flex-shrink-0" style={{ height: 76, width: 76 }}>
                <AvatarImage src={photoURL || ""} alt={displayName} />
                <AvatarFallback className="text-xl bg-[#151515] text-[#d4af7f] font-bold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight truncate">
                  {displayName}
                </h1>
                <p className="text-sm text-neutral-500 font-mono mt-0.5 truncate">{user.email}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d4af7f]/10 text-[#d4af7f] border border-[#d4af7f]/20">
                    Free Plan
                  </span>
                  {doneToday && (
                    <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/15">
                      ✓ Visited today
                    </span>
                  )}
                  {personaData && (
                    <span className="text-xs font-medium text-neutral-400 bg-[#161616] px-2.5 py-1 rounded-full border border-[#222]">
                      {personaData.emoji} {persona}
                    </span>
                  )}
                </div>
              </div>


            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#181818]">
              <StatPill value={likedOutfits.length} label="Liked" />
              <StatPill value={savedOutfits.length} label="Saved" />
              <StatPill value={profile.streak_count} label="🔥 Streak" accent />
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Streak + Outfits ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Streak card */}
            <div className="rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#d4af7f]" /> Streak
                </h2>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Longest</p>
                  <p className="text-sm font-bold text-[#d4af7f]">{profile.longest_streak} days</p>
                </div>
              </div>

              {/* Progress */}
              {nextMilestone ? (
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-neutral-500 mb-2">
                    <span>Next badge — {nextMilestone} days</span>
                    <span className="text-[#d4af7f] font-semibold">{profile.streak_count} / {nextMilestone}</span>
                  </div>
                  <div className="h-1.5 bg-[#181818] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${streakProgress}%`, background: "linear-gradient(90deg,#d4af7f,#b8860b)" }} />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#d4af7f] mb-5">👑 All milestones unlocked!</p>
              )}

              {/* Badges */}
              {profile.badges && profile.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge) => {
                    const meta = BADGE_META[badge];
                    if (!meta) return null;
                    return (
                      <div key={badge} title={meta.desc}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af7f]/25 bg-[#d4af7f]/5 text-xs font-semibold text-[#d4af7f]">
                        <span>{meta.emoji}</span><span>{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-4 border border-dashed border-[#1e1e1e] rounded-xl text-center">
                  <p className="text-xs text-neutral-600">Visit 3 days in a row to earn your first badge 🔥</p>
                </div>
              )}
            </div>

            {/* Liked / Saved tabs */}
            <div className="rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-1.5 bg-[#0a0a0a] rounded-xl p-1 border border-[#181818]">
                  <button onClick={() => setActiveTab("liked")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === "liked" ? "bg-red-500/15 text-red-400" : "text-neutral-500 hover:text-neutral-300"}`}>
                    <Heart className="w-3.5 h-3.5" fill={activeTab === "liked" ? "currentColor" : "none"} />
                    Liked ({likedOutfits.length})
                  </button>
                  <button onClick={() => setActiveTab("saved")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTab === "saved" ? "bg-[#d4af7f]/12 text-[#d4af7f]" : "text-neutral-500 hover:text-neutral-300"}`}>
                    <Bookmark className="w-3.5 h-3.5" fill={activeTab === "saved" ? "currentColor" : "none"} />
                    Saved ({savedOutfits.length})
                  </button>
                </div>
                <button onClick={() => router.push("/#trending")}
                  className="text-xs text-neutral-500 hover:text-[#d4af7f] transition flex items-center gap-1">
                  Browse <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {outfitsLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-[#d4af7f] border-t-transparent animate-spin" />
                </div>
              ) : activeOutfits.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center border border-dashed border-[#1e1e1e] rounded-xl gap-2.5">
                  {activeTab === "liked"
                    ? <Heart className="w-7 h-7 text-neutral-700" />
                    : <Bookmark className="w-7 h-7 text-neutral-700" />}
                  <p className="text-sm text-neutral-600">No {activeTab} outfits yet</p>
                  <button onClick={() => router.push("/#trending")}
                    className="text-xs text-[#d4af7f] hover:underline">Explore trending →</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeOutfits.map((outfit, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-[#1e1e1e] bg-[#0a0a0a] group">
                      <div className="relative h-36 overflow-hidden">
                        <img src={outfit.outfit_image} alt={outfit.outfit_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${activeTab === "liked" ? "bg-red-500" : "bg-[#d4af7f]"}`}>
                          {activeTab === "liked"
                            ? <Heart className="w-2.5 h-2.5 text-white" fill="currentColor" />
                            : <Bookmark className="w-2.5 h-2.5 text-black" fill="currentColor" />}
                        </div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs text-white line-clamp-1 mb-1.5 font-medium">{outfit.outfit_title}</p>
                        {outfit.outfit_link && (
                          <a href={outfit.outfit_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-pink-500 hover:underline">
                            Shop <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Persona + Body Analysis ── */}
          <div className="space-y-6">

            {/* Persona card */}
            <div className={`rounded-2xl p-6 border ${persona ? "bg-gradient-to-b from-[#110e05] to-[#0d0d0d] border-[#d4af7f]/15" : "bg-[#0d0d0d] border-[#1a1a1a]"}`}>
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af7f]" /> Style Persona
              </h2>

              {persona && personaData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#d4af7f]/10 border border-[#d4af7f]/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {personaData.emoji}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#d4af7f]">{persona}</p>
                      {quizGender && <p className="text-xs text-neutral-500">Style for {quizGender}</p>}
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 italic border-l-2 border-[#d4af7f]/30 pl-3">
                    "{personaData.vibe}"
                  </p>

                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-2">Key traits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {personaData.traits.map((t, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-[#d4af7f]/8 border border-[#d4af7f]/15 text-[#d4af7f]">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono mb-2">Your palette</p>
                    <div className="flex flex-wrap gap-1.5">
                      {personaData.colors.map((c, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-[#141414] border border-[#222] text-neutral-400">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={() => router.push("/outfit")}
                      className="py-2.5 rounded-xl bg-[#d4af7f] text-black text-xs font-bold hover:bg-[#e5cca5] transition">
                      My Fits
                    </button>
                    <button onClick={() => router.push("/quiz")}
                      className="py-2.5 rounded-xl border border-[#252525] text-xs font-medium text-neutral-400 hover:text-white hover:border-[#333] transition">
                      Retake Quiz
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#161616] flex items-center justify-center text-2xl">🎯</div>
                  <p className="text-xs text-neutral-500">Take the quiz to discover your style identity</p>
                  <button onClick={() => router.push("/quiz")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af7f] to-[#b8860b] text-black font-bold text-sm hover:opacity-90 transition">
                    Take Style Quiz →
                  </button>
                </div>
              )}
            </div>

            {/* Body Analysis card */}
            <div className="rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#d4af7f]" /> Style Analysis
              </h2>

              <div className="flex gap-4">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {profile.profile_image ? (
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-[#d4af7f]/25">
                      <img src={profile.profile_image} alt="Analysis photo"
                        className="w-full h-full object-cover object-top" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1">
                        <p className="text-[9px] text-[#d4af7f] text-center font-medium">Your photo</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-28 rounded-xl border border-dashed border-[#252525] flex flex-col items-center justify-center gap-1 bg-[#0a0a0a]">
                      <Camera className="w-5 h-5 text-neutral-700" />
                      <p className="text-[9px] text-neutral-700 text-center px-1">No photo</p>
                    </div>
                  )}
                </div>

                {/* Body shape + skin tone */}
                <div className="flex-1 space-y-2.5">
                  <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1e1e1e]">
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest font-mono mb-1.5">Body Shape</p>
                    {profile.body_shape ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{SHAPE_ICONS[profile.body_shape] ?? "✨"}</span>
                        <span className="text-sm font-bold text-white">{profile.body_shape}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-600">Not analysed</p>
                    )}
                  </div>

                  <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1e1e1e]">
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest font-mono mb-1.5">Skin Tone</p>
                    {profile.skin_tone ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0"
                          style={{ background: SKIN_COLORS[profile.skin_tone] ?? "#c68642" }} />
                        <span className="text-sm font-bold text-white">{profile.skin_tone}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-600">Not analysed</p>
                    )}
                  </div>
                </div>
              </div>

              <button onClick={() => router.push("/outfit")}
                className="mt-4 w-full py-2.5 rounded-xl border border-[#1e1e1e] hover:border-[#d4af7f]/30 text-xs font-semibold text-neutral-400 hover:text-[#d4af7f] transition">
                {profile.body_shape ? "🔄 Retake Analysis" : "📸 Analyse My Style"}
              </button>
            </div>

            {/* Quick links */}
            <div className="rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] p-5">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Quick Access</h2>
              <div className="space-y-1">
                {[
                  { label: "AI Stylist", icon: Sparkles, path: "/outfit" },
                  { label: "Style Quiz",  icon: Zap,      path: "/quiz" },
                  { label: "Trending",   icon: Star,      path: "/#trending" },
                ].map(({ label, icon: Icon, path }) => (
                  <button key={label} onClick={() => router.push(path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#141414] transition group">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-[#d4af7f]" />
                      <span className="text-sm text-neutral-300 group-hover:text-white transition">{label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-neutral-400 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Sign Out ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 mt-2 border-t border-[#111] flex justify-center">
        <button onClick={() => logout()}
          className="flex items-center gap-2.5 px-7 py-3 rounded-2xl text-red-400 border border-red-500/12 hover:bg-red-500/8 hover:border-red-500/25 transition text-sm font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}