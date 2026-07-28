import type { Sponsor } from "../types.ts";

interface SponsorCardProps {
  sponsor: Sponsor;
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  return (
    <article className={`sponsor-card tier-${sponsor.tier}`}>
      <p className="tier-label">{sponsor.tier} sponsor</p>
      <h3>{sponsor.name}</h3>
      <p>{sponsor.blurb}</p>
    </article>
  );
}
