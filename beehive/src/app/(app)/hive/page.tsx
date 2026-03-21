import { MOCK_CALLS } from "@/lib/mock-data";
import { Layers } from "lucide-react";
import Link from "next/link";

export default function HivePage() {
  // Collect all entities across calls, deduplicate
  const entityMap = new Map<string, { type: string; calls: { id: string; title: string }[] }>();

  for (const call of MOCK_CALLS) {
    for (const e of call.entities) {
      const key = `${e.type}:${e.value}`;
      if (!entityMap.has(key)) {
        entityMap.set(key, { type: e.type, calls: [] });
      }
      entityMap.get(key)!.calls.push({ id: call.id, title: call.title });
    }
  }

  const entities = Array.from(entityMap.entries())
    .map(([key, val]) => ({
      key,
      value: key.split(":").slice(1).join(":"),
      type: val.type,
      calls: val.calls,
    }))
    .sort((a, b) => b.calls.length - a.calls.length);

  const byType = (type: string) => entities.filter((e) => e.type === type);

  const TYPE_LABEL: Record<string, string> = {
    person: "People",
    company: "Companies",
    deal: "Deals",
    topic: "Topics",
  };

  return (
    <div className="max-w-[800px] mx-auto px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-[18px] font-medium" style={{ color: "var(--text-1)" }}>
          The Hive
        </h1>
        <span
          className="text-[11px] font-medium px-[6px] py-[1px] rounded-[4px]"
          style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
        >
          Knowledge Graph
        </span>
      </div>
      <p className="text-[13px] mb-8" style={{ color: "var(--text-2)" }}>
        Entities extracted across all your calls. Click any entity to see related calls.
      </p>

      {entities.length === 0 ? (
        <div className="text-center py-16">
          <Layers size={24} style={{ color: "var(--accent)", margin: "0 auto 12px" }} />
          <p className="text-[15px] font-medium mb-1" style={{ color: "var(--text-1)" }}>
            Your hive is quiet.
          </p>
          <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
            Record a call and the hive will start building.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {["company", "person", "deal", "topic"].map((type) => {
            const group = byType(type);
            if (group.length === 0) return null;
            return (
              <div key={type}>
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3"
                  style={{ color: "var(--text-3)" }}
                >
                  {TYPE_LABEL[type]}
                </p>
                <div className="flex flex-col gap-[2px]">
                  {group.map((e) => (
                    <div
                      key={e.key}
                      className="flex items-center justify-between px-3 py-[9px] rounded-[4px]"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                      <span className="text-[13px] font-medium" style={{ color: "var(--text-1)" }}>
                        {e.value}
                      </span>
                      <div className="flex items-center gap-2">
                        {e.calls.map((c) => (
                          <Link
                            key={c.id}
                            href={`/calls/${c.id}`}
                            className="text-[10px] font-medium px-[5px] py-[1px] rounded-[3px]"
                            style={{
                              background: "var(--accent-dim)",
                              color: "var(--accent)",
                              textDecoration: "none",
                            }}
                          >
                            1 call
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
