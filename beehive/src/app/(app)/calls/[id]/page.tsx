"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { MOCK_CALLS, formatDate, formatDuration, sourceLabel } from "@/lib/mock-data";
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Mail,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const call = MOCK_CALLS.find((c) => c.id === id);
  if (!call) notFound();

  const [items, setItems] = useState(call.actionItems);

  function toggleItem(itemId: string) {
    setItems((prev) =>
      prev.map((a) => (a.id === itemId ? { ...a, completed: !a.completed } : a))
    );
  }

  const openCount = items.filter((a) => !a.completed).length;

  return (
    <div className="max-w-[720px] mx-auto px-8 py-8">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[12px] mb-6"
        style={{ color: "var(--text-3)", textDecoration: "none" }}
      >
        <ChevronLeft size={14} />
        Home
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[18px] font-medium mb-[6px]" style={{ color: "var(--text-1)" }}>
          {call.title}
        </h1>
        <p className="text-[12px]" style={{ color: "var(--text-2)" }}>
          {formatDate(call.date)} · {formatDuration(call.duration)} · {sourceLabel(call.source)} ·{" "}
          {call.attendees.join(", ")}
        </p>
      </div>

      {/* Summary */}
      {call.summary && (
        <section className="mb-6">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em] mb-2"
            style={{ color: "var(--text-3)" }}
          >
            Summary
          </p>
          <div
            className="text-[13px] leading-[1.6] p-4 rounded-[6px]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-1)",
            }}
          >
            {call.summary}
          </div>
        </section>
      )}

      {/* Action items */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em]"
            style={{ color: "var(--text-3)" }}
          >
            Action Items
          </p>
          {openCount > 0 && (
            <span
              className="text-[11px] font-medium"
              style={{
                background: "var(--accent-dim)",
                color: "var(--accent)",
                borderRadius: "4px",
                padding: "1px 6px",
              }}
            >
              {openCount} open
            </span>
          )}
        </div>

        <div
          className="rounded-[6px] overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {items.length === 0 && (
            <p className="text-[13px] px-4 py-6 text-center" style={{ color: "var(--text-3)" }}>
              No action items extracted.
            </p>
          )}
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 px-4 py-3"
              style={{
                borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
                background: "var(--surface)",
              }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="mt-[1px] flex-shrink-0 cursor-pointer"
                style={{ background: "none", border: "none", padding: 0 }}
                aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
              >
                {item.completed ? (
                  <CheckSquare size={14} style={{ color: "var(--accent)" }} />
                ) : (
                  <Square size={14} style={{ color: "var(--border)" }} />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className="text-[13px]"
                  style={{
                    color: item.completed ? "var(--text-3)" : "var(--text-1)",
                    textDecoration: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-[3px]">
                  <span className="text-[11px]" style={{ color: "var(--text-2)" }}>
                    {item.owner}
                    {item.dueDate && (
                      <> · Due {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                    )}
                    {!item.dueDate && " · No date set"}
                  </span>
                  {item.ownerUncertain && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--destructive)" }}>
                      <AlertTriangle size={10} />
                      Owner uncertain
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Entities */}
      {call.entities.length > 0 && (
        <section className="mb-6">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em] mb-2"
            style={{ color: "var(--text-3)" }}
          >
            Entities
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {call.entities.map((e, i) => (
              <span
                key={i}
                className="text-[11px] font-medium"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  borderRadius: "4px",
                  padding: "2px 7px",
                }}
              >
                {e.value}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* CTAs */}
      {call.status === "done" && (
        <div className="flex gap-3">
          <button
            className="text-[13px] font-semibold px-4 py-[10px] rounded-[4px] flex items-center gap-2 cursor-pointer"
            style={{ background: "var(--accent)", color: "#0F0F0F", border: "none" }}
          >
            <Mail size={14} />
            Draft Follow-up Email
          </button>
          <button
            className="text-[13px] font-medium px-4 py-[9px] rounded-[4px] cursor-pointer"
            style={{
              background: "transparent",
              color: "var(--text-1)",
              border: "1px solid var(--border)",
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
