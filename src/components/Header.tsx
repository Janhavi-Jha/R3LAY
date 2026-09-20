"use client";

import React, { useState } from "react";
import { Train, RefreshCw, Zap, User, LogOut, Shield, ChevronDown, Menu, X, CheckCircle, Database } from "lucide-react";
import { UserProfile } from "@/lib/auth";

interface HeaderProps {
  user: UserProfile;
  train: any;
  onLogout: () => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenAwsConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  train,
  onLogout,
  onRunOptimization,
  isOptimizing,
  onRefresh,
  isRefreshing,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenAwsConfig,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Compute initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Train className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-white tracking-tight">R3LAY</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                    TTE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
                  Rethink. Reallocate. Ride.
                </span>
              </div>
            </div>

            {/* Train live ticker pill */}
            <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">
                {train?.number || "12951"} {train?.name ? train.name.replace("Express", "").trim() : "Rajdhani"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {train?.currentStation || "Mathura Jn"}
              </span>
              <span className="text-slate-500">➔</span>
              <span className="text-slate-300">
                Next: <strong className="text-white">{train?.nextStation || "Kota Jn"}</strong>
              </span>
            </div>
          </div>

          {/* Right: Quick actions & TTE profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Refresh Button */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh live train state from API Gateway"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            </button>

            {/* Quick Run Optimization Button */}
            <button
              type="button"
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className={`w-3.5 h-3.5 ${isOptimizing ? "animate-spin text-amber-300" : "fill-current"}`} />
              <span className="hidden sm:inline">{isOptimizing ? "Optimizing..." : "Run Optimization"}</span>
              <span className="sm:hidden">{isOptimizing ? "..." : "Optimize"}</span>
            </button>

            {/* Authenticated User Profile */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-100 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    {user.role} · {user.assignedCoaches}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/80 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Authenticated TTE</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{user.name}</p>
                    <p className="text-xs text-slate-300 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      <span>Emp ID: {user.employeeId}</span>
                    </div>
                  </div>

                  <div className="px-2 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenAwsConfig();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Database className="w-4 h-4 text-blue-400" />
                      <span>Backend & Cognito Status</span>
                    </button>
                  </div>

                  <div className="px-2 pt-1 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out (End Session)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
