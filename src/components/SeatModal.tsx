"use client";

import React, { useState } from "react";
import { X, ShieldAlert, User, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";

interface SeatModalProps {
  seat: any;
  onClose: () => void;
  onMarkNoShow: (seat: any, reason?: string) => void;
  isActionLoading: boolean;
}

export const SeatModal: React.FC<SeatModalProps> = ({
  seat,
  onClose,
  onMarkNoShow,
  isActionLoading,
}) => {
  const [reason, setReason] = useState("");
  const [confirmNoShow, setConfirmNoShow] = useState(false);

  if (!seat) return null;

  const isOccupied = seat.status === "OCCUPIED" || seat.status === "RAC";
  const coachNum = seat.coachId ? seat.coachId.replace("12951-", "") : "B1";

  const handleNoShowSubmit = () => {
    onMarkNoShow(seat, reason);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-white">
              Coach {coachNum} · Berth {seat.berthNumber}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
              {seat.berthType}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Berth Info */}
        <div className="py-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-slate-400">Cabin / Coupe</span>
              <p className="font-bold text-white text-sm mt-0.5">Cabin {seat.cabinNumber || 1}</p>
            </div>
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-slate-400">Current Status</span>
              <p className="font-bold text-sm mt-0.5 text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    seat.status === "AVAILABLE"
                      ? "bg-emerald-400"
                      : seat.status === "OCCUPIED"
                      ? "bg-blue-400"
                      : seat.status === "RAC"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                />
                <span>{seat.status}</span>
              </p>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-semibold block mb-1">Assigned Passenger</span>
            {seat.passengerName ? (
              <div className="space-y-1">
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>{seat.passengerName}</span>
                </p>
                {seat.passengerId && (
                  <p className="font-mono text-slate-400 text-[11px]">
                    PNR: {seat.passengerId}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-emerald-400 font-medium">
                Berth is currently vacant and available for allocation.
              </p>
            )}
          </div>

          {/* Confirm No-Show Sub-form */}
          {confirmNoShow ? (
            <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Passenger No-Show Operation</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                This will update passenger status to <strong>NO_SHOW</strong>, release Berth{" "}
                <strong>{coachNum}-{seat.berthNumber}</strong> to <strong>AVAILABLE</strong>, and trigger
                EventBridge optimization for waiting RAC passengers.
              </p>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Reason / Station Note:</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Passenger absent at Mathura Jn departure"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={handleNoShowSubmit}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isActionLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Database...</span>
                    </>
                  ) : (
                    <span>Confirm & Release Berth</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmNoShow(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            isOccupied && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmNoShow(true)}
                  className="w-full py-2.5 px-4 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Mark Passenger as No-Show</span>
                </button>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
