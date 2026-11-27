import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/kathayan/browse";
import { PageSkeleton } from "@/components/kathayan/shell";
import { pageHead } from "@/lib/catalogue";
export const Route = createFileRoute("/profile")({
  head: () =>
    pageHead("Your KATHAYAN", "Switch sample profiles and explore disconnected sample plans."),
  component: ProfilePage,
  pendingComponent: PageSkeleton,
});
