import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/kathayan/admin";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/admin")({
  head: () =>
    pageHead(
      "Studio workspace",
      "The KATHAYAN sample editorial admin interface. No live accounts or private data.",
    ),
  component: AdminPage,
  pendingComponent: PageSkeleton,
});
