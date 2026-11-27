import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/films")({
  head: () => pageHead("Films", "Browse the KATHAYAN sample films catalogue."),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  return <BrowsePage kind="Film" />;
}
