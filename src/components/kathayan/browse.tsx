import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, ArrowRight, Bookmark, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  allTitles,
  flagships,
  titles,
  notes,
  collections,
  plans,
  searchCatalogue,
  type Title,
} from "@/lib/catalogue";
import { EmptyState, TitleCard, usePrototype } from "./shell";
import { FlagshipCards } from "./home";
export function Filters({
  value,
  onChange,
  items = ["All", "Originals", "History", "Knowledge", "Nature", "Society"],
}: {
  value: string;
  onChange: (v: string) => void;
  items?: string[];
}) {
  return (
    <div className="filter-row" aria-label="Catalogue filters">
      {items.map((item) => (
        <Button
          key={item}
          variant="glass"
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
          aria-pressed={value === item}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
export function BrowsePage({ kind }: { kind: "Series" | "Film" | "Documentary" | "Short" }) {
  const [filter, setFilter] = useState("All");
  const heading = {
    Series: "Series",
    Film: "Films",
    Documentary: "Documentaries",
    Short: "Shorts",
  }[kind];
  const list = allTitles.filter(
    (t) => t.kind === kind && (filter === "All" || filter === "Originals" || t.category === filter),
  );
  return (
    <>
      <h1 className="page-heading">{heading}</h1>
      <p className="page-intro">
        {kind === "Series"
          ? "Five perspectives. A world of stories."
          : kind === "Short"
            ? "Small moments. Remarkable stories."
            : "Stories worth spending time with."}
      </p>
      {kind === "Series" && (
        <section className="section">
          <div className="section-header">
            <h2>Flagship Series</h2>
            <span className="meta">Five original collections</span>
          </div>
          <div className="catalogue-grid series-grid">
            <FlagshipCards />
          </div>
        </section>
      )}
      <Filters value={filter} onChange={setFilter} />
      <div className="section-header">
        <h2>{kind === "Series" ? "All series" : heading}</h2>
        <span className="meta">{list.length} sample titles</span>
      </div>
      {list.length ? (
        <div className="catalogue-grid">
          {list.map((item) =>
            kind === "Short" ? (
              <Link
                to="/watch/$id"
                params={{ id: item.id }}
                search={{ episode: 1, season: 1, trailer: false }}
                className="media-card short-card"
                key={item.id}
              >
                <img src={item.image} alt={item.title} />
                <div className="short-title">
                  {item.title}
                  <span>{item.duration}</span>
                </div>
              </Link>
            ) : (
              <div key={item.id}>
                <TitleCard item={item} />
                {kind === "Series" && (
                  <p className="meta mt-2">
                    {item.seasons} {item.seasons === 1 ? "season" : "seasons"} · {item.category}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      ) : (
        <EmptyState
          title="No stories in this collection"
          description="Try another filter to find your next story."
        />
      )}
    </>
  );
}
export function SearchPage() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["Nalanda", "High Himalaya", "The Arthashastra"]);
  const result = searchCatalogue(query);
  const hasResults = result.series.length + result.films.length + result.notes.length > 0;
  const remember = (value: string) => {
    setQuery(value);
    if (value.trim()) setRecent((old) => [value, ...old.filter((x) => x !== value)].slice(0, 5));
  };
  return (
    <>
      <h1 className="page-heading">Find your next story</h1>
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          remember(query);
        }}
      >
        <Search size={25} className="text-muted-foreground" />
        <input
          aria-label="Search catalogue"
          placeholder="Search films, series, and knowledge notes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <Button
            variant="icon"
            size="icon"
            aria-label="Clear search"
            title="Clear search"
            onClick={() => setQuery("")}
          >
            <X />
          </Button>
        )}
      </form>
      {!query.trim() ? (
        <>
          <div className="section-header">
            <h2>Recent searches</h2>
            {recent.length > 0 && (
              <Button variant="icon" onClick={() => setRecent([])}>
                Clear all
              </Button>
            )}
          </div>
          {recent.length ? (
            <div className="filter-row">
              {recent.map((r) => (
                <Button key={r} variant="glass" onClick={() => remember(r)}>
                  <Search size={13} />
                  {r}
                </Button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recent searches"
              description="Your next discovery starts with a search."
            />
          )}
          <section className="section">
            <div className="section-header">
              <h2>Popular stories</h2>
            </div>
            <div className="catalogue-grid">
              {titles.slice(0, 4).map((item) => (
                <TitleCard item={item} key={item.id} />
              ))}
            </div>
          </section>
        </>
      ) : hasResults ? (
        <>
          {(
            [
              { name: "Series", items: result.series },
              { name: "Films", items: result.films },
            ] as { name: string; items: Title[] }[]
          ).map(
            (group) =>
              group.items.length > 0 && (
                <section className="section" key={group.name}>
                  <div className="section-header">
                    <h2>{group.name}</h2>
                    <span className="meta">{group.items.length} results</span>
                  </div>
                  <div className="catalogue-grid">
                    {group.items.map((item) => (
                      <TitleCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ),
          )}
          {result.notes.length > 0 && (
            <section className="section">
              <div className="section-header">
                <h2>Notes</h2>
              </div>
              <div className="catalogue-grid">
                {result.notes.map((note) => (
                  <Link
                    className="media-card note-card"
                    to="/notes/$id"
                    params={{ id: note.id }}
                    key={note.id}
                  >
                    <div className="eyebrow">{note.label}</div>
                    <h3>{note.title}</h3>
                    <p className="meta">{note.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <EmptyState
          title="No stories found"
          description={`No sample titles match “${query}”. Try Nalanda, history, or knowledge.`}
        />
      )}
    </>
  );
}
export function MyListPage() {
  const { saved, toggle } = usePrototype();
  const list = allTitles.filter((t) => saved.includes(t.id));
  return (
    <>
      <h1 className="page-heading">My List</h1>
      <p className="page-intro">Stories to return to. Discoveries still to come.</p>
      {list.length ? (
        <>
          <div className="section-header">
            <h2>Saved stories</h2>
            <span className="meta">
              {list.length} {list.length === 1 ? "title" : "titles"}
            </span>
          </div>
          <div className="catalogue-grid">
            {list.map((item) => (
              <div className="relative" key={item.id}>
                <TitleCard item={item} />
                <Button
                  variant="icon"
                  size="icon"
                  className="remove-card"
                  aria-label={`Remove ${item.title}`}
                  title="Remove from My List"
                  onClick={() => toggle(item.id)}
                >
                  <X size={15} />
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState title="Your list is empty." description="Save a film to watch later." action />
      )}
    </>
  );
}
export function CollectionsPage({ category = "All" }: { category?: string }) {
  const [filter, setFilter] = useState(category);
  const list = allTitles.filter(
    (t) => t.kind !== "Short" && (filter === "All" || t.category === filter),
  );
  return (
    <>
      <h1 className="page-heading">Explore Collections</h1>
      <p className="page-intro">Follow your curiosity.</p>
      <div className="rail five">
        {collections.map((c) => (
          <Button
            variant="icon"
            key={c.name}
            className="media-card collection h-auto w-full p-0 text-left block"
            onClick={() => setFilter(c.category)}
            aria-label={`Explore ${c.name}`}
          >
            <img src={c.image} alt={c.name} />
            <div className="collection-label">{c.name}</div>
          </Button>
        ))}
      </div>
      <Filters
        value={filter}
        onChange={setFilter}
        items={["All", "History", "Knowledge", "Nature", "Society"]}
      />
      {list.length ? (
        <div className="catalogue-grid">
          {list.map((item) => (
            <TitleCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No stories in this collection"
          description="Choose another collection."
        />
      )}
    </>
  );
}
export function NotesPage() {
  const [filter, setFilter] = useState("All");
  const list = notes.filter((n) => filter === "All" || n.label === filter.toUpperCase());
  return (
    <>
      <h1 className="page-heading">Knowledge Notes</h1>
      <p className="page-intro">Beyond the frame. Into the ideas.</p>
      <Filters
        value={filter}
        onChange={setFilter}
        items={["All", "Research note", "Field note", "Citation note"]}
      />
      {list.length ? (
        <div className="catalogue-grid">
          {list.map((note) => (
            <Link
              to="/notes/$id"
              params={{ id: note.id }}
              className="media-card note-card"
              key={note.id}
            >
              <div className="eyebrow">{note.label}</div>
              <h3>{note.title}</h3>
              <p className="meta">{note.description}</p>
              <div className="meta">
                <span>5 min read</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No notes yet" description="Try another note collection." />
      )}
    </>
  );
}
export function ProfilePage() {
  const { profile, setProfile } = usePrototype();
  const [plan, setPlan] = useState<string | null>(null);
  return (
    <>
      <h1 className="page-heading">Your KATHAYAN</h1>
      <p className="page-intro">A little space for your curiosity.</p>
      <h2 className="text-base mt-8">Who's watching?</h2>
      <div className="profiles">
        {["Ananya", "Arjun", "Family"].map((name) => (
          <Button
            key={name}
            variant="icon"
            className={`profile-tile ${profile === name ? "active" : ""}`}
            aria-label={name}
            aria-pressed={profile === name}
            onClick={() => setProfile(name)}
          >
            <span className="profile-initial">{name.charAt(0)}</span>
            <span>{name}</span>
          </Button>
        ))}
      </div>
      <div className="section-header">
        <h2>Find your plan</h2>
        <span className="meta">Sample plans · No live charges</span>
      </div>
      <div className="plan-grid">
        {plans.map((p) => (
          <article className="plan" key={p.name}>
            <span className="eyebrow">
              {p.name === "Premium" ? "THE COMPLETE EXPERIENCE" : "KATHAYAN"}
            </span>
            <h3>{p.name}</h3>
            <p className="text-sm">
              {p.price} <span className="meta">· Sample</span>
            </p>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Button
              variant="cinema"
              aria-label={`Choose ${p.name}`}
              onClick={() => setPlan(p.name)}
            >
              Choose
            </Button>
          </article>
        ))}
      </div>
      <Dialog
        open={plan !== null}
        onOpenChange={(open) => {
          if (!open) setPlan(null);
        }}
      >
        <DialogContent>
          <DialogTitle>{plan} plan</DialogTitle>
          <DialogDescription>Billing is not connected in this prototype.</DialogDescription>
          <p className="meta">
            All displayed prices are samples. No payment is required or collected.
          </p>
          <Button variant="cinema" onClick={() => setPlan(null)}>
            Understood
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
