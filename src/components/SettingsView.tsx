"use client";

import React, { useState, useEffect } from "react";
import { Settings, Sliders, ShieldCheck, Database, Save, CheckCircle2, RefreshCw, AlertCircle, Info } from "lucide-react";
import { R3layApi } from "@/lib/api";
import { APP_CONFIG } from "@/lib/config";

export const SettingsView: React.FC = () => {
  const [weights, setWeights] = useState({
    seniorCitizenPriority: 95,
    familyProximity: 85,
    movementMinimization: 65,
    racClearance: 90,
    enableAutoOptimization: false,
  });
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const [wRes, cRes] = await Promise.all([
          R3layApi.getOptimizationSettings(),
          R3layApi.getConfig(),
        ]);
        if (wRes.weights) setWeights(wRes.weights);
        if (cRes) setConfig(cRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await R3layApi.saveOptimizationSettings(weights);
      if (res.success) {
        setSuccessMessage("Optimization preferences successfully saved to backend database.");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update settings in backend database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <span>System Settings & Solver Parameters</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Google OR-Tools CP-SAT integer programming weights and view AWS cloud architecture.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/50 rounded-xl flex items-center gap-2.5 text-emerald-200 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-950/80 border border-rose-600/50 rounded-xl flex items-center gap-2.5 text-rose-200 text-xs font-semibold animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: OR-Tools Optimization Weights */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">OR-Tools Constraint Weights</h3>
              <p className="text-[11px] text-slate-400">
                Adjust objective function penalties for mathematical solver
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Senior Citizen Priority */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-200">
                  Senior Citizen Lower Berth Priority
                </label>
                <span className="font-mono font-bold text-blue-400">
                  {weights.seniorCitizenPriority}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.seniorCitizenPriority}
                onChange={(e) =>
                  setWeights({ ...weights, seniorCitizenPriority: parseInt(e.target.value) })
                }
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Prioritizes reallocating passengers aged 60+ from Upper/Middle berths to vacant Lower Berths.
              </p>
            </div>

            {/* RAC Clearance Priority */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-200">
                  RAC Clearance Priority
                </label>
                <span className="font-mono font-bold text-amber-400">
                  {weights.racClearance}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.racClearance}
                onChange={(e) =>
                  setWeights({ ...weights, racClearance: parseInt(e.target.value) })
                }
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Allocates vacated berths to RAC passengers before subsequent station departure.
              </p>
            </div>

            {/* Family Proximity */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-200">
                  Family Group Proximity
                </label>
                <span className="font-mono font-bold text-purple-400">
                  {weights.familyProximity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.familyProximity}
                onChange={(e) =>
                  setWeights({ ...weights, familyProximity: parseInt(e.target.value) })
                }
                className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Minimizes coach distance between passengers booked under the same PNR/group.
              </p>
            </div>

            {/* Movement Minimization */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-200">
                  Movement Minimization (Avoid Cascading Shuffles)
                </label>
                <span className="font-mono font-bold text-emerald-400">
                  {weights.movementMinimization}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.movementMinimization}
                onChange={(e) =>
                  setWeights({ ...weights, movementMinimization: parseInt(e.target.value) })
                }
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Penalizes unprompted seat changes to preserve passenger stability during transit.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving to Database..." : "Save Optimization Preferences"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: AWS Architecture Configuration Info */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">AWS Backend Architecture</h3>
                <p className="text-[11px] text-slate-400">Configuration placeholders & active services</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">COGNITO_USER_POOL_ID</span>
                <p className="font-mono font-bold text-white text-xs mt-0.5 truncate">
                  {config?.cognitoUserPoolId || APP_CONFIG.cognito.userPoolId}
                </p>
                <span className="text-[10px] text-emerald-400">Active (Public Cognito ID)</span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">COGNITO_CLIENT_ID</span>
                <p className="font-mono font-bold text-white text-xs mt-0.5 truncate">
                  {config?.cognitoClientId || APP_CONFIG.cognito.clientId}
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">AWS_REGION</span>
                <p className="font-mono font-bold text-white text-xs mt-0.5">
                  {config?.cognitoRegion || APP_CONFIG.cognito.region}
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">API GATEWAY BASE URL</span>
                <p className="font-mono font-bold text-white text-xs mt-0.5 truncate">
                  {config?.apiGatewayUrl || APP_CONFIG.apiBaseUrl}
                </p>
                <span className="text-[10px] text-slate-400">Routes to AWS Lambda backend</span>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">OR-TOOLS OPTIMIZER</span>
                <p className="font-mono font-bold text-blue-400 text-xs mt-0.5">
                  Google OR-Tools CP-SAT (Python FastAPI)
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-slate-400 font-mono text-[11px]">AWS BEDROCK LLM</span>
                <p className="font-mono font-bold text-purple-400 text-xs mt-0.5">
                  anthropic.claude-3-sonnet-20240229-v1:0
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>AWS secret credentials remain server-side in Lambda/IAM roles.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
