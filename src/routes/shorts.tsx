import { createFileRoute } from "@tanstack/react-router";
import { BrowsePage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/shorts")({
  head: () => pageHead("Shorts", "Browse the KATHAYAN sample shorts catalogue."),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  return <BrowsePage kind="Short" />;
}
