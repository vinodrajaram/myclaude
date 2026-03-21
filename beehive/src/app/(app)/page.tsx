import { MOCK_CALLS, UPCOMING_CALLS, sourceLabel } from "@/lib/mock-data";
import CallRow from "@/components/calls/CallRow";
import { Video, Phone, Users } from "lucide-react";

const SOURCE_ICON = {
  zoom:      Video,
  phone:     Phone,
  in_person: Users,
};

export default function HomePage() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">

      {/* Date header */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: "var(--text-3)" }}>
          Today
        </p>
        <h1 className="text-[18px] font-medium mt-[2px]" style={{ color: "var(--text-1)" }}>
          {dateLabel}
        </h1>
      </div>

      {/* Upcoming calls */}
      <section className="mb-8">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3"
          style={{ color: "var(--text-3)" }}
        >
          Upcoming
        </p>

        <div className="flex flex-col gap-2">
          {UPCOMING_CALLS.map((call, i) => {
            const Icon = SOURCE_ICON[call.source];
            const isNext = i === 0;

            return (
              <div
                key={call.id}
                className="rounded-[6px] p-4"
                style={{
                  background: "var(--surface)",
                  border: `${isNext ? "2px" : "1px"} solid ${isNext ? "var(--border)" : "var(--border)"}`,
                  borderLeft: isNext ? "2px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                {isNext && (
                  <p
                    className="text-[10px] font-medium uppercase tracking-[0.06em] mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    In {call.minutesUntil} minutes
                  </p>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[13px] mb-[3px]" style={{ color: "var(--text-1)" }}>
                      {call.title}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-2)" }}>
                      {call.time} · {call.duration} min · {call.attendees.join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Icon size={14} style={{ color: "var(--text-3)" }} />
                    {isNext && (
                      <button
                        className="text-[13px] font-semibold px-3 py-[6px] rounded-[4px] cursor-pointer"
                        style={{
                          background: "var(--accent)",
                          color: "#0F0F0F",
                          border: "none",
                        }}
                      >
                        Record
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent calls */}
      <section>
        <p
          className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3"
          style={{ color: "var(--text-3)" }}
        >
          Recent
        </p>

        <div
          className="rounded-[6px] overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {MOCK_CALLS.map((call) => (
            <CallRow key={call.id} call={call} />
          ))}
        </div>
      </section>
    </div>
  );
}
