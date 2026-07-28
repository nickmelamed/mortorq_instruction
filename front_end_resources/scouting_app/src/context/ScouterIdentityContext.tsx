// context/ScouterIdentityContext.tsx -- the app's one genuine use of
// Context. A scout sitting at one station enters many matches in a row;
// re-typing their own name into every single entry is exactly the kind
// of busywork this exists to remove.
//
// Why this needed Context and the TeamLookup/EntryList props didn't:
// scouterName is read by ScouterBadge (next to Header), by ScoutingForm
// (to attach it to a new entry), and by EntryCard -- nested two levels
// down, under EntryList, a component that has no reason to know a
// scouter's name exists. Threading scouterName through EntryList's props
// just so EntryCard could read it would mean EntryList takes a prop it
// never uses, purely to pass it along -- the exact shape 03_react_core
// said doesn't justify Context at 2-3 shallow levels, but does once a
// value has to skip a component that doesn't care about it.

import { createContext, useContext, useState, type ReactNode } from "react";

interface ScouterIdentity {
  scouterName: string;
  setScouterName: (name: string) => void;
}

const ScouterIdentityContext = createContext<ScouterIdentity | null>(null);

export function ScouterIdentityProvider({ children }: { children: ReactNode }) {
  const [scouterName, setScouterName] = useState("");
  return (
    <ScouterIdentityContext.Provider value={{ scouterName, setScouterName }}>
      {children}
    </ScouterIdentityContext.Provider>
  );
}

// Throwing here instead of quietly returning a default value is
// deliberate: a component that reads this hook outside the provider has
// a real bug (it will never see identity updates from anywhere else),
// and a thrown error at the exact call site says so immediately instead
// of silently misbehaving three components away.
export function useScouterIdentity(): ScouterIdentity {
  const context = useContext(ScouterIdentityContext);
  if (context === null) {
    throw new Error("useScouterIdentity() must be called inside a <ScouterIdentityProvider>.");
  }
  return context;
}
