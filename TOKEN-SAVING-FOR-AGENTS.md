# TOKEN-SAVING-FOR-AGENTS.md
# Complete token-saving guide for Mon’s agents

**Follow this entire file on every request.**  
Owner: **Mon** (Designer). Tokens run out fast — prefer free tools and cheap Cursor models.

This file is the **single source of truth**. It combines: routing rules, DeepSeek how-to, local GPU LLM setup, Chinese/perspective rules, model strengths, best strategy, task charts, habits, and full price list.

Do not narrate this policy unless Mon asks about cost/tokens.

---

## Quick start (Mon + agents)

```
Chinese translate / 中文相关 / other perspective  →  DeepSeek WEBSITE (required)
Easy / no Cursor tools                            →  DeepSeek web or local LLM (LM Studio/Ollama)
Tiny edit                                         →  Tab or Cmd/Ctrl+K
Normal coding                                     →  Composer 2.5 STANDARD (not Fast)
Long Cloud Agent                                  →  Grok 4.6 (prefer over 4.5; 2× usage thru ~Aug 19, 2026)
Unsure                                            →  Auto → Cost
Need a plan                                       →  Sonnet 5 once → Composer to build
Composer stuck ~2×                                →  Sonnet → Opus 5 or GPT-5.6 Sol
Still failing                                     →  Ask Mon before Fable 5
```

**Tell other agents:**  
`Follow TOKEN-SAVING-FOR-AGENTS.md for every request.`

---

## 1. Golden rule

| Task type | Where | Cost |
|---|---|---|
| **Chinese translation / 中文相关 / other perspective** | **DeepSeek website** (required) | Free |
| Easy Q&A, rewrite, brainstorm, summarize, lists, ideas | DeepSeek web or **local LLM** | Free |
| Simple lookup already in Cursor | Luna / Auto Cost | Cheap |
| Edit code, terminal, MCP, multi-file agent | **Composer 2.5 standard** | Cursor pool |
| Hard architecture / deep debug | Sonnet → Opus/Sol only if needed | Expensive |

**If Cursor tools are not needed, do not spend Cursor tokens.**

---

## 2. Decision flowchart

```
Chinese / 中文 / other perspective?
  YES → DeepSeek website + paste-ready prompt → STOP Cursor spend

Easy / no file edits?
  YES → DeepSeek web or local LLM → paste-ready prompt → STOP

Needs Cursor tools (edit/run/MCP/git)?
  YES → Composer 2.5 standard or Auto Cost
  HARD / stuck ~2× → Sonnet → Opus 5 / GPT-5.6 Sol
  Nuclear rare → ask Mon before Fable 5
```

### Easy (offload)
Explain, rewrite, tone, brainstorm, summarize, translate, lists, non-repo research, “how do I…” with no file changes.

### Stay in Cursor
Edit project files, tests, terminal, git, MCP (Figma/Slack/Linear…), multi-step coding with verification.

---

## 3. Free tools (DeepSeek, local GPU LLM, fallbacks)

### 3.1 DeepSeek website — default free cloud

- URL: https://chat.deepseek.com  
- Free with account  
- Best for: writing, Q&A, brainstorm, summarize, translate, math, light coding advice (no local file edits)

#### MUST use DeepSeek website (Mon rule)

| Trigger | Examples | Mode tip |
|---|---|---|
| **Chinese translation** | EN↔中文, UI/marketing copy, subtitles | Instant; Expert if nuanced |
| **Chinese-related** | 中文写作、润色、用语、大陆/港台用词、中文 SEO、客服话术 | Instant or Expert |
| **Other perspective** | 另一角度、反方、换受众、多方案对比 | Expert + optional DeepThink |

Do **not** use local-only or Cursor Opus/Sol/Fable for these.

#### Agent steps
1. Ask Mon to open DeepSeek and confirm ready  
2. Give a **complete paste-ready prompt** (DeepSeek cannot see Cursor)  
3. Tell Mon Instant / Expert / Vision + DeepThink / Search if needed  
4. Continue in Cursor only for tools/code  

---

### 3.2 How to use DeepSeek (desktop)

Verified Aug 13, 2026: Chrome → chat.deepseek.com, account Mon Mon logged in.

**Open:** Chrome/Edge → https://chat.deepseek.com → log in if needed.

**Modes:**

| Mode | Use |
|---|---|
| **Instant** ⚡ | Fast everyday chat (default) |
| **Expert** 💎 | Harder reasoning / careful answers |
| **Vision** 👁️ | Images (attach file) |

**Toggles in input:** DeepThink (reasoning) · Search (live web)

**Send:** + New chat → pick mode → paste prompt → Enter or blue ↑  
Paste answer back to Cursor only if code/tools must continue.

**Reliable workflow = Mon pastes.** Don’t rely on cloud-agent automation to drive DeepSeek.

**Troubleshoot:** login → refresh/New chat → Expert+DeepThink if weak → Search for fresh facts.

---

### 3.3 Local free LLM on your PC (GPU)

Yes — with a GPU you can run free offline models (electricity + disk only).

| App | Best for | Link |
|---|---|---|
| **LM Studio** | Beginners (GUI) | https://lmstudio.ai |
| **Ollama** | CLI + local API | https://ollama.com |

**VRAM → model size (Q4):**

| VRAM | Size | Starters |
|---:|---|---|
| 8 GB | ~7–8B | Llama 3.1 8B, Qwen2.5 7B / Coder 7B |
| 12 GB | ~14B | Qwen2.5 14B, Gemma 3 12B |
| 16 GB | ~22–27B | Gemma 3 27B Q4 |
| 24 GB | ~32B | Qwen2.5 32B, DeepSeek-R1 32B distill |
| 48 GB+ | ~70B | Llama 70B Q4 |

**Ollama quick start:**
```bash
ollama pull llama3.1:8b
ollama run llama3.1:8b
```

**Fit in strategy:** Local for easy non-Chinese offline work. **Chinese / perspective → still DeepSeek website.** Local 7–14B ≠ Opus/Composer for big agents.

Tips: Q4_K_M first; modest context (2K–8K) on small GPUs; if very slow → model spilling to RAM → smaller model.

---

### 3.4 Other free cloud fallbacks

| Service | URL |
|---|---|
| Gemini free | https://gemini.google.com |
| ChatGPT free | https://chatgpt.com |
| Copilot | https://copilot.microsoft.com |

---

### 3.5 Copy-paste scripts

**A) Open DeepSeek (esp. Chinese / perspective)**
```text
This needs DeepSeek website (Chinese translation / 中文相关 / other perspective).
Please open https://chat.deepseek.com and log in (or confirm you’re already in).
Reply “ready” — I’ll give a paste-ready prompt.
```

**B) After ready**
```text
In DeepSeek: + New chat → Instant (or Expert if hard) → paste:

---
[FULL TASK PROMPT — all context; DeepSeek cannot see Cursor]
---

Optional: DeepThink / Search.
Paste the answer back here only if I should apply it in the project.
```

**C) Stay in Cursor**
```text
OK — staying in Cursor with Composer 2.5 / Auto Cost / Luna.
```

---

## 4. Cursor model routing

### Prefer
1. Composer 2.5 **standard** (not Fast) — Cursor pool  
2. Auto → **Cost**  
3. GPT-5.6 Luna / GPT-5.4 Nano / GPT-5 Mini  
4. **Grok 4.6** standard (prefer over 4.5; medium/low effort) — Cursor pool; long agents  

### Avoid for easy work
Fable 5 · Opus / Opus Fast · GPT-5.5 / Sol / Fast · Composer Fast · **Grok Fast** (2× list price — no “promo savings” on Fast) · Max/1M/Thinking High for tiny chats

### Grok status & details (updated Aug 13, 2026)

Sources: [Grok 4.5 docs](https://cursor.com/docs/models/grok-4-5) · [Introducing Grok 4.5](https://cursor.com/blog/grok-4-5) · [Grok 4.5 model card](https://cursor.com/blog/grok-4-5-model-card) · [Grok 4.6 docs](https://cursor.com/docs/models/grok-4-6) · [Introducing Grok 4.6](https://cursor.com/blog/grok-4-6)

#### Promo / release timeline
| Item | Status |
|---|---|
| **Grok 4.5 launch** | ~**July 8, 2026** (Cursor + SpaceXAI); model card **July 14, 2026** |
| **Grok 4.5 week-one perk** | Double included usage for first week at launch — **over** |
| **Grok 4.5 50% launch promo** | **Expired** (ran only through **July 14, 2026**) — do **not** expect half-price on 4.5 |
| **Grok 4.6 release** | **Aug 12, 2026** — prefer **4.6 over 4.5** for long agents + instruction following |
| **Grok 4.6 week-one perk** | **2× included usage** in Cursor + Grok Build (~through **Aug 19, 2026**). Docs also note a **50% launch discount** for one week from Aug 12 — check Usage dashboard; treat as time-boxed |
| **Still available** | Grok 4.5 remains selectable; Cursor **recommends 4.6** |

#### What Grok 4.5 is
- Joint **Cursor + SpaceXAI** mixture-of-experts model for **long-running agentic** work (not coding-only like Composer).
- Trained with **trillions of tokens of Cursor data** (codebases + developer–agent interactions) plus broader STEM / research / knowledge-work mix.
- RL on hard realistic environments: investigate → use tools → recover from mistakes → verify.
- Docs claim: solves multistep tasks in **under half the steps** of comparable frontier models; high token efficiency for its intelligence class.
- Pretraining cutoff: **January 2026** (model card).
- Intended domains: software engineering, data science, finance, research, legal, other computer-based work.
- **Not** for unsupervised high-stakes medicine/law/finance/safety-critical decisions (model card).
- Surfaces: Cursor (desktop/web/iOS/CLI/SDK), Grok Build, SpaceXAI API, OpenRouter / Vercel / Cloudflare, etc.
- Same **Cursor Models pool** as Composer 2.5 and Grok 4.6 (generous included usage; no Teams Cursor Token Rate).

#### Grok 4.5 strengths (when to use it)
| Good for | Why |
|---|---|
| Long Cloud Agent / multi-hour tool loops | Built for long trajectories; recover + verify |
| Broad knowledge work + coding in one session | Broader than Composer (STEM, research, office-style work) |
| Multistep tasks where fewer steps matter | Reasoning-efficient / agentic |
| Cursor Router “price-efficient” path | Router often uses Grok for routine git / DB / broad work |

| Prefer something else | Why |
|---|---|
| Tiny edits / Tab / Cmd+K | Overkill |
| Everyday tight coding loop | **Composer 2.5** cheaper/faster for grind |
| Chinese / 中文 / other perspective | **DeepSeek website** (Mon rule) |
| Hard architecture after Composer fails | Sonnet → Opus/Sol escalate |
| Best long-horizon **today** | **Grok 4.6** (improved IF + long-run vs 4.5) |

#### Effort levels (Grok 4.5)
| Effort | When |
|---|---|
| **high** (default) | Hardest work |
| **medium** | Balanced |
| **low** | Simpler / faster / cheaper token burn |

Effort changes **how much** the model thinks (tokens), not a separate $/token row — high effort can quietly cost more.  
**Start plan (India):** Grok 4.5 fixed at **medium** effort, non-fast. Effort + Fast require **Pro+**.

#### Pricing — Grok 4.5 (per 1M tokens)
| Variant | Input | Cache read (typical) | Output | Notes |
|---|---:|---:|---:|---|
| **Standard** | $2 | ~$0.50 | $6 | Cursor Models pool |
| **Fast** | $4 | — | **$12** (current docs) | 2× input; **not** a promo |

**Pricing confusion (community):** At 4.5 launch, Fast was advertised in the blog as **$4 / $18**. Current Cursor docs list Fast at **$4 / $12**. Forum users mixed up Fast-tier rates with “launch savings.” **Rule for agents:** Fast = **full 2×** — never treat Fast as discounted.

#### Grok 4.5 vs Grok 4.6 (pick for Mon)
| | **Grok 4.5** | **Grok 4.6** |
|---|---|---|
| Role | Long agents + broad knowledge work | Same + **better long-horizon** + instruction following |
| Visual / interactive first pass | Good | Stronger first passes (Cursor blog) |
| Effort levels | high / medium / low | **xhigh** / high / medium / low |
| Default speed (Pro+) | Standard unless you pick Fast | Docs: **Fast is default speed tier** on Pro+ — **watch cost** |
| List price | $2 / $6 · Fast $4 / $12 | Same $2 / $6 · Fast $4 / $12 (+ cache rates documented) |
| Active perk (Aug 13) | None (promos expired) | **2× included usage** thru ~Aug 19 |
| Mon default | Fallback if 4.6 unavailable | **Prefer 4.6 standard (not Fast)** for long agents |

**Agent tip (this week):** Long Cloud Agents → **Grok 4.6 standard**, not Fast, not 4.5. After ~Aug 19, still prefer **4.6 standard** over 4.5; use Composer for everyday coding.

### Subagents
Prefer: `composer-2.5` or `gpt-5.6-luna-high`  
Avoid: `claude-opus-*`, `claude-fable-*`, `gpt-5.5-*`, `gpt-5.6-sol-*`, `*-fast`

### Two pools
| Pool | Models | Note |
|---|---|---|
| **Cursor Models** | Composer 2.5, **Grok 4.6** (prefer), Grok 4.5 | More included usage; 4.6 has week-one 2× thru ~Aug 19 |
| **Other Models** | Claude, GPT, Gemini, Kimi… | Smaller $ pool — burns fast |
| **Auto Cost** | Router | Flat cheap default |

Plans Other Models included (approx): Pro $20 · Pro+ $70 · Ultra $400

---

## 5. Model strengths & best strategy

### 5.0 Best strategy (research consensus)

**Do not pin one expensive model.**  
**Plan smart → execute cheap → escalate only when stuck.**  
**Free-first for easy / Chinese / perspective.**

| Phase | Use |
|---|---|
| Chinese / 中文 / other perspective | DeepSeek **website** |
| Easy non-code | DeepSeek web or local LLM |
| Tiny edits | Tab / Cmd+K |
| Daily coding (~60–90%) | Composer 2.5 standard |
| Long Cloud Agent | **Grok 4.6 standard** (prefer over 4.5; 2× included usage thru ~Aug 19, 2026 — not Fast) |
| Unsure | Auto Cost |
| Plan (~5–10%) | Sonnet 5 (or Sol/Opus if hard) |
| Stuck (~5%) | Opus 5 or GPT-5.6 Sol after ~2 fails |
| Nuclear (&lt;1%) | Fable 5 — ask Mon |

**Why:** Planning needs judgment but few tokens; coding burns most tokens. Hybrid can save ~70–90% vs Opus-all-day.

**Anti-patterns:** Opus pinned all day · Agent+frontier for one-line CSS · 40-turn monster threads · Fast variants for easy work (Grok Fast is **2× list**, not a promo) · Assuming Grok 4.5 still has 50% off (expired July 14, 2026)

**Winning combo = Free-first + Composer default + Plan→Execute + Escalate ladder**

---

### 5.1 Strengths by model

| Model | Strengths | Best role |
|---|---|---|
| **DeepSeek web** | CN translation, 中文, alternate perspectives, writing, Q&A | Required for CN / perspective; easy offload |
| **Local LLM (7–14B)** | Offline drafts, private easy chat | Easy non-CN when GPU available |
| **Composer 2.5** | Fast agentic coding; multi-file; ~1/10 frontier cost | **Default coding worker** |
| **Grok 4.6** (prefer) / **4.5** | Long-running agents; broad knowledge work (not coding-only); Cursor pool; fewer steps; 4.6 better IF + visuals | Long Cloud Agent. **Prefer 4.6.** 4.5 promos expired. On Pro+, 4.6 may default to **Fast** — switch to standard. See §4 Grok details |
| **Auto Cost** | Flat cheap router | Default when unsure |
| **Auto Balance** | Better quality than Cost; cheaper than pinned Opus | Mixed days |
| **Auto Intelligence** | Near-Fable quality much cheaper than Fable | Hard days without Fable |
| **Luna / Nano / Mini** | Cheapest Other-Models chat | Budget in-Cursor Q&A |
| **GPT-5.6 Sol** | Planning, codebase comprehension, terminal-heavy | Plan / hard reasoning |
| **Sonnet 5** | Strong everyday coding + writing; plan mid | Plan + mid escalate |
| **Opus 5** | Hard refactors, clarifying Qs, devops/DB/perf | Hard multi-file |
| **Fable 5** | Peak debug / visual (Router) | Last resort only |
| **Haiku 4.5** | Cheap Claude | Boilerplate |
| **Gemini Flash/Pro** | Cheap / multimodal / big context | Budget / images |
| **Kimi / Codex** | Value coding / second opinion | Alternates |

**Cursor Router specialty map:** Grok = routine/git/DB · Sol = planning/comprehension · Opus = devops/DB/perf · Fable = debug/visual

---

### 5.2 Strategy comparison

| Strategy | Verdict for Mon |
|---|---|
| Always Auto Cost | Good baseline |
| Always Composer | Best manual coding default |
| Plan→Execute hybrid ★ | Best quality/$ |
| Escalate ladder ★ | Use with hybrid |
| Always Opus/Fable | Worst for tokens — avoid |
| Free-first (DeepSeek/local) ★ | Best for easy / CN / perspective |

---

### 5.3 Decide in 5 questions

| # | If YES → |
|---|---|
| Chinese / 中文 / other perspective? | DeepSeek website |
| No Cursor tools? | DeepSeek or local LLM |
| Tiny tweak? | Tab / Cmd+K |
| Routine multi-file coding? | Composer 2.5 standard |
| Hard / stuck after Composer? | Sonnet → Opus/Sol |

Else → Auto Cost.

---

### 5.4 Master chart — task → model

| Task | Best choice |
|---|---|
| Chinese translation / 中文 / other perspective | **DeepSeek website** (required) |
| Brainstorm, rewrite, summarize (no code) | DeepSeek or local LLM |
| Light research / “what is X” | DeepSeek or Gemini free |
| Tab / ghost text | Tab |
| Inline selection edit | Cmd/Ctrl+K |
| Bug in 1–2 files / UI polish / tests / simple API | Composer 2.5 standard |
| Plan feature | Sonnet (plan) → Composer (build) |
| Long Cloud Agent | **Grok 4.6 standard** (prefer) or Composer | 4.6 long-run + week-one 2×; not Fast; 4.5 promo gone |
| Complex multi-file + unclear conventions | Opus 5 or Sol |
| Architecture / migration | Opus or Sonnet |
| Algorithms / crypto / hard reasoning | Sol |
| Stubborn bug after 2 Composer fails | Sonnet → Opus / Codex |
| Docs / PR prose | DeepSeek or Sonnet |
| “Where is X?” in huge repo | Auto Cost / explore subagent |
| Config / YAML | Composer or Luna |
| Images (non-code) | Gemini free or DeepSeek Vision |
| Nuclear last resort | Fable 5 (ask Mon) |

---

### 5.5 Mode + Auto

| Mode | Model |
|---|---|
| Ask | DeepSeek outside, or Luna/Auto Cost inside |
| Plan | Sonnet or Auto Intelligence → then Composer |
| Agent | Composer 2.5 standard |
| Debug | Composer → escalate if stuck; new chat if long fail |

| Auto | Use |
|---|---|
| **Cost** | Everyday / budget default |
| **Balance** | Mixed quality days |
| **Intelligence** | Hard days without pinning Fable |

---

### 5.6 Escalation ladder

```
0. DeepSeek website     (Chinese / 中文 / other perspective)
1. DeepSeek or local    (easy / no tools)
2. Tab or Cmd+K
3. Composer 2.5 standard
4. Auto Cost
5. Sonnet 5
6. Opus 5 or GPT-5.6 Sol
7. Fable 5 (ask Mon)
```

---

### 5.7 Design / Mon shortcuts

| Work | Prefer |
|---|---|
| Ideas / critique / copy variants | DeepSeek (CN/perspective → website required) |
| Figma → code | Cursor + Composer (+ Figma MCP when coding) |
| Multi-file React/CSS | Composer 2.5 standard |
| Design system architecture | Short Sonnet/Opus plan → Composer |

---

## 6. More ways to save tokens

Every agent turn re-sends the whole thread. Cut noise early.

1. **One task = one chat** (Cloud Agents = one-off tasks)  
2. **Right tool size:** Tab &lt; Cmd+K &lt; Plan &lt; Agent  
3. **Tight context:** `@file` not `@codebase`; skeletons before full reads; filter logs  
4. **Ignore junk:** `.cursorignore` / `.cursorindexingignore` (`node_modules`, `dist`, locks…)  
5. **Short always-on rules** (this long guide is reference; keep alwaysApply tiny)  
6. **Prune unused MCP servers**  
7. **Plan → run once;** if wrong → revert + new chat  
8. **Billing:** default Composer/Auto Cost; on-demand off or $0 spend limit to hard-stop  
9. **Prompts:** specific goals; surgical diffs; scripts for big data  

---

## 7. Cursor prices (USD / 1M tokens)

Source: https://cursor.com/docs/models-and-pricing · Grok 4.6: https://cursor.com/blog/grok-4-6 (checked 2026-08-13)

**Notes**
- Composer Fast $3/$15 — avoid for cheap work; use standard $0.50/$2.50  
- **Grok 4.5:** launched ~Jul 8, 2026; week-one 2× usage + **50% promo ended Jul 14, 2026** — full list now  
- **Grok 4.5 / 4.6 list:** standard **$2/$6**; Fast **$4/$12** (current docs). Launch blog once listed 4.5 Fast as **$4/$18** — don’t use that outdated figure  
- **Grok 4.6** (Aug 12, 2026): prefer over 4.5; week-one **2× included usage** thru ~Aug 19; docs also mention **50% launch discount** for one week from Aug 12  
- Prompts ≥200K tokens may bill Grok at doubled rates ($4/$12)  
- **Pro+ note:** Grok 4.6 docs say **Fast is default speed** — manually pick **standard** to save  
- Sonnet 5 promo thru 2026-08-31: $2/$10  
- Teams +$0.25/1M CTR on third-party (not Auto Cost/Composer/Grok)  
- Forum note: Fast-tier ≠ launch savings — treat Fast as full 2× always

### Budget
| Model | In | Out | Pool |
|---|---:|---:|---|
| GPT-5.6 Luna | $0.20 | $1.20 | Other |
| GPT-5.4 Nano | $0.20 | $1.25 | Other |
| GPT-5 Mini | $0.25 | $2.00 | Other |
| GPT-5.1 Codex Mini | $0.25 | $2.00 | Other |
| Gemini 2.5 Flash | $0.30 | $2.50 | Other |
| Composer 2.5 standard | $0.50 | $2.50 | **Cursor** |
| Gemini 3 Flash | $0.50 | $3.00 | Other |
| GPT-5.4 Mini | $0.75 | $4.50 | Other |
| Kimi K2.7 Code | $0.95 | $4.00 | Other |
| Claude 4.5 Haiku | $1.00 | $5.00 | Other |

### Mid
| Model | In | Out | Pool |
|---|---:|---:|---|
| Auto Cost | $1.25 | $6.00 | Flat |
| GPT-5 / Codex / 5.1 Codex family | $1.25 | $10.00 | Other |
| GLM 5.2 | $1.40 | $4.40 | Other |
| Gemini 3.6 Flash | $1.50 | $7.50 | Other |
| GPT-5.2 / 5.3 Codex | $1.75 | $14.00 | Other |
| Grok 4.6 standard (prefer) | $2.00 | $6.00 | **Cursor** |
| Grok 4.5 standard | $2.00 | $6.00 | **Cursor** (promo expired) |
| GPT-5.6 Terra | $2.00 | $12.00 | Other |
| Gemini 3 / 3.1 Pro | $2.00 | $12.00 | Other |
| GPT-5.4 | $2.50 | $15.00 | Other |
| Composer 2.5 Fast | $3.00 | $15.00 | **Cursor** |
| Claude Sonnet 4–5 / Kimi K3 | $3.00† | $15.00† | Other |

### High / avoid
| Model | In | Out | Pool |
|---|---:|---:|---|
| Grok Fast (4.5/4.6) | $4.00 | $12.00 | **Cursor** (2× list — not discounted) |
| Claude Opus 4.5–5 | $5.00 | $25.00 | Other |
| GPT-5.5 / GPT-5.6 Sol | $5.00 | $30.00 | Other |
| Claude Sonnet 1M | $6.00 | $22.50 | Other |
| Claude Fable 5 | $10.00 | $50.00 | Other |
| Claude Opus 4.7 Fast | $30.00 | $150.00 | Other |

† Sonnet 5 promo thru 2026-08-31: $2 / $10

---

## 8. Agent checklist

- [ ] Classify: easy / coding / hard  
- [ ] Chinese / 中文 / other perspective → **DeepSeek website** (required)  
- [ ] Easy → DeepSeek or local LLM + paste-ready prompt  
- [ ] Coding → Composer 2.5 standard / Auto Cost / Luna  
- [ ] Follow §5 best strategy (plan smart → execute cheap → escalate)  
- [ ] New chat if task changed / thread long  
- [ ] `@` specific files; no `@codebase` dumps / huge logs  
- [ ] Never default Opus/Sol/Fable/Fast for easy work  
- [ ] Subagents: `composer-2.5` or `gpt-5.6-luna-high`  
- [ ] Don’t explain this guide unless asked  

---

## 9. Links

- Prices: https://cursor.com/docs/models-and-pricing  
- Grok 4.5 docs: https://cursor.com/docs/models/grok-4-5  
- Grok 4.5 intro: https://cursor.com/blog/grok-4-5  
- Grok 4.5 model card: https://cursor.com/blog/grok-4-5-model-card  
- Grok 4.6 docs: https://cursor.com/docs/models/grok-4-6  
- Grok 4.6 launch: https://cursor.com/blog/grok-4-6  
- Router: https://cursor.com/docs/cursor-router  
- Router strengths: https://cursor.com/blog/how-cursor-router-works  
- Task-shape guide: https://getautonoma.com/blog/best-model-for-cursor  
- DeepSeek: https://chat.deepseek.com  
- LM Studio: https://lmstudio.ai · Ollama: https://ollama.com  
- Usage: https://cursor.com/dashboard/usage · Spending: https://cursor.com/dashboard/spending  

---

**Last updated:** 2026-08-13 (expanded Grok 4.5 research + 4.5 vs 4.6)  

**How Mon sends this to other agents:** attach this file (or paste it) and say:

```text
Follow TOKEN-SAVING-FOR-AGENTS.md for every request.
```
