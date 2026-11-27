import { createFileRoute, notFound } from "@tanstack/react-router";
import { DetailPage } from "@/components/kathayan/detail";
import { PageSkeleton } from "@/components/kathayan/shell";
import { findTitle, pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/series_/$id")({
  loader: ({ params }) => {
    const title = findTitle(params.id);
    if (!title) throw notFound();
    return title;
  },
  head: ({ loaderData }) =>
    pageHead(
      loaderData?.title ?? "Story unavailable",
      loaderData?.description ?? "This sample story was not found.",
    ),
  component: Page,
  pendingComponent: PageSkeleton,
});
function Page() {
  const { id } = Route.useParams();
  return <DetailPage key={id} id={id} series={true} />;
}
