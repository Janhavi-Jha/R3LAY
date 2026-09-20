"use client";

import React, { useState, useEffect } from "react";
import { FileText, FileDown, Table, RefreshCw, ShieldCheck, Download } from "lucide-react";
import { R3layApi } from "@/lib/api";

export const ReportsView: React.FC = () => {
  const [activeReport, setActiveReport] = useState<"occupancy" | "optimization" | "audit">("occupancy");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (type: "occupancy" | "optimization" | "audit") => {
    setLoading(true);
    try {
      const res = await R3layApi.getReports(type, "json");
      setReportData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeReport);
  }, [activeReport]);

  const handleDownloadCsv = (type: string) => {
    window.open(`/api/reports?type=${type}&format=csv`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>Shift Handover & Compliance Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Backend-generated operational manifests, PRS audit logs, and OR-Tools optimization records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleDownloadCsv(activeReport)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>Download {activeReport.toUpperCase()} CSV</span>
        </button>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setActiveReport("occupancy")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === "occupancy"
              ? "bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">1. Coach Occupancy & Vacancy</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xs text-slate-400">
            Capacity breakdown, berths occupied, vacant lower berths, and RAC counts by coach.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport("optimization")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === "optimization"
              ? "bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">2. AI Reallocation Decisions</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs text-slate-400">
            OR-Tools decisions, score before/after, approval status, and Bedrock justifications.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport("audit")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeReport === "audit"
              ? "bg-blue-950/40 border-blue-500 text-white shadow-lg shadow-blue-900/20"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sm">3. Complete TTE Audit Trail</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400">
            Immutable log of all approvals, no-shows, and manual adjustments by TTEs.
          </p>
        </button>
      </div>

      {/* Report Data Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white capitalize">
              {activeReport} Report Live Preview
            </h3>
            <p className="text-slate-400 text-[11px]">
              Direct from backend database · Click download above to export CSV
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchReport(activeReport)}
            disabled={loading}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
            <p>Loading {activeReport} data...</p>
          </div>
        ) : activeReport === "occupancy" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <th className="py-2.5 px-3">Coach</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Total Berths</th>
                  <th className="py-2.5 px-3">Occupied</th>
                  <th className="py-2.5 px-3">Vacant</th>
                  <th className="py-2.5 px-3">RAC</th>
                  <th className="py-2.5 px-3">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportData?.report?.coaches?.map((c: any) => (
                  <tr key={c.coach} className="hover:bg-slate-850">
                    <td className="py-2.5 px-3 font-bold text-white">{c.coach}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{c.class}</td>
                    <td className="py-2.5 px-3">{c.capacity}</td>
                    <td className="py-2.5 px-3 text-slate-200">{c.occupied}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-semibold">{c.vacant}</td>
                    <td className="py-2.5 px-3 text-amber-400">{c.rac}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-400">{c.occupancyPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeReport === "optimization" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Passenger</th>
                  <th className="py-2.5 px-3">Score Gain</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportData?.report?.recommendations?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-850">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-400">{r.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-300">{r.type}</td>
                    <td className="py-2.5 px-3 text-slate-200">{r.affectedPassengers}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono font-bold">
                      +{r.scoreAfter - r.scoreBefore} pts ({r.scoreBefore} ➔ {r.scoreAfter})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Performed By</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportData?.logs?.map((l: any) => (
                  <tr key={l.id} className="hover:bg-slate-850">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-blue-300 font-semibold">{l.action}</td>
                    <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{l.performedBy}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
