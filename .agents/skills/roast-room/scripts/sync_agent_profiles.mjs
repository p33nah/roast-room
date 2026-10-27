#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const SKILL = path.join(ROOT, ".agents", "skills", "roast-room");
const ROSTER = path.join(SKILL, "roster.json");
const PROMPTS = path.join(SKILL, "agents");
const PROFILES = path.join(ROOT, ".codex", "agents");
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? undefined : args[index + 1];
};

function profileFor(seat) {
  if (!/^[a-z][a-z0-9]{1,15}$/.test(seat.key || "")) throw new Error(`invalid seat key: ${seat.key}`);
  const promptPath = path.join(PROMPTS, `council-${seat.key}.md`);
  if (!fs.existsSync(promptPath)) throw new Error(`missing canonical advisor instructions: ${path.relative(ROOT, promptPath)}`);

  const name = `council-${seat.key}`;
  const description = `${seat.short || seat.name} is the Roast Room advisor for ${seat.pillar}. Use this agent for decisions about ${seat.question}`;
  const developerInstructions = [
    `Read and follow .agents/skills/roast-room/agents/council-${seat.key}.md.`,
    `Read the advisor brain under .agents/skills/roast-room/brains/${seat.slug}/ as those instructions specify.`,
    "Return only the requested advisor card. Never edit or create files. You are a simulation built from public work, not the person.",
  ].join("\n");

  return [
    `name = ${JSON.stringify(name)}`,
    `description = ${JSON.stringify(description)}`,
    `developer_instructions = ${JSON.stringify(developerInstructions)}`,
    "",
  ].join("\n");
}

const roster = JSON.parse(fs.readFileSync(ROSTER, "utf8"));
let seats;
if (args.includes("--all")) {
  seats = roster.seats || [];
} else if (option("key")) {
  const key = option("key").toLowerCase();
  const existing = (roster.seats || []).find((seat) => seat.key === key);
  if (existing) {
    seats = [existing];
  } else {
    const required = ["name", "slug", "pillar", "question"];
    const missing = required.filter((field) => !option(field));
    if (missing.length) {
      console.error(`Missing required options for a new seat: ${missing.map((field) => `--${field}`).join(", ")}`);
      process.exit(2);
    }
    seats = [{
      key,
      name: option("name"),
      short: option("short") || option("name"),
      slug: option("slug"),
      pillar: option("pillar"),
      question: option("question"),
    }];
  }
} else {
  console.error("Usage: node sync_agent_profiles.mjs --all | --key <key> [--name ... --short ... --slug ... --pillar ... --question ...]");
  process.exit(2);
}

fs.mkdirSync(PROFILES, { recursive: true });
let written = 0;
let unchanged = 0;
for (const seat of seats) {
  const output = profileFor(seat);
  const target = path.join(PROFILES, `council-${seat.key}.toml`);
  if (fs.existsSync(target) && fs.readFileSync(target, "utf8") === output) {
    unchanged += 1;
    continue;
  }
  const temporary = `${target}.tmp`;
  fs.writeFileSync(temporary, output, "utf8");
  fs.renameSync(temporary, target);
  written += 1;
}

console.log(`Wrote ${written} Codex advisor profiles; ${unchanged} already matched their source instructions.`);
