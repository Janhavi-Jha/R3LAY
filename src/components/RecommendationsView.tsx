"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Filter,
  RefreshCw,
  Loader2,
  Clock,
  Layers,
} from "lucide-react";

interface RecommendationsViewProps {
  recommendations: any[];
  onApprove: (id: string) => void;
  onReject: (rec: any) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onRefresh: () => void;
  isLoading: boolean;
  approvingId: string | null;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onApprove,
  onReject,
  onRunOptimization,
  isOptimizing,
  onRefresh,
  isLoading,
  approvingId,
}) => {
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL"
    ? recommendations
    : recommendations.filter((r) => r.status === filter);

  const pendingCount = recommendations.filter((r) => r.status === "PENDING").length;
  const approvedCount = recommendations.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = recommendations.filter((r) => r.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* AI Engine Architecture Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-purple-950 border border-blue-800/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg">
                <Brain className="w-5 h-5 text-blue-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Optimization & Reasoning Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              AI-Driven Train Seat Reallocation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Feasibility & integer programming governed by <strong>Google OR-Tools CP-SAT</strong> (FastAPI).
              Natural language justifications formulated by <strong>AWS Bedrock (Claude 3 Sonnet)</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="py-3 px-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isOptimizing ? "animate-spin text-amber-300" : "fill-current"}`} />
              <span>{isOptimizing ? "Solving Constraints..." : "Run AI Optimization"}</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Filter Recommendations:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "ALL"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              All ({recommendations.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "PENDING"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("APPROVED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "APPROVED"
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("REJECTED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === "REJECTED"
                  ? "bg-rose-600 text-white font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-750"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Showing <strong>{filtered.length}</strong> recommendations
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-slate-300 text-sm">No recommendations in this view</p>
          <p className="text-slate-500 mt-1">
            Click &quot;Run AI Optimization&quot; to formulate candidate seat allocations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((rec) => {
            const isPending = rec.status === "PENDING";
            const isApproved = rec.status === "APPROVED";
            const isRejected = rec.status === "REJECTED";
            const scoreDelta = rec.scoreAfter - rec.scoreBefore;
            const isApproving = approvingId === rec.id;

            return (
              <div
                key={rec.id}
                className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isApproved
                    ? "border-emerald-800/50 bg-emerald-950/10"
                    : isRejected
                    ? "border-slate-800 bg-slate-950/40 opacity-70"
                    : "border-slate-700/80 hover:border-blue-500/50 shadow-lg shadow-black/30"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                        {rec.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          rec.type === "SENIOR_CITIZEN_PRIORITY"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : rec.type === "RAC_CLEARANCE"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {rec.type.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isApproved
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : isRejected
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>

                  {/* Passenger */}
                  <div className="mb-3">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Passenger
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {rec.affectedPassengers}
                    </h3>
                  </div>

                  {/* Allocation Transition Box */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Current Berth
                      </span>
                      <p className="font-medium text-slate-300 mt-0.5">
                        {rec.currentAllocation}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                        <span>Proposed Allocation</span>
                      </span>
                      <p className="font-bold text-emerald-300 mt-0.5">
                        {rec.proposedAllocation}
                      </p>
                    </div>
                  </div>

                  {/* Score improvement meter */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 mb-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Optimization Score Gain:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">{rec.scoreBefore}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-emerald-400 font-bold font-mono text-sm">
                        {rec.scoreAfter}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                        +{scoreDelta} pts
                      </span>
                    </div>
                  </div>

                  {/* Bedrock AI Explanation */}
                  <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AWS Bedrock Explanation</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px] italic">
                      &quot;{rec.explanation}&quot;
                    </p>
                  </div>

                  {/* If rejected, show reason */}
                  {isRejected && rec.rejectionReason && (
                    <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-300">
                      <strong>Rejection Reason:</strong> {rec.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isPending && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => onApprove(rec.id)}
                      className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Validating Database...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Reallocate</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => onReject(rec)}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {isApproved && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Allocation Executed · DynamoDB Synced</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(rec.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
