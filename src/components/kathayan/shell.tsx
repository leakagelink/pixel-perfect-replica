import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Search,
  Home,
  Layers,
  Bookmark,
  UserRound,
  Check,
  Plus,
  ArrowRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSaved, type Title } from "@/lib/catalogue";
const PrototypeContext = createContext<{
  saved: string[];
  toggle: (id: string) => void;
  profile: string;
  setProfile: (name: string) => void;
}>({ saved: [], toggle: () => {}, profile: "Ananya", setProfile: () => {} });
export const usePrototype = () => useContext(PrototypeContext);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<Record<string, string[]>>({});
  const [profile, setProfile] = useState("Ananya");
  const saved = lists[profile] ?? [];
  return (
    <PrototypeContext.Provider
      value={{
        saved,
        toggle: (id) =>
          setLists((old) => ({ ...old, [profile]: toggleSaved(old[profile] ?? [], id) })),
        profile,
        setProfile,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  );
}
const nav = [
  { label: "Home", to: "/" },
  { label: "Series", to: "/series" },
  { label: "Films", to: "/films" },
  { label: "Documentaries", to: "/documentaries" },
  { label: "Shorts", to: "/shorts" },
  { label: "My List", to: "/my-list" },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { profile } = usePrototype();
  const [notifications, setNotifications] = useState(false);
  if (location.pathname === "/admin") return <>{children}</>;
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="KATHAYAN home">
          <svg className="brand-mark" viewBox="0 0 30 36" fill="none" aria-hidden="true">
            <path
              d="M3 32h24M6 28h18V15c0-6-4-10-9-10S6 9 6 15v13Z"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M10 28V15a5 5 0 0 1 10 0v13M15 1v4M2 35h26"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          <div>
            <div className="brand-name">KATHAYAN</div>
            <div className="brand-tag">DOCUMENTARY · KNOWLEDGE · BHARAT</div>
          </div>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map((item) => (
            <Button
              key={item.to}
              asChild
              variant="nav"
              className={location.pathname === item.to ? "active" : ""}
            >
              <Link to={item.to}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="header-actions">
          <Button asChild variant="icon" size="icon" title="Search">
            <Link to="/search" aria-label="Search">
              <Search size={18} />
            </Link>
          </Button>
          <Button
            variant="icon"
            size="icon"
            title="Notifications"
            aria-label="Notifications"
            aria-expanded={notifications}
            onClick={() => setNotifications(!notifications)}
          >
            <Bell size={17} />
          </Button>
          <Button asChild variant="icon" className="avatar" title="Profile">
            <Link to="/profile" aria-label="Profile">
              {profile.charAt(0)}
            </Link>
          </Button>
        </div>
        {notifications && (
          <div className="notification-popover">
            <h3>You're all caught up</h3>
            <p>No new notifications.</p>
            <Button variant="glass" onClick={() => setNotifications(false)}>
              Close
            </Button>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <span>Drishvaya Studios · Vermaverse (OPC) Private Limited</span>
        <span>Sample catalogue · Design prototype</span>
        <Link to="/admin" className="section-link">Studio workspace <ArrowRight size={12} /></Link>
      </footer>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {[
          { to: "/", label: "Home", Icon: Home },
          { to: "/series", label: "Series", Icon: Layers },
          { to: "/search", label: "Search", Icon: Search },
          { to: "/my-list", label: "My List", Icon: Bookmark },
          { to: "/profile", label: "Profile", Icon: UserRound },
        ].map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to as "/" | "/series" | "/search" | "/my-list" | "/profile"}
            className={location.pathname === to ? "active" : ""}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
export function SaveButton({ id }: { id: string }) {
  const { saved, toggle } = usePrototype();
  const selected = saved.includes(id);
  return (
    <Button variant="glass" onClick={() => toggle(id)} aria-pressed={selected}>
      {selected ? <Check size={15} /> : <Plus size={15} />} {selected ? "In My List" : "My List"}
    </Button>
  );
}
export function WatchButton({
  id = "nalanda",
  label = "Watch Now",
  episode = 1,
}: {
  id?: string;
  label?: string;
  episode?: number;
}) {
  return (
    <Button asChild variant="cinema">
      <Link to="/watch/$id" params={{ id }} search={{ episode, season: 1, trailer: false }}>
        <Play size={14} fill="currentColor" />
        {label}
      </Link>
    </Button>
  );
}
export function EmptyState({
  title = "Nothing here yet",
  description = "More stories will appear here.",
  action = false,
}: {
  title?: string;
  description?: string;
  action?: boolean;
}) {
  return (
    <div className="empty-state">
      <Bookmark size={30} />
      <h2>{title}</h2>
      <p>{description}</p>
      {action && (
        <Button asChild variant="cinema" className="mt-5">
          <Link to="/">
            Explore stories <ArrowRight size={14} />
          </Link>
        </Button>
      )}
    </div>
  );
}
export function PageSkeleton() {
  return (
    <div className="skeleton-page" role="status" aria-label="Loading catalogue">
      <div className="skeleton h-80" />
      <div className="catalogue-grid">
        {[1, 2, 3, 4].map((n) => (
          <div className="skeleton" key={n} />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
export function TitleCard({ item, poster = false }: { item: Title; poster?: boolean }) {
  return (
    <Link
      to={item.kind === "Series" ? "/series/$id" : "/title/$id"}
      params={{ id: item.id }}
      className={`media-card ${poster ? "poster" : ""}`}
    >
      <img src={item.image} alt={item.title} loading="lazy" />
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="meta">{poster ? item.description : `${item.kind} · ${item.duration}`}</div>
      </div>
    </Link>
  );
}
