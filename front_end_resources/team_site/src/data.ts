// data.ts -- the site's actual content, as typed data instead of markup.
// Every section below reads from here and maps over it, instead of
// having its content hardcoded into JSX directly. Change a sponsor's
// name or add a new roster member by editing this file alone -- no
// component needs to change to reflect it. Replace the placeholder
// values here with your real team's information.

import type { NavItem, RosterMember, Sponsor } from "./types.ts";

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "sponsors", label: "Sponsors" },
  { id: "roster", label: "Roster" },
  { id: "contact", label: "Contact" },
];

export const teamInfo = {
  number: "1515",
  name: "Mortorq",
  mission:
    "We design, build, and compete with a robot every season, and we teach every skill that takes -- mechanical, electrical, programming, and everything it takes to run a team like a real organization.",
  founded: "2004",
};

export const sponsors: Sponsor[] = [
  {
    name: "Placeholder Robotics Supply Co.",
    tier: "title",
    blurb: "Our title sponsor, supplying motors, controllers, and drivetrain components every season.",
  },
  {
    name: "Placeholder Manufacturing",
    tier: "gold",
    blurb: "Machine shop access and mentorship on manufacturing our custom mechanisms.",
  },
  {
    name: "Placeholder Credit Union",
    tier: "gold",
    blurb: "Funding for our travel and competition registration costs.",
  },
  {
    name: "Placeholder Hardware",
    tier: "supporting",
    blurb: "In-kind donations of fasteners and shop supplies.",
  },
];

export const roster: RosterMember[] = [
  { id: "roster-1", name: "Replace with a real name", subteam: "Programming", role: "Software Lead" },
  { id: "roster-2", name: "Replace with a real name", subteam: "Mechanical", role: "Drivetrain Lead" },
  { id: "roster-3", name: "Replace with a real name", subteam: "Electrical", role: "Wiring Lead" },
  { id: "roster-4", name: "Replace with a real name", subteam: "Business & Outreach", role: "Sponsorship Lead" },
];
