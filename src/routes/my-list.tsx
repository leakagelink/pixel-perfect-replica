import { createFileRoute } from "@tanstack/react-router";
import { MyListPage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/my-list")({
  head: () => pageHead("My List", "Your saved sample stories on KATHAYAN."),
  component: MyListPage,
  pendingComponent: PageSkeleton,
});
