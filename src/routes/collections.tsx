import { createFileRoute } from "@tanstack/react-router";
import { CollectionsPage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/collections")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () =>
    pageHead(
      "Explore Collections",
      "Explore history, culture, science, people and nature in the KATHAYAN sample catalogue.",
    ),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  const { category } = Route.useSearch();
  return <CollectionsPage category={category ?? "All"} />;
}
