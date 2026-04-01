"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

type Step = "credentials" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithOtp, verifyLoginOtp } = useAuth();

  const [step,           setStep]           = useState<Step>("credentials");
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [otp,            setOtp]            = useState(["", "", "", "", "", "", "", ""]);
  const [error,          setError]          = useState("");
  const [loading,        setLoading]        = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: verify password silently then send OTP ───────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter both email and password."); return; }
    try {
      setLoading(true);
      setError("");

      // Verify password is correct
      const { error: pwError } = await supabase.auth.signInWithPassword({ email, password });
      if (pwError) {
        if (pwError.message.toLowerCase().includes("email not confirmed")) {
          setError("Please verify your email first. Check your inbox for the OTP.");
        } else {
          setError("Invalid email or password.");
        }
        setLoading(false);
        return;
      }

      // Sign out immediately — real session comes after OTP
      await supabase.auth.signOut();

      // Send OTP via authContext
      await loginWithOtp(email);

      setStep("otp");
      setResendCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);

    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP → full session ────────────────────────────────────
  const verifyCode = async (code: string) => {
    if (code.length < 8) return;
    try {
      setLoading(true);
      setError("");
      await verifyLoginOtp(email, code);
      router.push("/");
    } catch (err: any) {
      setError("Invalid or expired code. Please try again.");
      setOtp(["", "", "", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => verifyCode(otp.join(""));

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError("");
    if (value && index < 7) inputRefs.current[index + 1]?.focus();
    if (next.join("").length === 8) setTimeout(() => verifyCode(next.join("")), 100);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (pasted.length === 8) {
      setOtp(pasted.split(""));
      inputRefs.current[7]?.focus();
      setTimeout(() => verifyCode(pasted), 100);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      await loginWithOtp(email);
      setResendCooldown(60);
      setOtp(["", "", "", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError("Failed to resend. Please try again.");
    }
  };

  // ── Google login — no OTP needed ──────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      setError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* ── LEFT SIDE ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer mb-8" onClick={() => router.push("/")}>
            <Image src="/outfevibe_logo.png" alt="Outfevibe" width={40} height={40} className="object-contain" />
            <h2 className="text-2xl font-bold tracking-widest">OUTFEVIBE</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ── CREDENTIALS ── */}
            {step === "credentials" && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
                  <p className="text-gray-400">Sign in to continue your style journey</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm mb-2 text-gray-400">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#d4af7f] outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-400">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#d4af7f] outline-none transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Sending verification code..." : "Continue"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                <div className="text-center text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-[#d4af7f] hover:underline font-medium">Sign Up</Link>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                  <span className="text-gray-500 text-sm">or continue with</span>
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3 rounded-xl border border-[#2a2a2a] hover:border-[#d4af7f] transition flex items-center justify-center gap-3 font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </motion.div>
            )}

            {/* ── OTP STEP ── */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#d4af7f,#b8860b)" }}
                  >
                    <ShieldCheck className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Verify It&apos;s You</h1>
                    <p className="text-gray-400 text-sm">Enter the 8-digit code we sent</p>
                  </div>
                </div>

                <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#d4af7f] flex-shrink-0" />
                  <span className="text-sm text-white font-medium truncate">{email}</span>
                  <button
                    onClick={() => { setStep("credentials"); setOtp(["","","","","","","",""]); setError(""); }}
                    className="ml-auto text-xs text-gray-500 hover:text-[#d4af7f] transition flex-shrink-0"
                  >
                    Change
                  </button>
                </div>

                {/* OTP boxes */}
                <div className="flex gap-3 justify-between" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-[#0f0f0f] outline-none transition-all"
                      style={{
                        borderColor: digit ? "#d4af7f" : "#2a2a2a",
                        color:       digit ? "#d4af7f" : "#fff",
                        boxShadow:   digit ? "0 0 12px rgba(212,175,127,0.2)" : "none",
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length < 8}
                  className="w-full py-3 rounded-xl bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-center space-y-1">
                  <p className="text-sm text-gray-500">Didn&apos;t receive the code?</p>
                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className="text-sm font-semibold transition"
                    style={{ color: resendCooldown > 0 ? "#444" : "#d4af7f" }}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Enter all 8 digits. Check spam if you don't see it.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#d4af7f]/20" />
        <Image src="/hero/hero.jpg" alt="Fashion" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center space-y-6">
            <h2 className="text-5xl font-bold">Your Style, Elevated</h2>
            <p className="text-gray-400 text-lg">
              Join thousands discovering their unique fashion identity with AI-powered styling.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}