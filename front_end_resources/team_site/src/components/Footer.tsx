import { teamInfo } from "../data.ts";

export function Footer() {
  return (
    <footer>
      <p>
        Team {teamInfo.number} {teamInfo.name} — built in {new Date().getFullYear()} as part of the web
        fundamentals primer.
      </p>
    </footer>
  );
}
