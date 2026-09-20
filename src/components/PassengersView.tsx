"use client";

import React, { useState } from "react";
import { Search, Filter, ShieldAlert, ArrowUpDown, UserCheck, AlertCircle, RefreshCw, Users, FileDown } from "lucide-react";

interface PassengersViewProps {
  passengers: any[];
  onMarkNoShow: (passenger: any) => void;
  onRefresh: () => void;
  isLoading: boolean;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const PassengersView: React.FC<PassengersViewProps> = ({
  passengers,
  onMarkNoShow,
  onRefresh,
  isLoading,
  onSearchChange,
  searchQuery,
}) => {
  const [coachFilter, setCoachFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredPassengers = passengers.filter((p) => {
    if (coachFilter !== "ALL" && p.coachNumber !== coachFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.pnr.toLowerCase().includes(q) ||
        (p.berthNumber && String(p.berthNumber).includes(q)) ||
        (p.groupId && p.groupId.toLowerCase().includes(q)) ||
        (p.requirement && p.requirement.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Passenger Manifest (Train 12951)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live CRIS PRS passenger booking records. Total: {filteredPassengers.length} passengers shown.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
              <span>Sync Manifest</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Passenger Name, PNR (e.g. 284-9102481), Berth..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Coach filter */}
          <div className="sm:col-span-3">
            <select
              value={coachFilter}
              onChange={(e) => setCoachFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Coaches (B1, B2, H1, etc.)</option>
              <option value="B1">Coach B1 (3-Tier AC)</option>
              <option value="B2">Coach B2 (3-Tier AC)</option>
              <option value="B3">Coach B3 (3-Tier AC)</option>
              <option value="A1">Coach A1 (2-Tier AC)</option>
              <option value="H1">Coach H1 (1st AC)</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses (Confirmed, RAC, No-Show)</option>
              <option value="CONFIRMED">CONFIRMED Only</option>
              <option value="RAC">RAC (Waiting Clearance)</option>
              <option value="NO_SHOW">NO-SHOW Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Passenger Name & Age</th>
                <th className="py-3.5 px-4">PNR Number</th>
                <th className="py-3.5 px-4">Coach & Berth</th>
                <th className="py-3.5 px-4">Group / Family</th>
                <th className="py-3.5 px-4">Preference / Requirement</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-300">No passengers match your search or filter</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((pax) => {
                  const isNoShow = pax.status === "NO_SHOW";
                  const isRac = pax.status === "RAC";

                  return (
                    <tr
                      key={pax.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isNoShow ? "bg-rose-950/20" : isRac ? "bg-amber-950/10" : ""
                      }`}
                    >
                      {/* Name & Age */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{pax.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {pax.age} yrs · {pax.gender === "M" ? "Male" : "Female"}
                        </div>
                      </td>

                      {/* PNR */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {pax.pnr}
                      </td>

                      {/* Coach & Berth */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                            {pax.coachNumber}
                          </span>
                          <span>-</span>
                          <span>
                            {pax.berthNumber ? `Berth ${pax.berthNumber}` : "RAC Shared"}
                          </span>
                        </div>
                        {pax.berthType && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({pax.berthType})
                          </span>
                        )}
                      </td>

                      {/* Group */}
                      <td className="py-3.5 px-4 text-slate-400">
                        {pax.groupId ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium text-[11px]">
                            {pax.groupId}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Requirement */}
                      <td className="py-3.5 px-4">
                        {pax.requirement ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium">
                            {pax.requirement}
                          </span>
                        ) : (
                          <span className="text-slate-600">Standard</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                            isNoShow
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : isRac
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          }`}
                        >
                          {pax.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {!isNoShow ? (
                          <button
                            type="button"
                            onClick={() => onMarkNoShow(pax)}
                            className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 hover:text-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition-all"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>Mark No-Show</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-rose-400 font-medium italic">
                            Recorded No-Show
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
