// Sponsors.tsx -- composition again: this component owns the grid
// layout and the "map data to cards" step, SponsorCard owns one card.
// Same shape as scouting_app's EntryList -> EntryCard.

import { sponsors, teamInfo } from "../data.ts";
import { SponsorCard } from "./SponsorCard.tsx";

export function Sponsors() {
  return (
    <section aria-labelledby="sponsors-heading">
      <h2 id="sponsors-heading">Sponsors</h2>
      <p>Team {teamInfo.number} couldn't compete without the organizations below.</p>
      <div className="sponsor-grid">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
    </section>
  );
}
