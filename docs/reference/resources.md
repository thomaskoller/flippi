---
icon: lucide/link
---

# Resources

The sources this site is built on, plus the best places to go deeper.

## Primary sources (the two this site is anchored to)

- **Official Flipper Zero documentation** — <https://docs.flipper.net/zero>
  Hardware specs, every built-in app, file formats, and the CLI.
- **mp-flipper — MicroPython on Flipper Zero** — <https://ofabel.github.io/mp-flipper/>
  The `flipperzero` module reference and runnable examples that every
  <span class="fz-chip run">PYTHON</span> snippet here is adapted from.
    - Source & examples: <https://github.com/ofabel/mp-flipper>

## Official Flipper

- Website & firmware updates — <https://flipperzero.one/>
- qFlipper (desktop) & mobile apps — <https://flipperzero.one/update>
- Flipper Lab app catalogue (install uPython here) — <https://lab.flipper.net/>
- Firmware source — <https://github.com/flipperdevices/flipperzero-firmware>

## Going deeper by topic

| Topic | Resource |
|---|---|
| Sub-GHz protocols & `.sub` | Flipper docs → Sub-GHz; community protocol notes |
| MIFARE Classic / CRYPTO1 | the `mfkey`/`nested` attack literature; Proxmark3 wiki |
| 1-Wire / iButton | Maxim/Analog Devices DS1990A datasheet; [1-Wire on Wikipedia](https://en.wikipedia.org/wiki/1-Wire) |
| DuckyScript | Hak5 DuckyScript reference |
| FIDO/U2F | the FIDO Alliance specifications; WebAuthn guides |
| Host-side automation | [pyFlipper](https://github.com/wh00hw/pyFlipper) CLI wrapper |

## Community firmware

These unlock region-restricted features and add apps. Read the
[Ethics & Law](../getting-started/ethics-and-law.md) note first — unlocking a frequency in
software does not make transmitting on it legal.

- Unleashed — <https://github.com/DarkFlippers/unleashed-firmware>
- RogueMaster — <https://github.com/RogueMaster/flipperzero-firmware-wPlugins>
- Momentum — <https://momentum-fw.dev/>

## A note on images

This site uses **hand-authored SVG/Canvas diagrams** rather than rehosting product photos,
to keep it license-clean and tuned for teaching. For official hardware photography and pinout
diagrams, see the [official docs](https://docs.flipper.net/zero) directly.

## Credits & licenses

This site is original educational writing. Where it reuses or builds on others' work:

- **MicroPython code** — the `flipperzero` snippets are adapted from the
  [mp-flipper](https://github.com/ofabel/mp-flipper) examples, used under the **MIT License**,
  *Copyright (c) 2024 Oliver Fabel*.
- **MathJax** (equation rendering, via CDN) — Apache License 2.0.
- **Icons & emoji** ship with the [Zensical](https://zensical.org/)/Material theme:
  [Lucide](https://lucide.dev/) icons (ISC License) and
  [Twemoji](https://github.com/jdecked/twemoji) (graphics CC-BY 4.0).

!!! note "Trademarks"
    *Flipper Zero* is a trademark of Flipper Devices Inc. Product, protocol, and company names
    (MIFARE, KeeLoq, YubiKey, etc.) are trademarks of their respective owners and are used here
    **nominatively**, for identification and education only. This is an independent,
    unofficial project with no affiliation to or endorsement by Flipper Devices.

---

!!! note "Spotted an error?"
    Technical accuracy matters here. If a claim drifts from the
    [official docs](https://docs.flipper.net/zero) or the
    [mp-flipper reference](https://ofabel.github.io/mp-flipper/), trust the source and flag it.
