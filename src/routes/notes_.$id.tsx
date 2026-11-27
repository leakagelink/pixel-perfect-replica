import { createFileRoute, notFound } from "@tanstack/react-router";
import { NoteDetailPage } from "@/components/kathayan/detail";
import { PageSkeleton } from "@/components/kathayan/shell";
import { notes, pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/notes_/$id")({
  loader: ({ params }) => {
    const note = notes.find((n) => n.id === params.id);
    if (!note) throw notFound();
    return note;
  },
  head: ({ loaderData }) =>
    pageHead(
      loaderData?.title ?? "Note unavailable",
      loaderData?.description ?? "This sample knowledge note was not found.",
    ),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  const { id } = Route.useParams();
  return <NoteDetailPage id={id} />;
}
