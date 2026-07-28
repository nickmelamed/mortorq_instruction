import { teamInfo } from "../data.ts";

export function Home() {
  return (
    <section aria-labelledby="home-heading">
      <h2 id="home-heading">
        Team {teamInfo.number} — {teamInfo.name}
      </h2>
      <p>{teamInfo.mission}</p>
      <dl className="fact-grid">
        <div>
          <dt>Team number</dt>
          <dd>{teamInfo.number}</dd>
        </div>
        <div>
          <dt>Founded</dt>
          <dd>{teamInfo.founded}</dd>
        </div>
      </dl>
    </section>
  );
}
