"use client";

import React, { useState } from "react";
import { Activity, Filter, RefreshCw, PlusCircle, ShieldCheck, Clock, UserCheck, AlertOctagon, ArrowRightLeft } from "lucide-react";
import { R3layApi } from "@/lib/api";

interface LiveEventsViewProps {
  events: any[];
  onRefresh: () => void;
  isLoading: boolean;
  onEventCreated: () => void;
}

export const LiveEventsView: React.FC<LiveEventsViewProps> = ({
  events,
  onRefresh,
  isLoading,
  onEventCreated,
}) => {
  const [filterType, setFilterType] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState("MANUAL_ADJUSTMENT");
  const [coachNum, setCoachNum] = useState("B1");
  const [berthNum, setBerthNum] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = filterType === "ALL"
    ? events
    : events.filter((e) => e.eventType === filterType);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "NO_SHOW":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "RAC_CONVERSION":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "SEAT_RELEASED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "BOARDING":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "CANCELLATION":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-slate-700/40 text-slate-300 border-slate-600/40";
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    try {
      await R3layApi.getEvents(); // verify connection
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: newType,
          coachNumber: coachNum,
          berthNumber: berthNum ? parseInt(berthNum) : null,
          description: description.trim(),
        }),
      });
      setShowAddModal(false);
      setDescription("");
      setBerthNum("");
      onEventCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Live Railway Events & Operational Feed</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              EventBridge streams, passenger actions, TTE verification, and PRS status changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Manual Event</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
              <span>Refresh Log</span>
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-2 border-t border-slate-800">
          <span className="text-slate-400 font-semibold mr-1">Filter Type:</span>
          {[
            { id: "ALL", label: "All Events" },
            { id: "NO_SHOW", label: "NO_SHOW" },
            { id: "RAC_CONVERSION", label: "RAC Conversion" },
            { id: "SEAT_RELEASED", label: "Seat Released" },
            { id: "BOARDING", label: "Boarding" },
            { id: "MANUAL_ADJUSTMENT", label: "Manual Adjustment" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilterType(t.id)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterType === t.id
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Stream List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-4 sm:p-5">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-300">No events found for this filter</p>
            </div>
          ) : (
            filtered.map((evt) => (
              <div
                key={evt.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase shrink-0 border ${getEventBadge(
                      evt.eventType
                    )}`}
                  >
                    {evt.eventType.replace(/_/g, " ")}
                  </span>

                  <div>
                    <p className="text-xs font-medium text-slate-200 leading-snug">
                      {evt.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                      {evt.coachNumber && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          Coach {evt.coachNumber} {evt.berthNumber ? `· Berth ${evt.berthNumber}` : ""}
                        </span>
                      )}
                      <span>Actor: <strong className="text-slate-300">{evt.actor}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono shrink-0 sm:self-center">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(evt.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Log Operational Event</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a manual observation, passenger check, or berth note to the audit log.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="MANUAL_ADJUSTMENT">MANUAL_ADJUSTMENT</option>
                  <option value="BOARDING">BOARDING (Passenger Check)</option>
                  <option value="SEAT_RELEASED">SEAT_RELEASED</option>
                  <option value="NO_SHOW">NO_SHOW (Manual Notice)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Coach Number</label>
                  <input
                    type="text"
                    value={coachNum}
                    onChange={(e) => setCoachNum(e.target.value)}
                    placeholder="B1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Berth (Optional)</label>
                  <input
                    type="number"
                    value={berthNum}
                    onChange={(e) => setBerthNum(e.target.value)}
                    placeholder="e.g. 14"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail passenger verification, special needs, or station checkpoint notes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                >
                  {isSubmitting ? "Logging Event..." : "Record Live Event"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
