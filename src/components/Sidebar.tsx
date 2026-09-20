"use client";

import React from "react";
import {
  LayoutDashboard,
  Train,
  Grid3X3,
  Users,
  Sparkles,
  Activity,
  BarChart3,
  Bot,
  FileText,
  Settings,
  ShieldCheck,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "train-overview"
  | "coach-view"
  | "passengers"
  | "recommendations"
  | "live-events"
  | "analytics"
  | "assistant"
  | "reports"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingRecsCount: number;
  racCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingRecsCount,
  racCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems: { id: NavTab; label: string; icon: any; badge?: number | string; badgeColor?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "train-overview", label: "Train Overview", icon: Train },
    { id: "coach-view", label: "Coach View", icon: Grid3X3 },
    { id: "passengers", label: "Passengers", icon: Users, badge: racCount > 0 ? `${racCount} RAC` : undefined, badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
    { id: "recommendations", label: "AI Recommendations", icon: Sparkles, badge: pendingRecsCount > 0 ? pendingRecsCount : undefined, badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { id: "live-events", label: "Live Events", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "assistant", label: "AI Assistant", icon: Bot, badge: "Bedrock", badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Pipeline Architecture</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              API Gateway ➔ Lambda ➔ DynamoDB ➔ OR-Tools ➔ Bedrock
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
