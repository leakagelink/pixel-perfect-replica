import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Library,
  BookOpen,
  Users,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Menu,
  ArrowLeft,
  Film,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { allTitles, notes, type Title } from "@/lib/catalogue";
import { EmptyState } from "./shell";
type Row = Title & { status: "Published" | "Draft" | "In review" };
const tabs = [
  { name: "Overview", Icon: LayoutDashboard },
  { name: "Catalogue", Icon: Library },
  { name: "Knowledge Notes", Icon: BookOpen },
  { name: "Profiles", Icon: Users },
  { name: "Settings", Icon: Settings },
];
export function AdminPage() {
  const [tab, setTab] = useState("Overview");
  const [menu, setMenu] = useState(false);
  const [rows, setRows] = useState<Row[]>(
    allTitles.map((t, i) => ({
      ...t,
      status: i % 7 === 0 ? "In review" : i % 5 === 0 ? "Draft" : "Published",
    })),
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Row["status"]>("Draft");
  const [kind, setKind] = useState<Title["kind"]>("Documentary");
  const [remove, setRemove] = useState<Row | null>(null);
  const [notice, setNotice] = useState("");
  const [compact, setCompact] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (filter === "All" || r.status === filter) &&
          `${r.title} ${r.category}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query, filter],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  const openEditor = (row?: Row) => {
    setEditing(row ?? null);
    setCreating(!row);
    setTitle(row?.title ?? "");
    setDescription(row?.description ?? "");
    setStatus(row?.status ?? "Draft");
    setKind(row?.kind ?? "Documentary");
  };
  const save = () => {
    if (!title.trim()) return;
    if (editing)
      setRows((old) =>
        old.map((r) =>
          r.id === editing.id ? { ...r, title: title.trim(), description, status, kind } : r,
        ),
      );
    else {
      const first = allTitles[0];
      if (!first) return;
      setRows((old) => [
        { ...first, id: `sample-${Date.now()}`, title: title.trim(), description, status, kind },
        ...old,
      ]);
    }
    setNotice("Sample catalogue updated for this session.");
    setEditing(null);
    setCreating(false);
  };
  const exportRows = () => {
    const text = [
      "Title,Type,Category,Status",
      ...rows.map((r) =>
        [r.title, r.kind, r.category, r.status]
          .map((s) => `"${s.replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kathayan-sample-catalogue.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Sample catalogue exported.");
  };
  const chooseTab = (name: string) => {
    setTab(name);
    setMenu(false);
    setQuery("");
    setFilter("All");
    setPage(1);
  };
  const table = () =>
    filtered.length ? (
      <>
        <div className={`admin-table ${compact ? "compact" : ""}`}>
          <div className="admin-table-head">
            <span>Title</span>
            <span>Type</span>
            <span>Status</span>
            <span>Year</span>
            <span>Actions</span>
          </div>
          {visible.map((r) => (
            <div className="admin-table-row" key={r.id}>
              <div className="admin-title-cell">
                <img src={r.image} alt={r.title} />
                <div className="min-w-0">
                  <h3>{r.title}</h3>
                  <p>
                    {r.category} · {r.duration}
                  </p>
                </div>
              </div>
              <span className="admin-row-type">{r.kind}</span>
              <span
                className={`admin-status ${r.status === "Published" ? "published" : r.status === "Draft" ? "draft" : "review"}`}
              >
                {r.status}
              </span>
              <span className="admin-row-year">{r.year}</span>
              <div className="admin-row-actions">
                <Button
                  variant="icon"
                  size="icon"
                  title={`Edit ${r.title}`}
                  aria-label={`Edit ${r.title}`}
                  onClick={() => openEditor(r)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="icon"
                  size="icon"
                  title={`Delete ${r.title}`}
                  aria-label={`Delete ${r.title}`}
                  onClick={() => setRemove(r)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="admin-pagination">
          <span>
            {(currentPage - 1) * 8 + 1}–{Math.min(currentPage * 8, filtered.length)} of{" "}
            {filtered.length} titles
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              size="icon"
              title="Previous page"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft />
            </Button>
            <span>
              {currentPage} / {pageCount}
            </span>
            <Button
              variant="icon"
              size="icon"
              title="Next page"
              aria-label="Next page"
              disabled={currentPage === pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </>
    ) : (
      <EmptyState title="No titles found" description="Try a different search or status." />
    );
  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${menu ? "open" : ""}`}>
        <Link to="/" className="admin-brand">
          <span className="brand-name">KATHAYAN</span>
          <span className="eyebrow">EDITORIAL DESK</span>
        </Link>
        <Button
          variant="icon"
          size="icon"
          className="admin-menu-close"
          title="Close menu"
          aria-label="Close menu"
          onClick={() => setMenu(false)}
        >
          <X />
        </Button>
        <div className="admin-workspace">
          <span className="admin-workspace-icon">
            <Film size={18} />
          </span>
          <div>
            <strong>Studio workspace</strong>
            <span>Design prototype</span>
          </div>
        </div>
        <nav aria-label="Admin navigation">
          {tabs.map(({ name, Icon }) => (
            <Button
              key={name}
              variant="nav"
              className={`admin-nav-item ${tab === name ? "active" : ""}`}
              onClick={() => chooseTab(name)}
            >
              <Icon size={17} />
              <span>{name}</span>
              {name === "Catalogue" && <span className="admin-nav-count">{rows.length}</span>}
            </Button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Button asChild variant="glass">
            <Link to="/">
              <ArrowLeft size={15} />
              Back to streaming
            </Link>
          </Button>
          <div className="meta">
            Drishvaya Studios
            <br />
            Sample workspace · No live data
          </div>
        </div>
      </aside>
      {menu && (
        <div className="admin-menu-backdrop" onClick={() => setMenu(false)} aria-hidden="true" />
      )}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="icon"
              size="icon"
              className="admin-mobile-menu"
              title="Open menu"
              aria-label="Open admin menu"
              onClick={() => setMenu(true)}
            >
              <Menu />
            </Button>
            <span className="meta">
              Workspace <span className="mx-2">/</span>{" "}
              <span className="text-foreground">{tab}</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="admin-demo-badge">Sample data</span>
            <span className="avatar flex items-center justify-center">D</span>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-page-heading">
            <div className="min-w-0">
              <div className="eyebrow">KATHAYAN STUDIO</div>
              <h1>{tab === "Overview" ? "A closer look at your stories" : tab}</h1>
              <p>
                {tab === "Overview"
                  ? "Your catalogue, at a glance."
                  : tab === "Catalogue"
                    ? "Curate the stories that shape the experience."
                    : tab === "Knowledge Notes"
                      ? "Context, sources, and ideas beyond the frame."
                      : tab === "Profiles"
                        ? "The people in your sample workspace."
                        : "Keep your workspace in focus."}
              </p>
            </div>
            {(tab === "Overview" || tab === "Catalogue") && (
              <Button variant="cinema" onClick={() => openEditor()}>
                <Plus size={16} />
                Add title
              </Button>
            )}
          </div>
          {notice && (
            <div className="admin-notice" role="status">
              <Check size={16} />
              <span>{notice}</span>
              <Button
                variant="icon"
                size="icon"
                title="Dismiss notification"
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={13} />
              </Button>
            </div>
          )}
          {tab === "Overview" && (
            <>
              <div className="admin-stat-grid">
                {[
                  {
                    label: "Catalogue titles",
                    value: rows.length,
                    detail: "Across all collections",
                    Icon: Film,
                  },
                  {
                    label: "Published",
                    value: rows.filter((r) => r.status === "Published").length,
                    detail: "Sample published stories",
                    Icon: Check,
                  },
                  {
                    label: "Editorial review",
                    value: rows.filter((r) => r.status === "In review").length,
                    detail: "Awaiting a closer look",
                    Icon: BookOpen,
                  },
                  {
                    label: "Knowledge notes",
                    value: notes.length,
                    detail: "Research, field & citation",
                    Icon: Library,
                  },
                ].map(({ label, value, detail, Icon }) => (
                  <article className="admin-stat" key={label}>
                    <div>
                      <span>{label}</span>
                      <Icon size={17} />
                    </div>
                    <strong>{value.toString().padStart(2, "0")}</strong>
                    <p>{detail}</p>
                  </article>
                ))}
              </div>
              <div className="admin-overview-band">
                <section>
                  <div className="section-header">
                    <h2>Collection mix</h2>
                    <span className="meta">Sample catalogue</span>
                  </div>
                  {["History", "Knowledge", "Nature", "Society"].map((cat) => {
                    const count = rows.filter((r) => r.category === cat).length;
                    return (
                      <div className="admin-distribution" key={cat}>
                        <div>
                          <span>{cat}</span>
                          <span>{count} titles</span>
                        </div>
                        <progress max={rows.length} value={count} />
                      </div>
                    );
                  })}
                </section>
                <section>
                  <div className="section-header">
                    <h2>Editorial queue</h2>
                    <Button
                      variant="icon"
                      size="icon"
                      title="View catalogue"
                      onClick={() => chooseTab("Catalogue")}
                    >
                      <ArrowUpRight size={16} />
                    </Button>
                  </div>
                  {rows
                    .filter((r) => r.status === "In review")
                    .slice(0, 3)
                    .map((r) => (
                      <div className="admin-queue-row" key={r.id}>
                        <img src={r.image} alt={r.title} />
                        <div className="min-w-0">
                          <h3>{r.title}</h3>
                          <span className="meta">{r.kind} · In review</span>
                        </div>
                        <Button
                          variant="icon"
                          size="icon"
                          title={`Review ${r.title}`}
                          aria-label={`Review ${r.title}`}
                          onClick={() => openEditor(r)}
                        >
                          <ArrowUpRight size={15} />
                        </Button>
                      </div>
                    ))}
                </section>
              </div>
            </>
          )}
          {(tab === "Overview" || tab === "Catalogue") && (
            <section className="admin-catalogue">
              <div className="section-header">
                <h2>{tab === "Overview" ? "Recent titles" : "All titles"}</h2>
                <Button variant="glass" onClick={exportRows}>
                  <Download size={14} />
                  Export
                </Button>
              </div>
              <div className="admin-filter-toolbar">
                <label className="admin-search">
                  <Search size={17} />
                  <input
                    aria-label="Search admin catalogue"
                    placeholder="Search titles or categories"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
                <div className="admin-status-filters" aria-label="Status filters">
                  {["All", "Published", "Draft", "In review"].map((f) => (
                    <Button
                      variant="nav"
                      className={filter === f ? "active" : ""}
                      key={f}
                      aria-pressed={filter === f}
                      onClick={() => {
                        setFilter(f);
                        setPage(1);
                      }}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
              {table()}
            </section>
          )}
          {tab === "Knowledge Notes" && (
            <div className="catalogue-grid">
              {notes.map((note) => (
                <article className="media-card note-card" key={note.id}>
                  <div className="eyebrow">{note.label}</div>
                  <h3>{note.title}</h3>
                  <p className="meta">{note.description}</p>
                  <div className="mt-4">
                    <Button asChild variant="glass">
                      <Link to="/notes/$id" params={{ id: note.id }}>
                        Read note <ArrowUpRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {tab === "Profiles" && (
            <>
              <div className="admin-profiles">
                {[
                  { name: "Ananya", role: "Viewer profile" },
                  { name: "Arjun", role: "Viewer profile" },
                  { name: "Family", role: "Shared profile" },
                ].map(({ name, role }) => (
                  <article className="admin-profile-row" key={name}>
                    <span className="admin-profile-avatar">{name.charAt(0)}</span>
                    <div>
                      <h3>{name}</h3>
                      <p className="meta">{role}</p>
                    </div>
                    <span className="admin-demo-badge">Sample</span>
                  </article>
                ))}
              </div>
              <p className="meta mt-5">
                These are sample viewing profiles, not registered accounts.
              </p>
            </>
          )}
          {tab === "Settings" && (
            <section className="admin-settings">
              <h2 className="text-lg">Workspace preferences</h2>
              <div className="admin-setting-row">
                <div>
                  <h3>Compact catalogue</h3>
                  <p>Reduce row spacing in the catalogue.</p>
                </div>
                <input
                  type="checkbox"
                  aria-label="Compact catalogue"
                  checked={compact}
                  onChange={(e) => {
                    setCompact(e.target.checked);
                    setSettingsSaved(false);
                  }}
                />
              </div>
              <div className="admin-setting-row">
                <div>
                  <h3>Workspace</h3>
                  <p>KATHAYAN Editorial Desk</p>
                </div>
                <span className="admin-demo-badge">Prototype</span>
              </div>
              <Button variant="cinema" onClick={() => setSettingsSaved(true)}>
                <Check size={14} />
                Save preferences
              </Button>
              {settingsSaved && (
                <p className="meta mt-4" role="status">
                  Preferences saved for this session.
                </p>
              )}
            </section>
          )}
          <footer className="admin-footer">
            Drishvaya Studios · Vermaverse (OPC) Private Limited
            <span>Sample workspace · Changes are session-only</span>
          </footer>
        </div>
      </div>
      <Dialog
        open={!!editing || creating}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setCreating(false);
          }
        }}
      >
        <DialogContent className="admin-editor-dialog">
          <DialogTitle>{editing ? "Edit sample title" : "Add sample title"}</DialogTitle>
          <DialogDescription>Changes apply only to this sample admin workspace.</DialogDescription>
          <form
            className="admin-editor-form"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <label>
              Title
              <input
                aria-label="Title name"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Story title"
              />
            </label>
            <label>
              Synopsis
              <textarea
                aria-label="Title synopsis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </label>
            <div className="admin-editor-selects">
              <label>
                Type
                <select
                  aria-label="Title type"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as Title["kind"])}
                >
                  {["Series", "Film", "Documentary", "Short"].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select
                  aria-label="Title status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Row["status"])}
                >
                  {["Draft", "In review", "Published"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-3">
              <Button
                variant="glass"
                type="button"
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="cinema" type="submit">
                Save title
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!remove}
        onOpenChange={(open) => {
          if (!open) setRemove(null);
        }}
      >
        <DialogContent>
          <DialogTitle>Delete {remove?.title}?</DialogTitle>
          <DialogDescription>
            This removes the title from the sample workspace for this session only.
          </DialogDescription>
          <div className="flex justify-end gap-3">
            <Button variant="glass" onClick={() => setRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="cinema"
              onClick={() => {
                if (remove) setRows((old) => old.filter((r) => r.id !== remove.id));
                setRemove(null);
                setNotice("Sample title removed.");
              }}
            >
              Delete title
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
