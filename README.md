# Roast Room for Codex

![The Roast Room](docs/room.jpg)

Roast Room turns a difficult business decision into a scored debate among simulated advisors. Twelve seats ship with sourced brains drawn from each person's public work. The Chair recommends a council, asks for missing context, runs up to three rounds, checks attributed quotes, and writes a verdict with a one-click PDF. A local web app plays the council live and replays saved sessions.

See [the architecture notes](docs/codex-port.md) for how the Codex skill, project agents, and local viewer fit together.

## The council

| Seat | Pillar | The question they own |
|---|---|---|
| Jeff Bezos | Strategy and decisions | Is this the right bet, and how reversible is it? |
| Paul Graham | Product and startups | Do people actually want this, and is it growing? |
| Alex Hormozi | Offers, pricing, and sales | Will people pay, how much, and how do we close? |
| Gary Vaynerchuk | Marketing and attention | Where does the attention come from? |
| Dan Martell | People, hiring, and founder time | Who does this, and what does it cost your calendar? |
| Gino Wickman | Operations and scaling | Can the business run this without you holding it together? |
| Warren Buffett | Money and capital | What does it do to cash, risk, and long-term value? |
| Naval Ravikant | Leverage and wealth | Does this build leverage and equity you own, or rent out your time? |
| Codie Sanchez | Buying and owning small businesses | Should you build this, or buy something that already works? |
| Leila Hormozi | Leadership and scaling teams | Can your team and leadership carry this, and who has to change? |
| Sara Blakely | Consumer product and brand from zero | Will customers love it enough to sell it for you, without outside money? |
| Elon Musk | First principles and execution speed | What is the real constraint, and can we cut steps and build it faster? |

The saved default board has seven seats. Five more are available for the Chair to recommend or for you to select.

## Requirements and setup

- Codex with project skills and custom agents enabled.
- Node.js 20 or newer for the local room. No npm dependencies are required.

Clone this repository, open Codex in its root, then start the room:

```bash
npm start
```

Open <http://localhost:4730>. In the Codex conversation for this repository, invoke `$roast-room` and describe your decision. The Chair asks for missing facts and board preferences in ordinary conversation. The app is optional: the council still runs and writes its report when the viewer is closed.

## Run a council

Invoke `$roast-room` with a concrete choice. Include the decision, two or three options, revenue and cash, team size, deadline, what success means, and your current lean. For example:

```text
$roast-room I run a coaching business at $30k a month with 15 clients at $2,000 each.
Should I raise to $3,500 for everyone, raise for new clients only, or keep $2,000?
Close rate is about 50% and I have $40k in the bank. Success is $45k a month by March.
I'm leaning toward raising for everyone because I'm underpaid.
```

The full mode seats five to seven advisors and runs three rounds. Quick mode uses four seats and usually two rounds. You can ask for named seats, use the saved default board, or request everyone; councils are capped at nine seats, so the Chair asks you to select when the roster has more than nine.

The skill also supports a single-seat consult (`$roast-room ask hormozi ...`) and board changes (`$roast-room board`). These are natural-language skill requests in Codex, not shell commands. Each completed council is saved under `sessions/` with `verdict.md` and the viewer data. The room offers replay and PDF download.

## Add an advisor

Invoke `$newroaster` with a person's name. It researches lawful public sources, compiles a sourced brain, verifies quotations, writes canonical advisor instructions, generates a Codex profile, and registers the seat only after its files exist. It can also create the room portrait when `KIE_AI_API_KEY` and the optional image tooling are configured.

The raw source corpus stays in the ignored `build/` folder. Only the compact brain and source list are intended for the repository. Newly generated project agent profiles are in `.codex/agents/`; Codex may need a new session to discover a profile added during the current run. Until then, the Chair can delegate using the canonical instructions directly.

The local room is a viewer and replay app. Start councils from the Codex conversation with `$roast-room`; the skill writes the session files that the room displays.

## Source and privacy

Advisor seats are simulations based on public work. They are not the people, do not speak for them, and are not affiliated with or endorsed by them. Every attributed quotation must appear in the seat's sourced brain. The raw fetched corpus and your generated council sessions are gitignored; check your own working copy before sharing it.

## Main files

| Path | Purpose |
|---|---|
| `.agents/skills/roast-room/` | Chair workflow, roster, prompts, scoring, sourced advisor brains |
| `.agents/skills/newroaster/` | Advisor research, extraction, portrait, and registration workflow |
| `.agents/skills/roast-room/agents/` | Canonical advisor instructions used by Codex project agents |
| `.codex/agents/` | Named Codex project agent profiles, one per seat |
| `app/` | Local session viewer and PDF generator |
| `sessions/` | Example councils and locally saved councils |
| `docs/codex-port.md` | Analysis of the original and Codex adaptation |

Built by AI Automation Society. The code is MIT licensed; see `LICENSE`. The PDF builder bundles jsPDF (MIT) and Montserrat (SIL Open Font License); their licenses are included alongside the app assets.
