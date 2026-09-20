"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, Loader2, Info } from "lucide-react";
import { R3layApi } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  model?: string;
}

export const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      sender: "assistant",
      text: "Namaste! I am the **R3LAY AI Assistant** powered by **AWS Bedrock** and **Google OR-Tools**.\n\nI have live visibility into Train **12951 Mumbai Rajdhani Express**.\n\nYou can ask me about vacant berths, RAC status, why a recommendation was generated, or rules for senior citizens.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: "AWS Bedrock (Claude 3 Sonnet)",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const samplePrompts = [
    "Which coaches have vacant lower berths suitable for elderly passengers?",
    "Explain recommendation REC-8491",
    "How many RAC passengers are pending allocation before Kota Jn?",
    "What is the current running status and coach occupancy?",
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isSending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsSending(true);

    try {
      const res = await R3layApi.askAssistant(userMsg.text);
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: "assistant",
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: res.model || "AWS Bedrock (Claude 3 Sonnet)",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I encountered an issue querying the backend train database. Please ensure the backend API Gateway is reachable.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
              <Bot className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              AWS Bedrock Conversational Core
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            R3LAY AI Assistant
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query real-time train manifest, explain mathematical seat reallocations, and get policy guidance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 font-mono">
            Model: claude-3-sonnet
          </span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold mr-1">Quick Inquiries:</span>
        {samplePrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={isSending}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 hover:text-white transition-all text-left disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl min-h-[420px] max-h-[550px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === "user";

          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-950/80 border border-slate-800 text-slate-200"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                <div
                  className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    isUser ? "border-blue-500/50 text-blue-200" : "border-slate-800 text-slate-500"
                  }`}
                >
                  <span>{m.model || (isUser ? "TTE Session" : "R3LAY AI")}</span>
                  <span>{m.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analyzing live database state & querying AWS Bedrock...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about train seats, recommendations, or senior passenger lower berths..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
