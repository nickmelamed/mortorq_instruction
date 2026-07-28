import { roster } from "../data.ts";

export function Roster() {
  return (
    <section aria-labelledby="roster-heading">
      <h2 id="roster-heading">Roster</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Subteam</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.subteam}</td>
              <td>{member.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
