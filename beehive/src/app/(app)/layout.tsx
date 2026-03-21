import Sidebar from "@/components/nav/Sidebar";
import ThemeToggle from "@/components/nav/ThemeToggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-[52px] flex items-center justify-between px-6 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div /> {/* left slot — breadcrumb or search goes here */}
          <ThemeToggle />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
