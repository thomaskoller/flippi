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

!!! tip "Complete beginner? Start from zero 👇"
    Never touched physics or electronics? Don't skip ahead — these three short, analogy-first
    chapters give you *everything* you need, with no maths beyond "times" and "divide":

    1. **[Waves & Vibrations 101](physics-primer/waves-101.md)** — amplitude, frequency, wavelength (ocean waves & dog whistles).
    2. **[Electricity & Signals 101](physics-primer/electricity-signals-101.md)** — voltage, current, bits, analog vs digital (water in pipes & Morse code).
    3. **[How Radios Talk](physics-primer/radio-101.md)** — antennas, carriers, tuning (a flashlight across a field).

    After those, every other page on the site will just *click*.

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

!!! note "What the stock Flipper *can't* do (so we don't pretend it can)"
    - **Bluetooth** is only for the mobile app and acting as a wireless keyboard/remote (HID).
      It **does not sniff, scan, or jam** Bluetooth. ([docs](https://docs.flipper.net/zero/bluetooth))
    - **Wi-Fi, sub-GHz jamming, and NRF24** are **not** built in — they need separate add-on
      boards (e.g. an ESP32 or NRF24 module on the GPIO header) and are out of scope here.
    - **Rolling codes** (modern car/garage remotes) can be *received* but **not cloned or
      replayed** on official firmware — that's the security working as designed.

## Suggested path

1. **From zero:** **[Waves 101](physics-primer/waves-101.md)** → **[Electricity & Signals 101](physics-primer/electricity-signals-101.md)** → **[How Radios Talk](physics-primer/radio-101.md)** — the absolute basics, no background needed.
2. **[Device Tour](getting-started/device-tour.md)** — what's inside the plastic dolphin.
3. **[EM Spectrum](physics-primer/em-spectrum.md)** & **[Modulation](physics-primer/modulation.md)** — the physics you'll reuse everywhere (now with a gentle on-ramp and the heavy maths tucked away).
4. **[Infrared](signals/infrared.md)** & **[GPIO](signals/gpio.md)** — start here for code; these run real Python.
5. The radios — **[Sub-GHz](signals/sub-ghz.md)**, **[125 kHz RFID](signals/rfid-125khz.md)**, **[NFC](signals/nfc.md)** — file formats and theory.
6. **[Bad USB](signals/bad-usb.md)**, **[iButton](signals/ibutton.md)**, **[U2F](signals/u2f.md)** — the rest of the toolkit.

!!! note "Sources of truth"
    Technical claims are anchored to the official **[Flipper docs](https://docs.flipper.net/zero)**
    and the **[mp-flipper API reference](https://ofabel.github.io/mp-flipper/)**. Where this
    site shows MicroPython, it's adapted from the port's own examples.
