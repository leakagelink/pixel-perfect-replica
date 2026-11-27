import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/series")({
  head: () => pageHead("Series", "Browse the KATHAYAN sample series catalogue."),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  return <BrowsePage kind="Series" />;
}
