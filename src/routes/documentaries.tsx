import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/documentaries")({
  head: () => pageHead("Documentaries", "Browse the KATHAYAN sample documentaries catalogue."),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  return <BrowsePage kind="Documentary" />;
}
