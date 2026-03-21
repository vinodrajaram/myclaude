"use client";

import { useState } from "react";
import { MOCK_CALLS } from "@/lib/mock-data";
import CallRow from "@/components/calls/CallRow";
import { Search } from "lucide-react";

export default function CallsPage() {
  const [query, setQuery] = useState("");

  const filtered = MOCK_CALLS.filter((call) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      call.title.toLowerCase().includes(q) ||
      call.summary?.toLowerCase().includes(q) ||
      call.attendees.some((a) => a.toLowerCase().includes(q)) ||
      call.entities.some((e) => e.value.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      <h1 className="text-[18px] font-medium mb-6" style={{ color: "var(--text-1)" }}>
        Call History
      </h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-3)" }}
        />
        <input
          type="text"
          placeholder="Search calls, clients, deals…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-4 py-2 text-[13px] rounded-[4px]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-1)",
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.boxShadow = "0 0 0 2px var(--accent-dim)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[15px] font-medium mb-1" style={{ color: "var(--text-1)" }}>
            No calls found.
          </p>
          <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
            Try a different search term.
          </p>
        </div>
      ) : (
        <div
          className="rounded-[6px] overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {filtered.map((call) => (
            <CallRow key={call.id} call={call} />
          ))}
        </div>
      )}
    </div>
  );
}
