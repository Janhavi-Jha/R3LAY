"use client";

import React, { useState } from "react";
import { X, ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";

interface QuickNoShowModalProps {
  passengers: any[];
  onClose: () => void;
  onSubmitNoShow: (params: { passengerId?: string; reason?: string }) => void;
  isLoading: boolean;
}

export const QuickNoShowModal: React.FC<QuickNoShowModalProps> = ({
  passengers,
  onClose,
  onSubmitNoShow,
  isLoading,
}) => {
  const eligiblePax = passengers.filter((p) => p.status === "CONFIRMED");
  const [selectedPaxId, setSelectedPaxId] = useState(eligiblePax[0]?.id || "");
  const [reason, setReason] = useState("Passenger absent during ticket verification at Mathura Jn");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaxId) return;
    onSubmitNoShow({ passengerId: selectedPaxId, reason });
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Record Passenger No-Show</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Select Passenger (Manifest)
            </label>
            <select
              value={selectedPaxId}
              onChange={(e) => setSelectedPaxId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              {eligiblePax.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.coachNumber}-{p.berthNumber || "RAC"} · PNR: {p.pnr})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Reason / Station Checkpoint
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Passenger absent at station checkpoint"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Marking No-Show immediately releases the assigned berth into the <strong>AVAILABLE</strong> pool,
              records a live event in DynamoDB, and prompts the OR-Tools optimization engine to reallocate waiting RAC passengers.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedPaxId}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Backend...</span>
                </>
              ) : (
                <span>Submit No-Show</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
