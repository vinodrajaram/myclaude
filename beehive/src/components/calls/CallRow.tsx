"use client";

import Link from "next/link";
import { type Call, formatDate, formatDuration, sourceLabel } from "@/lib/mock-data";

interface CallRowProps {
  call: Call;
}

export default function CallRow({ call }: CallRowProps) {
  const hasOpenActions = call.actionItems.some((a) => !a.completed);
  const openCount = call.actionItems.filter((a) => !a.completed).length;
  const isGhost = call.status === "no_recording";
  const isProcessing = call.status === "processing";

  return (
    <Link
      href={`/calls/${call.id}`}
      className="flex items-start gap-3 px-4 py-3 group"
      style={{
        borderBottom: "1px solid var(--border)",
        borderLeft: `2px solid ${hasOpenActions && !isGhost ? "var(--accent)" : "var(--border)"}`,
        textDecoration: "none",
        background: "transparent",
        display: "flex",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--surface-high)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 mb-[2px]">
          <span
            className="text-[13px] font-medium truncate"
            style={{ color: isGhost ? "var(--text-3)" : "var(--text-1)" }}
          >
            {call.title}
          </span>
        </div>

        {/* Meta row */}
        <div
          className="text-[11px] mb-[3px] flex items-center gap-1"
          style={{ color: "var(--text-2)" }}
        >
          <span>{formatDate(call.date)}</span>
          <span>·</span>
          <span>{formatDuration(call.duration)}</span>
          <span>·</span>
          <span>{sourceLabel(call.source)}</span>
        </div>

        {/* Summary preview */}
        {call.status === "done" && call.summary && (
          <p
            className="text-[12px] truncate"
            style={{ color: "var(--text-2)" }}
          >
            {call.summary}
          </p>
        )}
        {isProcessing && (
          <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
            Processing…
          </p>
        )}
        {isGhost && (
          <p className="text-[12px]" style={{ color: "var(--text-3)" }}>
            No summary — recording not started.
          </p>
        )}
      </div>

      {/* Action badge */}
      {openCount > 0 && (
        <span
          className="text-[11px] font-medium flex-shrink-0 mt-[1px]"
          style={{
            background: "var(--accent-dim)",
            color: "var(--accent)",
            borderRadius: "4px",
            padding: "1px 6px",
            whiteSpace: "nowrap",
          }}
        >
          {openCount} {openCount === 1 ? "action" : "actions"}
        </span>
      )}
    </Link>
  );
}
