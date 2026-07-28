// NavBar.tsx -- props down (navItems, activeSection), events up
// (onSelect), exactly like scouting_app's ScoutingForm/onEntrySaved.
// No router library here: with four sections and no need for real URLs
// per page, "which section is active" is just a piece of state in App,
// the same as everything else in this app's data flow.

import type { NavItem, SectionId } from "../types.ts";

interface NavBarProps {
  navItems: NavItem[];
  activeSection: SectionId;
  onSelect: (section: SectionId) => void;
}

export function NavBar({ navItems, activeSection, onSelect }: NavBarProps) {
  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={item.id === activeSection ? "nav-link active" : "nav-link"}
              aria-current={item.id === activeSection ? "page" : undefined}
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
