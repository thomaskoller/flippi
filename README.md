# Flipper Zero Lab

An interactive, **physics-first** learning portal for the [Flipper Zero](https://flipperzero.one/).
It is built like a *"Flipper Zero for Dummies"* course, but with enough depth in the
underlying RF/EM physics to satisfy a reader with a science background.

Every signal type the Flipper supports gets a chapter with the same three-part rhythm:

1. **Theory & Physics** — the frequency band, the modulation, and the governing equations.
2. **On the Flipper** — how the built-in app works, the file-format anatomy, the CLI,
   and **MicroPython code** wherever the [mp-flipper](https://ofabel.github.io/mp-flipper/)
   port actually supports it.
3. **Real-World Lab** — an *authorized* exercise against an everyday device you own,
   plus a "Test Your Knowledge" quiz.

Interactive extras: animated physics diagrams (EM waves, OOK/ASK vs FSK, IR carrier,
NFC load modulation), a mock Flipper screen UI simulator, and per-chapter quizzes.

## Sources

- Official documentation — <https://docs.flipper.net/zero>
- MicroPython port (`flipperzero` module) — <https://ofabel.github.io/mp-flipper/>

## Tech stack

- [Zensical](https://zensical.org/) static site generator (the Material for MkDocs successor).
- [uv](https://docs.astral.sh/uv/) for Python environment and dependency management
  (`pyproject.toml` + `uv.lock`).

## Local development

Install [uv](https://docs.astral.sh/uv/getting-started/installation/), then:

```bash
uv sync                       # create .venv and install the locked dependencies

uv run zensical serve         # live preview at http://localhost:8000
uv run zensical build         # static output in ./site
```

`uv sync` reads `pyproject.toml`/`uv.lock` and provisions an isolated `.venv` for you — no
manual `venv`/`pip` steps. To change dependencies, edit `pyproject.toml` and run `uv lock`.

## Deploying

`uv run zensical build --clean` emits a static site into `site/`, which can be hosted on any
static host (GitHub Pages, Netlify, Vercel, S3, …). This repo already includes a GitHub Pages
workflow at `.github/workflows/docs.yml` that builds with uv and deploys on every push.

## Credits & attribution

- The MicroPython `flipperzero` snippets are adapted from the
  [mp-flipper](https://github.com/ofabel/mp-flipper) examples — **MIT License,
  Copyright (c) 2024 Oliver Fabel**.
- Equation rendering uses **MathJax** (Apache-2.0). Theme icons/emoji are **Lucide** (ISC)
  and **Twemoji** (CC-BY 4.0), bundled with the Zensical/Material theme.
- All diagrams are hand-authored SVG/Canvas; no product photos or logos are rehosted.

*Flipper Zero* is a trademark of Flipper Devices Inc. This is an independent, unofficial
project, used nominatively for education, with no affiliation or endorsement.

## License & disclaimer

Released under the **[MIT License](LICENSE)** — © 2026 Thomas Koller. The adapted
mp-flipper snippets remain under their original MIT License (© 2024 Oliver Fabel), as
noted above and in `LICENSE`.

Educational content for **authorized** security testing only. Many techniques described
here are illegal to perform against devices and systems you do not own or have explicit
permission to test. Know your local laws.
