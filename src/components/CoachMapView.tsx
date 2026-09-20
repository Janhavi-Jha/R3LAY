"use client";

import React, { useState } from "react";
import { DoorOpen, CheckCircle, Clock, AlertTriangle, ShieldAlert, Sparkles, Filter, RefreshCw, UserCheck } from "lucide-react";

interface CoachMapViewProps {
  coaches: any[];
  selectedCoachId: string;
  setSelectedCoachId: (id: string) => void;
  seats: any[];
  onSelectSeat: (seat: any) => void;
  isLoadingSeats: boolean;
  onRefreshSeats: () => void;
}

export const CoachMapView: React.FC<CoachMapViewProps> = ({
  coaches,
  selectedCoachId,
  setSelectedCoachId,
  seats,
  onSelectSeat,
  isLoadingSeats,
  onRefreshSeats,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const currentCoach = coaches.find(
    (c) => c.coachNumber === selectedCoachId || c.id === selectedCoachId
  ) || coaches[2] || coaches[0];

  const getSeatColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-950/70 border-emerald-500/70 text-emerald-200 hover:bg-emerald-900/80 shadow-emerald-950/30";
      case "OCCUPIED":
        return "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750";
      case "RAC":
        return "bg-amber-950/70 border-amber-500/70 text-amber-200 hover:bg-amber-900/80 shadow-amber-950/30";
      case "NO_SHOW":
        return "bg-rose-950/80 border-rose-500 text-rose-200 hover:bg-rose-900/80";
      case "SUGGESTED":
        return "bg-indigo-950/80 border-indigo-400 text-indigo-100 ring-2 ring-indigo-500/40 animate-pulse-subtle";
      case "BLOCKED":
        return "bg-slate-900 border-slate-800 text-slate-500";
      default:
        return "bg-slate-800 border-slate-700 text-slate-300";
    }
  };

  const filteredSeats = filterStatus === "ALL"
    ? seats
    : seats.filter((s) => s.status === filterStatus);

  // Group seats by cabin number
  const cabins: Record<number, any[]> = {};
  seats.forEach((seat) => {
    const cab = seat.cabinNumber || Math.floor((seat.berthNumber - 1) / 8) + 1;
    if (!cabins[cab]) cabins[cab] = [];
    cabins[cab].push(seat);
  });

  return (
    <div className="space-y-6">
      {/* Header with Coach Selector Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Coach {currentCoach?.coachNumber} Visualization
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Class {currentCoach?.coachClass || "3A"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive bay-by-bay berth allocation. Click any berth to inspect passenger or mark No-Show.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefreshSeats}
              disabled={isLoadingSeats}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSeats ? "animate-spin text-blue-400" : ""}`} />
              <span>Refresh Coach</span>
            </button>
          </div>
        </div>

        {/* Coach Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {coaches.map((c) => {
            const isSelected =
              c.coachNumber === selectedCoachId || c.id === selectedCoachId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCoachId(c.coachNumber)}
                className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 border ${
                  isSelected
                    ? "bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30 font-bold"
                    : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{c.coachNumber}</span>
                <span className="text-[10px] opacity-75 font-mono">({c.coachClass})</span>
              </button>
            );
          })}
        </div>

        {/* Coach Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400">Total Berths</span>
            <p className="text-lg font-bold text-white mt-0.5">{currentCoach?.totalBerths || seats.length}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-slate-400">Occupied</span>
            <p className="text-lg font-bold text-slate-200 mt-0.5">{currentCoach?.occupiedBerths || 0}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-emerald-400">Vacant Berths</span>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{currentCoach?.vacantBerths || 0}</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-amber-400">RAC Passengers</span>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{currentCoach?.racCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Filter Berths:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses ({seats.length})</option>
            <option value="AVAILABLE">AVAILABLE (Vacant)</option>
            <option value="OCCUPIED">OCCUPIED (Confirmed)</option>
            <option value="RAC">RAC (Shared)</option>
            <option value="SUGGESTED">AI SUGGESTED</option>
            <option value="NO_SHOW">NO_SHOW</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
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
            <span className="text-indigo-300">SUGGESTED</span>
          </div>
        </div>
      </div>

      {/* Indian Railways Cabin-By-Cabin Visual Seat Layout */}
      {isLoadingSeats ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
          <p className="font-semibold text-slate-200">Loading Coach {selectedCoachId} seat layout from backend...</p>
          <p className="text-slate-500 mt-1">Connecting to API Gateway / Lambda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(cabins).map(([cabinNum, cabinSeats]) => {
            // In Indian Railways 3-Tier:
            // First 6 berths: 1,2,3 (LB,MB,UB) facing 4,5,6 (LB,MB,UB)
            // Last 2 berths: 7 (SL), 8 (SU)
            const mainBay1 = cabinSeats.slice(0, 3);
            const mainBay2 = cabinSeats.slice(3, 6);
            const sideBay = cabinSeats.slice(6, 8);

            return (
              <div
                key={cabinNum}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-semibold text-slate-400">
                  <span className="text-blue-400 font-bold uppercase tracking-wider">
                    Cabin {cabinNum} (Berths {cabinSeats[0]?.berthNumber} – {cabinSeats[cabinSeats.length - 1]?.berthNumber})
                  </span>
                  <span>Gangway / Passage</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left / Main Cabin Bay (6 berths) */}
                  <div className="md:col-span-8 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">
                      Main Bay (6 Berths)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Row 1: Left facing */}
                      {mainBay1.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => onSelectSeat(seat)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${getSeatColor(
                            seat.status
                          )} flex flex-col justify-between h-24 relative shadow-sm`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-extrabold">{seat.berthNumber}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 font-bold">
                              {seat.berthType}
                            </span>
                          </div>
                          <div className="text-xs truncate font-medium mt-1 w-full">
                            {seat.passengerName || (seat.status === "AVAILABLE" ? "Vacant" : seat.status)}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider font-mono opacity-60">
                            {seat.status}
                          </div>
                        </button>
                      ))}

                      {/* Row 2: Right facing */}
                      {mainBay2.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => onSelectSeat(seat)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${getSeatColor(
                            seat.status
                          )} flex flex-col justify-between h-24 relative shadow-sm`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-extrabold">{seat.berthNumber}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 font-bold">
                              {seat.berthType}
                            </span>
                          </div>
                          <div className="text-xs truncate font-medium mt-1 w-full">
                            {seat.passengerName || (seat.status === "AVAILABLE" ? "Vacant" : seat.status)}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider font-mono opacity-60">
                            {seat.status}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Corridor divider indicator */}
                  <div className="hidden md:flex md:col-span-1 justify-center items-center">
                    <div className="h-20 w-0.5 bg-slate-800 border-l border-dashed border-slate-700" />
                  </div>

                  {/* Right / Side Bay (2 berths: SL & SU) */}
                  <div className="md:col-span-3 bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">
                      Side Bay (2 Berths)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {sideBay.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => onSelectSeat(seat)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${getSeatColor(
                            seat.status
                          )} flex flex-col justify-between h-24 relative shadow-sm`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-extrabold">{seat.berthNumber}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 font-bold">
                              {seat.berthType}
                            </span>
                          </div>
                          <div className="text-xs truncate font-medium mt-1 w-full">
                            {seat.passengerName || (seat.status === "AVAILABLE" ? "Vacant" : seat.status)}
                          </div>
                          <div className="text-[9px] uppercase tracking-wider font-mono opacity-60">
                            {seat.status}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
