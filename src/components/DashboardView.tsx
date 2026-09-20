"use client";

import React from "react";
import {
  Users,
  CheckCircle2,
  DoorOpen,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  AlertTriangle,
  FileDown,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { NavTab } from "./Sidebar";

interface DashboardViewProps {
  train: any;
  coaches: any[];
  selectedCoachId: string;
  setSelectedCoachId: (id: string) => void;
  seats: any[];
  recommendations: any[];
  events: any[];
  onSelectSeat: (seat: any) => void;
  onApproveRec: (recId: string) => void;
  onRejectRec: (rec: any) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onNavigate: (tab: NavTab) => void;
  onOpenQuickNoShow: () => void;
  onDownloadReport: (type: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  train,
  coaches,
  selectedCoachId,
  setSelectedCoachId,
  seats,
  recommendations,
  events,
  onSelectSeat,
  onApproveRec,
  onRejectRec,
  onRunOptimization,
  isOptimizing,
  onNavigate,
  onOpenQuickNoShow,
  onDownloadReport,
}) => {
  const selectedCoach = coaches.find(
    (c) => c.coachNumber === selectedCoachId || c.id === selectedCoachId
  ) || coaches[2] || coaches[0];

  const totalPassengers = coaches.reduce((acc, c) => acc + (c.occupiedBerths || 0), 0);
  const totalBerths = coaches.reduce((acc, c) => acc + (c.totalBerths || 0), 0);
  const totalVacant = coaches.reduce((acc, c) => acc + (c.vacantBerths || 0), 0);
  const totalRac = coaches.reduce((acc, c) => acc + (c.racCount || 0), 0);

  const pendingRecs = recommendations.filter((r) => r.status === "PENDING");
  const recentEvents = events.slice(0, 5);

  const getSeatColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60";
      case "OCCUPIED":
        return "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750";
      case "RAC":
        return "bg-amber-950/70 border-amber-500/50 text-amber-300 hover:bg-amber-900/60";
      case "NO_SHOW":
        return "bg-rose-950/80 border-rose-500 text-rose-300 hover:bg-rose-900/60";
      case "SUGGESTED":
        return "bg-indigo-950/80 border-indigo-400 text-indigo-200 ring-2 ring-indigo-500/40 animate-pulse-subtle";
      case "BLOCKED":
        return "bg-slate-900 border-slate-800 text-slate-500";
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Train summary alert banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-800/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
              IRCTC EXPRESS #{train?.number || "12951"}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              RUNNING ON TIME
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {train?.name || "Mumbai Tejas Rajdhani Express"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {train?.source || "New Delhi (NDLS)"} ➔ {train?.destination || "Mumbai Central (MMCT)"} · Current:{" "}
            <strong className="text-slate-200">{train?.currentStation || "Mathura Jn"}</strong> · Next:{" "}
            <strong className="text-blue-300">{train?.nextStation || "Kota Jn"}</strong>
          </p>
        </div>

        {/* Quick action triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isOptimizing ? "animate-spin text-amber-300" : "fill-current"}`} />
            <span>{isOptimizing ? "Running OR-Tools Solver..." : "Run AI Optimization"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenQuickNoShow}
            className="px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Mark No-Show</span>
          </button>

          <button
            type="button"
            onClick={() => onDownloadReport("occupancy")}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <FileDown className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Passengers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Manifest Pax</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{totalPassengers}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Capacity: {totalBerths} berths</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Occupied Berths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Occupied Berths</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {totalPassengers}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalBerths > 0 ? Math.round((totalPassengers / totalBerths) * 100) : 0}% Occupancy
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Vacant Berths */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Vacant Berths</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">{totalVacant}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Available for reallocation</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <DoorOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: RAC Passengers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">RAC Passengers</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">{totalRac}</h3>
            <p className="text-[11px] text-amber-300/80 mt-0.5">Awaiting confirmed berth</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Coach Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Coach Occupancy & Visualization</h3>
            <p className="text-xs text-slate-400">
              Select coach to inspect seat allocation, vacant berths, and RAC distribution
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("coach-view")}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Full Coach View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Coach Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {coaches.map((c) => {
            const isSelected =
              c.coachNumber === selectedCoachId || c.id === selectedCoachId;
            const rate = c.totalBerths > 0 ? Math.round((c.occupiedBerths / c.totalBerths) * 100) : 0;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCoachId(c.coachNumber)}
                className={`px-3.5 py-2 rounded-xl text-xs flex flex-col items-start gap-1 transition-all shrink-0 border ${
                  isSelected
                    ? "bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30 font-semibold"
                    : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-1.5 w-full justify-between">
                  <span className="font-bold">{c.coachNumber}</span>
                  <span className="text-[10px] opacity-75 font-mono">{c.coachClass}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span>{rate}% occ</span>
                  {c.vacantBerths > 0 && (
                    <span className="text-emerald-300 font-medium">({c.vacantBerths} vac)</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Seat Map Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
            <span>OCCUPIED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-950/80 border border-emerald-500" />
            <span className="text-emerald-300">AVAILABLE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-950/80 border border-amber-500" />
            <span className="text-amber-300">RAC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-950/80 border border-rose-500" />
            <span className="text-rose-300">NO_SHOW</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-950/80 border border-indigo-400 ring-1 ring-indigo-400" />
            <span className="text-indigo-300">AI SUGGESTED</span>
          </div>
        </div>

        {/* Seat Grid Preview for Selected Coach */}
        <div className="mt-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Coach {selectedCoach?.coachNumber} Berth Layout ({seats.length} Berths Displayed)
            </span>
            <span className="text-[11px] text-slate-500">Click any berth to view/adjust</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {seats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                onClick={() => onSelectSeat(seat)}
                className={`p-2 rounded-xl border text-left transition-all ${getSeatColor(
                  seat.status
                )} flex flex-col justify-between h-20 relative group`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">
                    {seat.berthNumber}
                  </span>
                  <span className="text-[10px] font-mono px-1 rounded bg-black/40">
                    {seat.berthType}
                  </span>
                </div>
                <div className="truncate text-[10px] mt-1 w-full font-medium">
                  {seat.passengerName || (seat.status === "AVAILABLE" ? "Vacant" : seat.status)}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400">
                  Cab {seat.cabinNumber}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: AI Recommendations & Live Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active AI Recommendations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Active AI Recommendations</h3>
                  <p className="text-xs text-slate-400">
                    {pendingRecs.length} reallocation(s) pending TTE approval
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("recommendations")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingRecs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-75" />
                <p className="font-semibold text-slate-200">All allocations optimized</p>
                <p className="mt-1">No pending recommendations. Click "Run Optimization" to re-scan.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRecs.slice(0, 2).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                        {rec.id} · {rec.type.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <span>Score: {rec.scoreBefore}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span className="text-emerald-300 font-bold">{rec.scoreAfter}</span>
                        <span className="text-[10px] text-emerald-500">
                          (+{rec.scoreAfter - rec.scoreBefore})
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-white">{rec.affectedPassengers}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Proposed: <strong className="text-blue-300">{rec.proposedAllocation}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2">
                      "{rec.explanation}"
                    </p>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => onApproveRec(rec.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition-colors"
                      >
                        Approve Allocation
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectRec(rec)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-lg transition-colors border border-slate-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Events Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Operations Feed</h3>
                  <p className="text-xs text-slate-400">Real-time CRIS / TTE audit updates</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("live-events")}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3"
                >
                  <span
                    className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      evt.eventType === "NO_SHOW"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : evt.eventType === "RAC_CONVERSION"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : evt.eventType === "SEAT_RELEASED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {evt.eventType.replace(/_/g, " ")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-200 leading-snug">{evt.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>By: {evt.actor}</span>
                      <span>•</span>
                      <span>{new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
