"use client";

import React, { useState } from "react";
import { X, AlertCircle, Loader2, XCircle } from "lucide-react";

interface RejectReasonModalProps {
  recommendation: any;
  onClose: () => void;
  onConfirmReject: (recId: string, reason: string) => void;
  isRejecting: boolean;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  recommendation,
  onClose,
  onConfirmReject,
  isRejecting,
}) => {
  const [reason, setReason] = useState("");

  if (!recommendation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReject(recommendation.id, reason.trim() || "Rejected by TTE during manual verification");
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Reject Recommendation {recommendation.id}
            </h3>
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
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-slate-400 font-semibold">Proposed Reallocation:</span>
            <p className="font-bold text-white mt-0.5">{recommendation.affectedPassengers}</p>
            <p className="text-slate-300 mt-1">{recommendation.proposedAllocation}</p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Reason for Rejection (Optional but logged in CRIS Audit Trail):
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Passenger prefers current berth, VIP hold, or medical equipment placed in current bay..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
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
              disabled={isRejecting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-600/30 disabled:opacity-50"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Logging Rejection...</span>
                </>
              ) : (
                <span>Confirm Rejection</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
