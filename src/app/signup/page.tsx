"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Lock, Mail, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const { user, signup, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Redirect to /outfit after successful auth ──────────────────────────────
  useEffect(() => {
    if (user) router.push("/outfit");
  }, [user, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    try {
      setLoading(true);
      setError("");
      await signup(email, password, name);
      setStep("otp");
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 7) otpRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 8) verifyOtp(newOtp.join(""));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (pasted.length === 8) { setOtp(pasted.split("")); verifyOtp(pasted); }
  };

  const verifyOtp = async (code: string) => {
    setOtpLoading(true);
    setOtpError("");
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "signup" });
      if (error) {
        setOtpError("Invalid or expired code. Please try again.");
        setOtp(["", "", "", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        // ── Redirect to /outfit after successful signup ──────────────────────
        router.push("/outfit");
      }
    } catch (err: any) {
      setOtpError(err.message || "Verification failed.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyClick = () => {
    const code = otp.join("");
    if (code.length !== 8) { setOtpError("Please enter the full 8-digit code."); return; }
    verifyOtp(code);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpError("");
    setOtp(["", "", "", "", "", "", "", ""]);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) { setOtpError("Failed to resend code. Try again."); }
      else { setResendCooldown(60); otpRefs.current[0]?.focus(); }
    } catch { setOtpError("Failed to resend code."); }
  };

  const handleGoogleSignup = async () => {
    try {
      setError("");
      await loginWithGoogle();
      // Google OAuth redirects automatically — useEffect above handles /outfit redirect
    } catch (err: any) {
      setError(err.message || "Google signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <AnimatePresence mode="wait">

          {/* ── SIGNUP FORM ── */}
          {step === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md space-y-8"
            >
              {/* Logo */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                <Image src="/outfevibe_logo.png" alt="Outfevibe" width={40} height={40} className="object-contain" />
                <h2 className="text-2xl font-bold tracking-widest">OUTFEVIBE</h2>
              </div>

              <div>
                <h1 className="text-4xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-400">Start your style journey today</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm mb-2 text-gray-400">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] focus:border-[#d4af7f] outline-none transition"
                    />
                  </div>
                </div>

                {/* Email */}
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

                {/* Password */}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>

                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  By signing up, you agree to our{" "}
                  <Link href="/terms-of-service" className="text-[#d4af7f] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-[#d4af7f] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>

              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#d4af7f] hover:underline font-medium">Log in</Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#2a2a2a]"></div>
                <span className="text-gray-500 text-sm">or continue with</span>
                <div className="flex-1 h-px bg-[#2a2a2a]"></div>
              </div>

              {/* Google */}
              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignup}
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

                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  By continuing with Google, you agree to our{" "}
                  <Link href="/terms-of-service" className="text-[#d4af7f] hover:underline">Terms</Link>
                  {" "}and{" "}
                  <Link href="/privacy-policy" className="text-[#d4af7f] hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── OTP VERIFICATION ── */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md space-y-8"
            >
              {/* Logo */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                <Image src="/outfevibe_logo.png" alt="Outfevibe" width={40} height={40} className="object-contain" />
                <h2 className="text-2xl font-bold tracking-widest">OUTFEVIBE</h2>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#d4af7f]/10 border border-[#d4af7f]/30 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-[#d4af7f]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Verify your email</h1>
                  <p className="text-gray-400 text-sm">We sent an 8-digit code to</p>
                  <p className="text-[#d4af7f] font-medium mt-1">{email}</p>
                </div>
              </div>

              {/* OTP inputs */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-10 h-12 text-center text-lg font-bold rounded-xl bg-[#0f0f0f] border transition outline-none
                      ${digit ? "border-[#d4af7f] text-white" : "border-[#2a2a2a] text-gray-400"}
                      focus:border-[#d4af7f]`}
                  />
                ))}
              </div>

              {otpError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                  {otpError}
                </div>
              )}

              <button
                onClick={handleVerifyClick}
                disabled={otpLoading || otp.join("").length !== 8}
                className="w-full py-3 rounded-xl bg-[#d4af7f] text-black font-semibold hover:bg-[#e5cca5] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {otpLoading ? "Verifying..." : "Verify Email"}
                {!otpLoading && <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="text-center text-sm text-gray-400">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className={`font-medium transition ${
                    resendCooldown > 0 ? "text-gray-600 cursor-not-allowed" : "text-[#d4af7f] hover:underline"
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => { setStep("signup"); setOtp(["", "", "", "", "", "", "", ""]); setOtpError(""); }}
                  className="text-xs text-gray-600 hover:text-gray-400 transition"
                >
                  ← Wrong email? Go back
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#d4af7f]/20"></div>
        <Image src="/hero/hero.jpg" alt="Fashion" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center space-y-6">
            <h2 className="text-5xl font-bold">Discover Your Style DNA</h2>
            <p className="text-gray-400 text-lg">
              Let AI help you unlock outfits that match your personality and vibe.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}