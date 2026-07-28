// scripts/summarize-team.ts -- a standalone CLI script. This file is
// never imported by anything under src/, so Vite never bundles it into
// the app the browser downloads. Run it directly with Node:
//
//   ANTHROPIC_API_KEY=sk-ant-... npm run summarize -- 1515 "fast cycles, missed 2 climbs" "strong defense, slow auto"
//
// Why this is a script and not a React component: an API key used from
// inside a browser-shipped bundle is not a secret anymore -- anyone can
// open dev tools, look at the Network tab or the bundle itself, and
// read it straight out. A script that runs on your own machine (or,
// later, on a real backend) and reads its key from an environment
// variable never sends that key to a browser at all. See concept.md.

import Anthropic from "@anthropic-ai/sdk";

interface TeamSummary {
  playstyleSummary: string;
  strengths: string[];
  weaknesses: string[];
  pickListRationale: string;
}

async function summarizeTeam(teamNumber: string, notes: string[]): Promise<TeamSummary> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    // output_config.format constrains the response to this exact JSON
    // shape -- the same idea 02_why_typescript's ValidationResult used
    // for "this is definitely one of these shapes," now enforced by the
    // model's output instead of by TypeScript's compiler.
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            playstyleSummary: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            weaknesses: { type: "array", items: { type: "string" } },
            pickListRationale: { type: "string" },
          },
          required: ["playstyleSummary", "strengths", "weaknesses", "pickListRationale"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: `You are helping an FRC alliance-selection team evaluate Team ${teamNumber} for a pick list.
Below are raw scouting notes from multiple matches, written quickly by different scouts during competition --
expect fragments, abbreviations, and inconsistent detail.

${notes.map((note, i) => `Match note ${i + 1}: ${note}`).join("\n")}

Summarize this team's playstyle, list their apparent strengths and weaknesses, and give a one-paragraph
rationale for where they might fit on a pick list. Base every claim only on the notes above -- if the notes
don't support a claim, don't make it.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Expected a text block in the response.");
  }

  return JSON.parse(textBlock.text) as TeamSummary;
}

async function main() {
  const [teamNumber, ...notes] = process.argv.slice(2);
  if (!teamNumber || notes.length === 0) {
    console.error('Usage: npm run summarize -- <teamNumber> "<note 1>" "<note 2>" ...');
    process.exitCode = 1;
    return;
  }

  const summary = await summarizeTeam(teamNumber, notes);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
