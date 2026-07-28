// types.ts -- same idea as scouting_app's types.ts: shapes, not logic.

export type SectionId = "home" | "sponsors" | "roster" | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
}

export type SponsorTier = "title" | "gold" | "supporting";

export interface Sponsor {
  name: string;
  tier: SponsorTier;
  blurb: string;
}

export type Subteam = "Programming" | "Mechanical" | "Electrical" | "Business & Outreach";

export interface RosterMember {
  id: string;
  name: string;
  subteam: Subteam;
  role: string;
}
