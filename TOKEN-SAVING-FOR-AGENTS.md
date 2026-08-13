# Token-saving for agents

Rules for long autonomous runs (large scaffolds, multi-hour `npm test`, doubled phase batches). Prefer **wall-clock wait** over **chat tokens**.

## Do

1. **Commit + push before tests.** Do not re-scaffold or re-edit while the suite runs.
2. **One background waiter.** Start `npm test` once; wait with long sleeps (30–60+ min). Do not narrate every poll.
3. **Status checks: rare and tiny.** Prefer one shell line:
   `wc -l /tmp/npm-test-*.log; pgrep -c -f vitest; free -g | awk 'NR==2{print $3"/"$2}'`
4. **Report only on milestones.** Start, ~50%, done/fail. No per-phase chatter.
5. **Reuse prior scaffold.** Transform the last script; do not rewrite waves from scratch.
6. **Fail fast on syntax.** `node --check` scaffold before generating tens of thousands of files.
7. **Cap doubling when suite > ~6h.** Prefer fixed batch size (e.g. 12k–24k) over 2× forever unless the user insists.
8. **Delete one-off transform helpers** after use; do not leave them in the commit unless useful.
9. **If tests still run:** sleep; do not invent new batches until green or user says otherwise.

## Do not

- Parallel `npm test` / duplicate vitest processes
- Re-read huge README / emotionMorphs / full face-live mid-wait
- Create PRs, force-push, or amend unless asked
- Paste long test tails unless diagnosing a failure
- Ask clarifying questions when the continue pattern is established

## Current Extreme a11y continue pattern

| Step | Action |
|------|--------|
| 1 | Double last end phase → next range |
| 2 | Transform prior scaffold → new `scripts/scaffold-disney-extreme-phases-*.mjs` |
| 3 | Run scaffold (catalog + face-live + tests + README + FACE_LIVE) |
| 4 | Commit + push `cursor/amoji-character-jp-female-0f5c` |
| 5 | `npm test` once; wait; confirm green; short summary |

## Waiter snippet

```bash
LOG=/tmp/npm-test-CURRENT.log
while pgrep -f "vitest run" >/dev/null; do sleep 600; done
tail -20 "$LOG"
```

## When stuck

- OOM / FATAL → stop, report memory, do not restart blindly
- Failures → fix minimal legacy substring tests; re-run only if needed
- Missing repo → say so; do not invent clones
