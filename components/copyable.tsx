"use client";

import { useState } from "react";

export function Copyable({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Click to copy"
      className={`group relative inline-flex items-start text-left gap-1.5 rounded px-1 -mx-1 hover:bg-blue-50 cursor-pointer transition print:hover:bg-transparent ${className}`}
    >
      <span className="break-words">{value}</span>
      <span className={`shrink-0 transition-opacity ${copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"} print:hidden`}>
        {copied ? (
          <svg className="w-3.5 h-3.5 text-green-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-medium whitespace-nowrap shadow-lg print:hidden">
          Copied!
        </span>
      )}
    </button>
  );
}
