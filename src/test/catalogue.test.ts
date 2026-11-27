import { describe, it, expect } from "vitest";
import {
  flagships,
  heroes,
  plans,
  searchCatalogue,
  toggleSaved,
  findTitle,
  episodesFor,
} from "@/lib/catalogue";
describe("Sample catalogue rules", () => {
  it("contains exactly the five requested flagships", () => {
    expect(flagships.map((t) => t.title)).toEqual([
      "BHARAT",
      "GYAANBHOOMI",
      "VIRASAT",
      "ANVESHAN",
      "JANPATH",
    ]);
  });
  it("features Nalanda, Konark and High Himalaya", () => {
    expect(heroes.map((t) => t.title)).toEqual(["NALANDA", "KONARK", "HIGH HIMALAYA"]);
  });
  it("offers only the four requested sample plans", () => {
    expect(plans.map((p) => p.name)).toEqual(["Free", "Premium", "Family", "Institutional"]);
  });
  it("saves and removes a title without duplicates", () => {
    expect(toggleSaved([], "nalanda")).toEqual(["nalanda"]);
    expect(toggleSaved(["nalanda"], "nalanda")).toEqual([]);
  });
  it("keeps knowledge note search results separate from films", () => {
    const result = searchCatalogue("Arthashastra");
    expect(result.notes[0]?.id).toBe("arthashastra");
    expect(result.films).toHaveLength(0);
  });
  it("returns an empty result for an unknown search", () => {
    expect(searchCatalogue("qwertyunknown")).toEqual({ series: [], films: [], notes: [] });
  });
  it("includes four Nalanda episodes", () => {
    expect(findTitle("nalanda")?.duration).toBe("4 episodes");
    expect(episodesFor("nalanda")).toHaveLength(4);
  });
});
