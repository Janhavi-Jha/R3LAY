"use client";

import React, { useEffect, useState } from "react";
import { X, ShieldCheck, Database, Cloud, Zap, Key, Info, CheckCircle2 } from "lucide-react";
import { R3layApi } from "@/lib/api";
import { APP_CONFIG } from "@/lib/config";

interface AwsConfigModalProps {
  onClose: () => void;
}

export const AwsConfigModal: React.FC<AwsConfigModalProps> = ({ onClose }) => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    R3layApi.getConfig().then(setConfig).catch(console.error);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              AWS Cloud Architecture & Cognito Status
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

        <div className="py-4 space-y-3.5 text-xs">
          <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-blue-200">
            <p className="font-semibold flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Multi-Tier Serverless Pipeline</span>
            </p>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Frontend ➔ AWS API Gateway ➔ AWS Lambda ➔ Amazon DynamoDB ➔ EventBridge ➔ OR-Tools FastAPI ➔ Bedrock AI
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">COGNITO USER POOL ID</span>
                <p className="font-mono text-white text-xs font-semibold">
                  {config?.cognitoUserPoolId || APP_CONFIG.cognito.userPoolId}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Pool
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">COGNITO CLIENT ID</span>
                <p className="font-mono text-white text-xs font-semibold">
                  {config?.cognitoClientId || APP_CONFIG.cognito.clientId}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Public Client</span>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">AWS REGION</span>
                <p className="font-mono text-white text-xs font-semibold">
                  {config?.cognitoRegion || APP_CONFIG.cognito.region}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Asia Pacific (Mumbai)</span>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">OPTIMIZATION ENGINE</span>
                <p className="font-mono text-blue-300 text-xs font-semibold">
                  Google OR-Tools CP-SAT (FastAPI)
                </p>
              </div>
              <span className="text-[10px] text-blue-400 font-mono">Constraint Solver</span>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">AI EXPLANATION ENGINE</span>
                <p className="font-mono text-purple-300 text-xs font-semibold">
                  AWS Bedrock (Claude 3 Sonnet)
                </p>
              </div>
              <span className="text-[10px] text-purple-400 font-mono">Reasoning Only</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              No secret credentials or IAM access keys are ever exposed in frontend code. All authorization
              is validated securely via Cognito Bearer tokens.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
