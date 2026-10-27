import path from "node:path";
import { fileURLToPath } from "node:url";

export const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO_ROOT = path.resolve(APP_ROOT, "..");
export const ROOM_SKILL_DIR = path.join(REPO_ROOT, ".agents", "skills", "roast-room");
export const NEWROASTER_SKILL_DIR = path.join(REPO_ROOT, ".agents", "skills", "newroaster");
export const BRAINS_DIR = path.join(ROOM_SKILL_DIR, "brains");
export const ROSTER = path.join(ROOM_SKILL_DIR, "roster.json");
export const AGENT_PROMPTS_DIR = path.join(ROOM_SKILL_DIR, "agents");
export const CODEX_AGENTS_DIR = path.join(REPO_ROOT, ".codex", "agents");
export const SESSIONS_DIR = path.join(REPO_ROOT, "sessions");

