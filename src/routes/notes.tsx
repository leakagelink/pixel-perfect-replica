import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/notes")({
  head: () =>
    pageHead(
      "Knowledge Notes",
      "Research, field and citation notes from the sample KATHAYAN editorial desk.",
    ),
  component: NotesPage,
  pendingComponent: PageSkeleton,
});
