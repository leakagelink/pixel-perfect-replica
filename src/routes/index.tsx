import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/kathayan/home";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Home",
      "Explore KATHAYAN sample originals, flagship series, documentary films, shorts, and knowledge notes.",
    ),
  component: HomePage,
  pendingComponent: PageSkeleton,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
