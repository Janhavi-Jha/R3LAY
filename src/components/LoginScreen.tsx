"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, Train, AlertCircle, Info } from "lucide-react";
import { R3layApi } from "@/lib/api";
import { setAuthSession, UserProfile } from "@/lib/auth";
import { APP_CONFIG } from "@/lib/config";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("rajesh.kumar@irctc.gov.in");
  const [password, setPassword] = useState("R3lay#2025!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await R3layApi.login(username.trim(), password);
      if (response.success && response.user && response.token) {
        setAuthSession(response.token, response.user, response.expiresIn || 3600);
        onLoginSuccess(response.user);
      } else {
        setError("Cognito authentication failed. Invalid response from auth server.");
      }
    } catch (err: any) {
      setError(err?.message || "Cognito authentication error. Unable to verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setUsername(email);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
            <Train className="w-9 h-9 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-300 bg-clip-text text-transparent">
              R3LAY
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
              v2.4
            </span>
          </div>
          <p className="text-sm font-medium text-blue-400 tracking-wide uppercase">
            Rethink. Reallocate. Ride.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Smart Train Seat Management System · Indian Railways CRIS
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-semibold text-white">TTE Authentication</h2>
              <p className="text-xs text-slate-400">Sign in to access assigned coaches & allocations</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cognito Secured</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/70 border border-rose-600/50 rounded-xl flex items-start gap-3 text-rose-200 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-semibold text-rose-300">Authentication Failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-slate-300 mb-1.5">
                IRCTC TTE Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. rajesh.kumar@irctc.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" aria-label="Password" className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 hover:from-blue-500 to-indigo-600 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating with Cognito...</span>
                </>
              ) : (
                <>
                  <span>Sign In with AWS Cognito</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Select TTE Profile (Test Credentials)</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("rajesh.kumar@irctc.gov.in", "R3lay#2025!")}
                className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left transition-all group"
              >
                <div className="font-medium text-xs text-slate-200 group-hover:text-blue-300">Rajesh Kumar</div>
                <div className="text-[10px] text-slate-400">TTE · Coaches B1/B2</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("priya.sharma@irctc.gov.in", "R3lay#2025!")}
                className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left transition-all group"
              >
                <div className="font-medium text-xs text-slate-200 group-hover:text-blue-300">Priya Sharma</div>
                <div className="text-[10px] text-slate-400">Chief TTE · B3/B4/H1</div>
              </button>
            </div>
          </div>
        </div>

        {/* AWS Architecture Metadata */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-2">
            <span>Pool: <code className="text-blue-400 bg-slate-800/50 px-1.5 py-0.5 rounded">{APP_CONFIG.cognito.userPoolId}</code></span>
            <span>•</span>
            <span>Region: <code className="text-blue-400 bg-slate-800/50 px-1.5 py-0.5 rounded">{APP_CONFIG.cognito.region}</code></span>
          </p>
          <p className="text-[11px] text-slate-400">
            Backend API: Frontend → AWS API Gateway → Lambda → Amazon DynamoDB
          </p>
        </div>
      </div>
    </div>
  );
};
