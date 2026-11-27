import { createFileRoute, notFound } from "@tanstack/react-router";
import { PlayerPage } from "@/components/kathayan/player";
import { PageSkeleton } from "@/components/kathayan/shell";
import { findTitle, pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/watch/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    episode: Math.max(1, Math.min(4, Number(search["episode"]) || 1)),
    season: Math.max(1, Math.min(2, Number(search["season"]) || 1)),
    trailer: search["trailer"] === true || search["trailer"] === "true",
  }),
  loader: ({ params }) => {
    const title = findTitle(params.id);
    if (!title) throw notFound();
    return title;
  },
  head: ({ loaderData }) =>
    pageHead(
      `Watch ${loaderData?.title ?? "story"}`,
      "The KATHAYAN sample cinema player. No video stream is connected.",
    ),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  return <PlayerPage id={id} {...search} />;
}
