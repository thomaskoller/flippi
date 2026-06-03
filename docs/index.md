---
icon: lucide/radio
hide:
  - navigation
  - toc
---

# Flipper Zero Lab

<p class="fz-tagline">
A <strong>physics-first</strong> field manual for the Flipper Zero. Every signal the
device touches — radio, RFID, NFC, infrared, 1-Wire — gets the same treatment:
<em>the physics that makes it work</em>, <em>what the Flipper actually does</em>, and a
<em>hands-on lab</em> against a device you own.
</p>

!!! danger "Read this first"
    Everything here is for **authorized testing and education only**. Reading your own
    transit card is fine; cloning your neighbour's car fob is a crime. The line is
    *ownership and explicit permission*. See **[Ethics & Law](getting-started/ethics-and-law.md)**.

## How this site is built

Each signal chapter follows the same three beats, so once you learn the rhythm you can
skim to whatever you need:

<div class="grid cards" markdown>

-   :microscope: __1 · Theory & Physics__

    ---

    The frequency band, the modulation scheme, and the governing equations — with
    animated diagrams of the actual waveforms. Written for someone who likes a
    derivation, not just a recipe.

-   :satellite: __2 · On the Flipper__

    ---

    How the built-in app works, the anatomy of the on-disk file format
    (`.sub`, `.nfc`, `.rfid`, `.ir`, …), the serial CLI, and **real MicroPython**
    wherever the device can actually run it.

-   :test_tube: __3 · Real-World Lab__

    ---

    An authorized exercise against an everyday object — your TV, your own access fob,
    a cheap 433 MHz doorbell — capped with a "Test Your Knowledge" quiz.

</div>

## What's actually scriptable?

The Flipper runs MicroPython through the community [mp-flipper](https://ofabel.github.io/mp-flipper/)
port. It exposes the *peripherals*, **not** the radio stacks. This site is honest about
the difference, and labels every technique:

<span class="fz-chip run">PYTHON</span> genuinely runnable in MicroPython &nbsp;
<span class="fz-chip file">FILE</span> driven by a native Flipper file format &nbsp;
<span class="fz-chip cli">CLI</span> done over the serial console

| Capability | Infrared | GPIO / ADC / PWM | Speaker / LED / Vibro | Sub-GHz | NFC | 125 kHz RFID | iButton |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| MicroPython | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Native app + file format | ✅ | — | — | ✅ | ✅ | ✅ | ✅ |

## Suggested path

1. **[Device Tour](getting-started/device-tour.md)** — what's inside the plastic dolphin.
2. **[EM Spectrum](physics-primer/em-spectrum.md)** & **[Modulation](physics-primer/modulation.md)** — the physics you'll reuse everywhere.
3. **[Infrared](signals/infrared.md)** & **[GPIO](signals/gpio.md)** — start here for code; these run real Python.
4. The radios — **[Sub-GHz](signals/sub-ghz.md)**, **[125 kHz RFID](signals/rfid-125khz.md)**, **[NFC](signals/nfc.md)** — file formats and theory.
5. **[Bad USB](signals/bad-usb.md)**, **[iButton](signals/ibutton.md)**, **[U2F](signals/u2f.md)** — the rest of the toolkit.

!!! note "Sources of truth"
    Technical claims are anchored to the official **[Flipper docs](https://docs.flipper.net/zero)**
    and the **[mp-flipper API reference](https://ofabel.github.io/mp-flipper/)**. Where this
    site shows MicroPython, it's adapted from the port's own examples.
