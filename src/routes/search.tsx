import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/search")({
  head: () => pageHead("Search", "Search sample series, films and knowledge notes."),
  component: SearchPage,
  pendingComponent: PageSkeleton,
});
