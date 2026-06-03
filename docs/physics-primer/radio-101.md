---
icon: lucide/radio-tower
---

# How Radios Talk (Without Wires)

!!! tip "Last foundation page"
    You know waves ([page 1](waves-101.md)) and signals ([page 2](electricity-signals-101.md)).
    Now the magic question: how do 1s and 0s leap across a room — or a parking lot — with **no
    wire at all**? Spoiler: it's the same wave, just launched into the air.

## Wiggle a charge, make a wave

Here's the one fact that makes radio possible:

> **When you wiggle electric charge up and down a wire, it sends out an invisible wave that
> travels at the speed of light.**

That wire is an **antenna**. A second wire some distance away feels that passing wave and a
tiny matching wiggle appears in it. That second wire is the **receiving antenna**. You just
sent energy across empty space — no string attached.

<canvas class="anim" data-type="emwave"></canvas>
<p class="fz-figcaption">A radio wave: an electric field (bright) and a magnetic field (dim) that take turns and race outward at the speed of light.</p>

- The **transmitter** wiggles charge in its antenna on purpose.
- The **receiver** listens for the faint wiggle that wave induces in its own antenna.

!!! example "Everyday example: two buckets and a rope"
    Tie a rope between two buckets of water. Slosh one bucket and the rope carries the
    disturbance to the other, which starts to slosh too. Radio is that — but the "rope" is
    invisible and made of electric and magnetic fields, and it works even with nothing in
    between.

## The carrier — a steady hum you scribble on

A receiver can't pick a faint random wiggle out of all the noise in the air. So radios first
switch on a **carrier**: a clean, steady wave at one exact frequency — like holding a single
long note on a kazoo. By itself the carrier says nothing. The message is added by *changing*
the carrier slightly — louder/quieter, or a touch higher/lower. That changing is called
**modulation**, and it gets its own [whole page next](modulation.md).

!!! example "Everyday example: a flashlight in a dark field"
    Shine a flashlight steadily at a friend across a field — that's your **carrier** (it
    proves you're there, but says nothing). Now **blink** it: short-short-short = "come here."
    You just *modulated* the light. A radio transmitter does the same to its carrier wave,
    millions of times a second.

## Tuning = picking a frequency = choosing a "station"

The air is full of carriers at once — your neighbour's garage remote, a weather station, a
hundred phones. How does a receiver hear just one? It **tunes**: it sharpens itself to listen
only at **one frequency** and ignores the rest.

!!! example "Everyday example: FM radio"
    "Tune to 95.5 FM" literally means *listen at 95.5 megahertz and nothing else.* Every
    station broadcasts on its own frequency so they don't trample each other. When the Flipper
    captures a garage remote, the first job is the same: find **which frequency** the remote
    shouts on (usually 433.92 MHz) and tune to it. The Flipper's "Frequency Analyzer" does
    exactly that.

So a complete radio link is just four ideas you now own:

1. **Antenna** — a wire that launches/catches the wave.
2. **Carrier** — a steady wave at a chosen **frequency** (the "station").
3. **Modulation** — tiny changes to the carrier that spell out the bits.
4. **Tuning** — the receiver sharpening in on that one frequency.

## How far does it reach? (the part that decides everything)

The Flipper's frequencies span an enormous range, and **frequency decides reach**:

- **Low frequencies** (125 kHz door fobs) have giant wavelengths and barely radiate — you
  have to **touch or tap**. Great for a card you don't want a stranger reading from across
  the room.
- **Higher frequencies** (433 MHz garage remotes) radiate happily and fly **across the
  street** — convenient for you, but also capturable from a distance.

That "tap-only vs across-the-street" split has a name — **near field vs far field** — and the
[EM Spectrum page](em-spectrum.md) makes it precise. It's the single most useful idea on the
whole site.

!!! note "What the Flipper can — and can't — do on the air"
    The Flipper has a real radio for **Sub-GHz** (those ~300–928 MHz remotes), plus separate
    front-ends for **NFC**, **125 kHz RFID**, and **infrared**. It also has **Bluetooth**, but
    *only* to talk to the phone app and act as a wireless keyboard/remote — it **cannot sniff
    or scan other Bluetooth devices** on stock firmware. Wi-Fi and other exotic radios aren't
    built in at all; they need add-on boards. We're honest about this throughout.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "What actually launches a radio wave into the air?",
    "options": ["The battery", "Charge being wiggled up and down an antenna", "The screen", "Bluetooth only"],
    "answer": 1,
    "explain": "A wiggling charge in a wire (the antenna) radiates an electromagnetic wave at the speed of light."
  },
  {
    "q": "What is a 'carrier'?",
    "options": ["The message itself", "A steady wave at one frequency that the message is added onto", "The antenna", "A type of battery"],
    "answer": 1,
    "explain": "The carrier is a clean steady tone; modulation tweaks it to encode the bits. By itself it carries no info."
  },
  {
    "q": "'Tuning to 433.92 MHz' means…",
    "options": ["transmitting at full power", "listening at that one frequency and ignoring the rest", "encrypting the signal", "charging the battery"],
    "answer": 1,
    "explain": "Tuning = sharpening the receiver to a single frequency, like choosing a radio station."
  },
  {
    "q": "Can a stock Flipper sniff your phone's Bluetooth traffic?",
    "options": ["Yes, that's its main feature", "No — its Bluetooth is only for the app and acting as a keyboard/remote", "Only at 433 MHz", "Only with the battery removed"],
    "answer": 1,
    "explain": "Stock firmware uses BLE just for the mobile app and HID. It does not scan or sniff other BLE devices."
  }
]
</script>
</div>

---
*Next: [The EM Spectrum](em-spectrum.md) — putting numbers on 'near' vs 'far'.*
