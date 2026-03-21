"use client";

import { useState } from "react";
import { MOCK_CALLS, formatDate } from "@/lib/mock-data";
import { CheckSquare, Square, AlertTriangle } from "lucide-react";
import Link from "next/link";

type ActionItemFlat = {
  id: string;
  callId: string;
  callTitle: string;
  callDate: string;
  description: string;
  owner: string;
  ownerUncertain: boolean;
  dueDate: string | null;
  completed: boolean;
};

function flattenActions(): ActionItemFlat[] {
  return MOCK_CALLS.flatMap((call) =>
    call.actionItems.map((a) => ({
      ...a,
      callId: call.id,
      callTitle: call.title,
      callDate: call.date,
    }))
  ).sort((a, b) => {
    // Open first, then by due date
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}

export default function ActionsPage() {
  const [items, setItems] = useState(flattenActions);

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }

  const open = items.filter((a) => !a.completed);
  const done = items.filter((a) => a.completed);

  return (
    <div className="max-w-[720px] mx-auto px-8 py-8">
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-[18px] font-medium" style={{ color: "var(--text-1)" }}>
          Open Actions
        </h1>
        {open.length > 0 && (
          <span
            className="text-[11px] font-medium"
            style={{
              background: "var(--accent-dim)",
              color: "var(--accent)",
              borderRadius: "4px",
              padding: "1px 6px",
            }}
          >
            {open.length}
          </span>
        )}
      </div>

      {open.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[15px] font-medium mb-1" style={{ color: "var(--text-1)" }}>
            All clear.
          </p>
          <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
            No open actions across your calls.
          </p>
        </div>
      ) : (
        <ActionList items={open} onToggle={toggle} />
      )}

      {done.length > 0 && (
        <div className="mt-8">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3"
            style={{ color: "var(--text-3)" }}
          >
            Completed
          </p>
          <ActionList items={done} onToggle={toggle} dimmed />
        </div>
      )}
    </div>
  );
}

function ActionList({
  items,
  onToggle,
  dimmed = false,
}: {
  items: ActionItemFlat[];
  onToggle: (id: string) => void;
  dimmed?: boolean;
}) {
  return (
    <div
      className="rounded-[6px] overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex items-start gap-3 px-4 py-3"
          style={{
            background: "var(--surface)",
            borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
            opacity: dimmed ? 0.6 : 1,
          }}
        >
          <button
            onClick={() => onToggle(item.id)}
            className="mt-[1px] flex-shrink-0 cursor-pointer"
            style={{ background: "none", border: "none", padding: 0 }}
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
            <div className="flex items-center gap-2 mt-[3px] flex-wrap">
              <span className="text-[11px]" style={{ color: "var(--text-2)" }}>
                {item.owner}
                {item.dueDate && (
                  <> · Due {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                )}
              </span>
              {item.ownerUncertain && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-medium"
                  style={{ color: "var(--destructive)" }}
                >
                  <AlertTriangle size={10} />
                  Owner uncertain
                </span>
              )}
              <Link
                href={`/calls/${item.callId}`}
                className="text-[11px]"
                style={{ color: "var(--text-3)", textDecoration: "none" }}
              >
                {item.callTitle} · {formatDate(item.callDate)}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
