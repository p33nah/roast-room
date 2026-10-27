# Roast Room: source analysis and Codex port

## Original project

The original [p33nah/roast-room](https://github.com/p33nah/roast-room) has two cooperating parts: a council workflow run by the coding assistant and a local room viewer. The Chair gathers the decision brief, chooses advisors, guides the debate, scores the options, verifies quotes, and writes a verdict. The viewer watches a session folder and animates the same steps in a browser.

The viewer's file boundary is the central design choice. It consumes a stable session protocol rather than controlling the model runtime. That lets the council run from the assistant while the local app remains a small observer with replay and PDF output.

## Advisors and council flow

The roster contains twelve advisor seats across strategy, product, sales, marketing, hiring, operations, capital, leverage, acquisitions, leadership, consumer brand, and first-principles execution. Seven seats make up the default board; any seat can be selected for a council, which is capped at nine seats.

Each seat has a roster entry, a structured knowledge folder, canonical instructions, and optional portrait frames. The knowledge folder distills public material into frameworks, principles, positions, stories, voice notes, and a source index. Quotes carry source IDs and are checked against the knowledge folder. The instructions keep each advisor in their assigned perspective and identify the simulation as distinct from the real person.

The Chair asks for missing context about the decision, options, business, resources, success measure, and founder's lean. It recommends a council of five to seven advisors, assigns pillar weights, and keeps downside and dissenting views represented.

The full protocol has three rounds:

1. **Opening positions:** every advisor scores the options, states a call and confidence, and names risks and disagreements.
2. **Debate:** advisors respond to the strongest disagreements and revise their positions when the arguments warrant it.
3. **Ratification:** advisors vote on a draft resolution and may suggest amendments. The Chair records adopted changes and minority objections.

Quick mode seats four advisors and can stop after round two when scores converge and no advisor flags likely ruin risk. The Chair computes the final scores from pillar weights, applies risk overrides, checks attributed quotes, and writes the verdict. Single-seat consultations and board editing are also supported.

## Session protocol and room viewer

Each council writes an ordered collection of files under `sessions/<id>/`. `brief.md` and `council.json` establish the setup. Markdown round files contain advisor cards and Chair notes. `cruxes.json` and `draft.json` describe structured transitions. `verdict.md` contains the report, and `verdict.json` is written last to mark completion.

The watcher reads those files, reconstructs the session event stream, and sends it to the browser over server-sent events. The browser animates the discussion, supports live playback and replay, and renders the report as a PDF. It does not run models or make its own council decisions.

## Codex implementation

| Original role | Codex implementation |
|---|---|
| Chair skill | `.agents/skills/roast-room/SKILL.md`, invoked as `$roast-room` |
| Advisor creation skill | `.agents/skills/newroaster/SKILL.md`, invoked as `$newroaster` |
| Per-seat agent definitions | Canonical Markdown in `.agents/skills/roast-room/agents/` and named profiles in `.codex/agents/` |
| Interactive follow-up questions | Ordinary questions from the Chair in the Codex conversation |
| Parallel advisor work | Codex project agents; direct instructions or sequential fallback when a profile is not yet loaded |
| Session event contract | Preserved under `sessions/<id>/` |
| Viewer, replay, and PDF | Preserved as a local observer of Codex-written sessions |

The Codex skill is the Chair and the only writer of each session. Advisor agents return cards only, which prevents concurrent writes to round files. Profiles point to canonical Markdown instructions, and the Chair can use those same instructions directly if Codex has not loaded a profile created during the current session.

The profile generator writes stable TOML files, skips files that already match, and replaces changed content through a temporary file. The room checks that each roster seat has its instruction file, profile, and knowledge folder before exposing it.

## Compatibility notes

- Codex project skills use `.agents/skills/`; project agent profiles use `.codex/agents/`. See [Codex skills](https://learn.chatgpt.com/docs/build-skills) and [subagent configuration](https://learn.chatgpt.com/docs/agent-configuration/subagents).
- Newly generated agent profiles may require a fresh Codex session before the named agent is available. The skill includes a direct-instruction fallback.
- Skills are invoked by name, such as `$roast-room`. The former slash-command tool syntax is not used. Options such as `--quick`, `--seats`, and `--all` are interpreted by the skill from the user's request.
- The roster has twelve advisors and the council limit is nine. For an all-seat request, the Chair asks which advisors to leave out rather than silently truncating the board.
- Portrait generation is optional and requires `KIE_AI_API_KEY` plus the image-processing tools. Without them, the viewer renders a placeholder bust.

## References

- Original source: [p33nah/roast-room](https://github.com/p33nah/roast-room)
- [Codex skills](https://learn.chatgpt.com/docs/build-skills)
- [Codex custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents)
- [Codex non-interactive CLI](https://learn.chatgpt.com/docs/non-interactive-mode)
