export type CallStatus = "done" | "processing" | "no_recording" | "needs_review";

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  ownerUncertain: boolean;
  dueDate: string | null;
  completed: boolean;
}

export interface Call {
  id: string;
  title: string;
  date: string;       // ISO string
  duration: number;   // minutes
  source: "zoom" | "phone" | "in_person";
  attendees: string[];
  status: CallStatus;
  summary: string | null;
  actionItems: ActionItem[];
  entities: { type: "person" | "company" | "deal" | "topic"; value: string }[];
}

export const MOCK_CALLS: Call[] = [
  {
    id: "call-001",
    title: "Riverview Capital / Q2 Financing",
    date: "2026-03-20T14:15:00",
    duration: 12,
    source: "zoom",
    attendees: ["James Okafor", "Sarah Mitchell"],
    status: "done",
    summary:
      "Call covered updated leverage targets for the Q2 financing. Client wants to bring ratio to 4.5x (from 5.2x) before going to market. Timeline: model update by Thursday, next call Friday to review.",
    actionItems: [
      {
        id: "ai-001",
        description: "Send updated leverage model with 4.5x scenario",
        owner: "You",
        ownerUncertain: false,
        dueDate: "2026-03-21",
        completed: false,
      },
      {
        id: "ai-002",
        description: "Schedule follow-up call for Friday",
        owner: "You",
        ownerUncertain: false,
        dueDate: null,
        completed: false,
      },
      {
        id: "ai-003",
        description: "Confirm go-to-market timeline with coverage team",
        owner: "You",
        ownerUncertain: true,
        dueDate: null,
        completed: false,
      },
    ],
    entities: [
      { type: "company", value: "Riverview Capital" },
      { type: "person", value: "James Okafor" },
      { type: "person", value: "Sarah Mitchell" },
      { type: "deal", value: "Q2 Financing" },
      { type: "topic", value: "Leverage ratio 4.5x" },
    ],
  },
  {
    id: "call-002",
    title: "Internal — Deal Review",
    date: "2026-03-18T10:00:00",
    duration: 18,
    source: "zoom",
    attendees: ["Diana Reeves", "Alex Chen", "+3"],
    status: "done",
    summary:
      "Weekly deal review. Fairness opinion timeline moved to Apr 4 due to legal review backlog. Riverview leverage model needs to be updated before next client call. M&A pipeline light this quarter.",
    actionItems: [
      {
        id: "ai-004",
        description: "Confirm fairness opinion timeline with legal",
        owner: "Diana Reeves",
        ownerUncertain: false,
        dueDate: "2026-03-22",
        completed: false,
      },
    ],
    entities: [
      { type: "person", value: "Diana Reeves" },
      { type: "topic", value: "Fairness opinion" },
      { type: "topic", value: "M&A pipeline" },
    ],
  },
  {
    id: "call-003",
    title: "Meridian Partners / M&A Advisory Intro",
    date: "2026-03-19T09:00:00",
    duration: 28,
    source: "in_person",
    attendees: ["Marcus Webb", "Priya Nair"],
    status: "done",
    summary:
      "Exploratory intro with Meridian's CEO and CFO. Company is dual-tracking a sale vs. IPO. CEO open to M&A advisory mandate, wants NDA before sharing financials. Target close Q3 if they go sell-side.",
    actionItems: [
      {
        id: "ai-005",
        description: "Send NDA to Marcus Webb for signature",
        owner: "You",
        ownerUncertain: false,
        dueDate: "2026-03-21",
        completed: false,
      },
      {
        id: "ai-006",
        description: "Prepare preliminary valuation framework",
        owner: "You",
        ownerUncertain: false,
        dueDate: "2026-03-28",
        completed: false,
      },
    ],
    entities: [
      { type: "company", value: "Meridian Partners" },
      { type: "person", value: "Marcus Webb" },
      { type: "person", value: "Priya Nair" },
      { type: "deal", value: "M&A Advisory" },
      { type: "topic", value: "Dual-track sale/IPO" },
    ],
  },
  {
    id: "call-004",
    title: "Hartwell Group / Refi Discussion",
    date: "2026-03-18T09:00:00",
    duration: 9,
    source: "phone",
    attendees: ["Tom Hartwell"],
    status: "no_recording",
    summary: null,
    actionItems: [],
    entities: [
      { type: "company", value: "Hartwell Group" },
      { type: "person", value: "Tom Hartwell" },
    ],
  },
  {
    id: "call-005",
    title: "Blackstone Credit / Term Sheet Review",
    date: "2026-03-17T15:30:00",
    duration: 22,
    source: "zoom",
    attendees: ["Claire Yu", "Robert Stern"],
    status: "processing",
    summary: null,
    actionItems: [],
    entities: [],
  },
];

export const UPCOMING_CALLS = [
  {
    id: "upcoming-001",
    title: "Riverview Capital / Q2 Check-in",
    time: "2:15 PM",
    duration: 30,
    source: "zoom" as const,
    attendees: ["James Okafor", "Sarah Mitchell"],
    minutesUntil: 4,
  },
  {
    id: "upcoming-002",
    title: "Hartwell Group / Refi Check-in",
    time: "3:30 PM",
    duration: 30,
    source: "phone" as const,
    attendees: ["Tom Hartwell"],
    minutesUntil: 79,
  },
  {
    id: "upcoming-003",
    title: "Internal — Weekly Deal Review",
    time: "4:30 PM",
    duration: 60,
    source: "zoom" as const,
    attendees: ["Diana Reeves", "Alex Chen", "+4"],
    minutesUntil: 139,
  },
];

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const callDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (callDay.getTime() === today.getTime()) return "Today";
  if (callDay.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function sourceLabel(source: Call["source"]): string {
  return { zoom: "Zoom", phone: "Phone", in_person: "In Person" }[source];
}
