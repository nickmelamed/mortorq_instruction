// App.tsx -- exactly the shape scouting_app's App.tsx uses: one piece
// of state (activeSection) owned here, handed down to NavBar as a prop,
// changed via a callback NavBar calls, and one small useEffect syncing
// document.title to whatever's currently showing. If this all looks
// familiar, that's the point -- this module is applying 01-04 to a
// second, independent project, not learning anything new.

import { useEffect, useState, type ReactElement } from "react";
import { NavBar } from "./components/NavBar.tsx";
import { Home } from "./components/Home.tsx";
import { Sponsors } from "./components/Sponsors.tsx";
import { Roster } from "./components/Roster.tsx";
import { Contact } from "./components/Contact.tsx";
import { Footer } from "./components/Footer.tsx";
import { navItems, teamInfo } from "./data.ts";
import type { SectionId } from "./types.ts";

const sections: Record<SectionId, () => ReactElement> = {
  home: Home,
  sponsors: Sponsors,
  roster: Roster,
  contact: Contact,
};

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  useEffect(() => {
    const label = navItems.find((item) => item.id === activeSection)?.label ?? "";
    document.title = `${label} — Team ${teamInfo.number} ${teamInfo.name}`;
  }, [activeSection]);

  const ActiveSection = sections[activeSection];

  return (
    <>
      <header>
        <h1>
          Team {teamInfo.number} {teamInfo.name}
        </h1>
        <NavBar navItems={navItems} activeSection={activeSection} onSelect={setActiveSection} />
      </header>
      <main>
        <ActiveSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
