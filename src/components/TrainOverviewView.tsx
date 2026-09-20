"use client";

import React from "react";
import { Train, Clock, MapPin, CheckCircle, ArrowRight, ShieldCheck, User, Users } from "lucide-react";
import { NavTab } from "./Sidebar";

interface TrainOverviewViewProps {
  train: any;
  coaches: any[];
  onSelectCoach: (coachNumber: string) => void;
  onNavigate: (tab: NavTab) => void;
}

export const TrainOverviewView: React.FC<TrainOverviewViewProps> = ({
  train,
  coaches,
  onSelectCoach,
  onNavigate,
}) => {
  const stations = [
    { code: "NDLS", name: "New Delhi", time: "16:55 (DEP)", passed: true },
    { code: "MTJ", name: "Mathura Jn", time: "18:05 (DEP)", passed: true, current: true },
    { code: "KOTA", name: "Kota Jn", time: "21:30 (ARR)", passed: false, next: true },
    { code: "RTM", name: "Ratlam Jn", time: "00:45 (ARR)", passed: false },
    { code: "BRC", name: "Vadodara Jn", time: "04:18 (ARR)", passed: false },
    { code: "ST", name: "Surat", time: "05:55 (ARR)", passed: false },
    { code: "MMCT", name: "Mumbai Central", time: "08:35 (ARR)", passed: false },
  ];

  return (
    <div className="space-y-6">
      {/* Train Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl">
              <Train className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                  TRAIN #{train?.number || "12951"}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Running on Time (+0 min)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {train?.name || "Mumbai Tejas Rajdhani Express"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Rake Type: Tejas Sleeper LHB Rake · Operated by Northern Railway (NR) / CRIS Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400">Scheduled Departure</span>
              <p className="text-sm font-bold text-white mt-0.5">16:55 NDLS</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-slate-400">Expected Arrival</span>
              <p className="text-sm font-bold text-white mt-0.5">08:35 MMCT</p>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-slate-400">Total Distance</span>
              <p className="text-sm font-bold text-blue-400 mt-0.5">1,384 km</p>
            </div>
          </div>
        </div>

        {/* Station Timeline */}
        <div className="pt-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block">
            Station Run Progress & Charting Points
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {stations.map((st) => (
              <div
                key={st.code}
                className={`p-3 rounded-xl border text-center transition-all ${
                  st.current
                    ? "bg-blue-950/70 border-blue-500 text-blue-200 ring-2 ring-blue-500/30"
                    : st.passed
                    ? "bg-slate-950/60 border-slate-800 text-slate-400 opacity-70"
                    : st.next
                    ? "bg-amber-950/40 border-amber-600/50 text-amber-200"
                    : "bg-slate-950/40 border-slate-800 text-slate-400"
                }`}
              >
                <div className="text-[10px] font-mono font-bold">{st.code}</div>
                <div className="text-xs font-bold mt-0.5 truncate">{st.name}</div>
                <div className="text-[10px] mt-1 text-slate-400">{st.time}</div>
                {st.current && (
                  <span className="inline-block mt-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-blue-600 text-white rounded">
                    CURRENT
                  </span>
                )}
                {st.next && (
                  <span className="inline-block mt-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-amber-600 text-white rounded">
                    NEXT
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rake Coach Manifest Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Full Train Rake Composition</h3>
            <p className="text-xs text-slate-400">
              Overview of all 8 coaches with capacity, occupancy percentage, and RAC counts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coaches.map((c) => {
            const occRate = c.totalBerths > 0 ? Math.round((c.occupiedBerths / c.totalBerths) * 100) : 0;
            const isAssigned = c.coachNumber === "B1" || c.coachNumber === "B2";

            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border transition-all ${
                  isAssigned
                    ? "bg-blue-950/30 border-blue-600/40"
                    : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-white">{c.coachNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      Class {c.coachClass}
                    </span>
                  </div>

                  {isAssigned && (
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                      Your Sector
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Occupancy</span>
                    <span className="font-bold text-white">{occRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occRate > 90
                          ? "bg-rose-500"
                          : occRate > 75
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${occRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400">Total</span>
                    <p className="font-bold text-white">{c.totalBerths}</p>
                  </div>
                  <div>
                    <span className="text-emerald-400">Vacant</span>
                    <p className="font-bold text-emerald-300">{c.vacantBerths}</p>
                  </div>
                  <div>
                    <span className="text-amber-400">RAC</span>
                    <p className="font-bold text-amber-300">{c.racCount}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCoach(c.coachNumber);
                    onNavigate("coach-view");
                  }}
                  className="w-full mt-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 flex items-center justify-center gap-1"
                >
                  <span>Open Coach View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
