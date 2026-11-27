import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Landmark,
  Palette,
  FlaskConical,
  Users,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  heroes,
  flagships,
  originals,
  collections,
  notes,
  titles,
  findTitle,
} from "@/lib/catalogue";
import { SaveButton, WatchButton, TitleCard } from "./shell";
export function NoteRail() {
  return (
    <div className="rail five">
      {notes.map((note) => (
        <Link
          className="media-card note-card"
          to="/notes/$id"
          params={{ id: note.id }}
          key={note.id}
        >
          <div className="eyebrow">{note.label}</div>
          <h3>{note.title}</h3>
          <div className="meta">
            <span>5 min read</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>
      ))}
    </div>
  );
}
export function FlagshipCards() {
  return (
    <>
      {flagships.map((item) => (
        <Link
          className="media-card flagship"
          to="/series/$id"
          params={{ id: item.id }}
          key={item.id}
        >
          <img src={item.image} alt={item.title} loading="lazy" />
          <div className="card-body">
            <h3 className="card-title">{item.title}</h3>
            <div className="meta">{item.description}</div>
          </div>
        </Link>
      ))}
    </>
  );
}
function Section({
  title,
  to,
  children,
}: {
  title: string;
  to?: "/series" | "/films" | "/shorts" | "/collections" | "/notes";
  children: ReactNode;
}) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        {to ? (
          <Link to={to} className="section-link">
            View all <ArrowRight size={13} />
          </Link>
        ) : (
          <span className="section-link">
            <span>Made for the curious</span>
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
export function HomePage() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setSlide((i) => (i + 1) % heroes.length), 9000);
    return () => clearInterval(timer);
  }, [paused]);
  const hero = heroes[slide] ?? heroes[0];
  if (!hero) return null;
  const collectionIcons = [Landmark, Palette, FlaskConical, Users, Mountain];
  return (
    <>
      <section
        className="hero"
        aria-roledescription="carousel"
        aria-label="Featured stories"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
      >
        <img
          className="hero-photo"
          src={hero.image}
          alt={hero.title === "NALANDA" ? "Nalanda ruins in the dawn mist" : hero.title}
        />
        <div className="hero-content">
          <div className="eyebrow">{hero.kicker}</div>
          <Link to="/title/$id" params={{ id: hero.id }} className="no-underline">
            <h1>{hero.title}</h1>
          </Link>
          <p className="hero-subtitle">{hero.subtitle}</p>
          <div className="hero-meta">
            {hero.meta} <span className="mx-2">·</span> Hindi & English
          </div>
          <div className="hero-buttons">
            <WatchButton id={hero.id} />
            <SaveButton id={hero.id} />
          </div>
        </div>
        <div className="hero-bottom">
          <div className="carousel-dots">
            {heroes.map((h, i) => (
              <Button
                key={h.id}
                variant="icon"
                aria-label={`Show ${h.title}`}
                aria-pressed={slide === i}
                className={`carousel-dot ${slide === i ? "active" : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          <div className="hero-index">
            <span>
              0{slide + 1} <span className="opacity-50">/ 03</span>
            </span>
            <Button
              variant="icon"
              size="icon"
              aria-label="Previous featured story"
              title="Previous"
              onClick={() => setSlide((i) => (i + 2) % 3)}
            >
              <ChevronLeft size={15} />
            </Button>
            <Button
              variant="icon"
              size="icon"
              aria-label="Next featured story"
              title="Next"
              onClick={() => setSlide((i) => (i + 1) % 3)}
            >
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </section>
      <Section title="Continue Watching">
        <div className="rail">
          {["ashoka", "the-marathas", "high-himalaya"].map((id) => {
            const item = findTitle(id);
            return item ? (
              <Link
                key={id}
                to="/watch/$id"
                params={{ id }}
                search={{ episode: 2, season: 1, trailer: false }}
                className="media-card continue-card"
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="card-body">
                  <div className="continue-body">
                    <div>
                      <h3 className="card-title">{item.title}</h3>
                      <div className="meta">S1 E2 · 28 min left</div>
                    </div>
                    <span className="round-play">
                      <Play size={11} fill="currentColor" />
                    </span>
                  </div>
                  <div className="progress">
                    <div className="progress-fill" />
                  </div>
                </div>
              </Link>
            ) : null;
          })}
        </div>
      </Section>
      <Section title="Flagship Series" to="/series">
        <div className="rail five">
          <FlagshipCards />
        </div>
      </Section>
      <Section title="KATHAYAN Originals" to="/films">
        <div className="rail six">
          {originals.map((item) => (
            <TitleCard key={item.id} item={item} poster />
          ))}
        </div>
      </Section>
      <Section title="Explore Collections" to="/collections">
        <div className="rail five">
          {collections.map((c, i) => {
            const Icon = collectionIcons[i] ?? Landmark;
            return (
              <Link
                key={c.name}
                to="/collections"
                search={{ category: c.category }}
                className="media-card collection"
              >
                <img src={c.image} alt={c.name} loading="lazy" />
                <div className="collection-label">
                  <Icon size={16} />
                  {c.name}
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
      <Section title="Shorts" to="/shorts">
        <div className="rail six">
          {titles
            .filter((t) => t.kind === "Short")
            .map((item) => (
              <Link
                key={item.id}
                to="/watch/$id"
                params={{ id: item.id }}
                search={{ episode: 1, season: 1, trailer: false }}
                className="media-card short-card"
              >
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="short-title">
                  {item.title}
                  <span>{item.duration} · Short</span>
                </div>
              </Link>
            ))}
        </div>
      </Section>
      <Section title="Knowledge Notes" to="/notes">
        <NoteRail />
      </Section>
    </>
  );
}
