---
icon: lucide/zap
---

# Electricity & Signals 101

!!! tip "Still zero physics required"
    Before we send waves through the air, let's understand the wiggles inside the wires.
    This page explains electricity with a water analogy and shows what a "signal" actually
    is. If you can picture water in a pipe, you already get it.

## Electricity is just water in pipes

You don't need to know what an electron "really" is. For everything on this site, this
picture is enough:

| Electricity | Water analogy | What it means |
|---|---|---|
| **Voltage** (volts, V) | water **pressure** | how hard the electricity is pushed |
| **Current** (amps, A) | water **flow rate** | how *much* electricity flows past per second |
| **Wire** | **pipe** | the path it flows along |
| **Resistor** | a **narrow** bit of pipe | something that limits the flow |

<canvas class="anim" data-type="current"></canvas>
<p class="fz-figcaption">Charges drifting down a wire. Voltage is the pressure pushing them; current is how many flow past per second.</p>

!!! example "Everyday example: a garden hose"
    Pinch the end of a hose (more pressure = more **voltage**) and the water shoots further.
    Open a fat tap (more flow = more **current**) and the bucket fills faster. A battery is
    just a "pump" that supplies the pressure. The Flipper runs on about **3.3 volts** — gentle
    pressure, which is why it's safe to poke at.

That's genuinely all the electrical theory you need for the [GPIO chapter](../signals/gpio.md),
where you'll blink a real LED.

## What is a "signal"?

A **signal** is a deliberate change in something — voltage, light, a radio wave — used to
carry **information**. The trick is always the same: agree in advance what each change *means*.

- A **light switch** flicked on and off is a signal.
- A **doorbell** is a one-bit signal: "someone's here."
- **Morse code** turns a single lamp into letters by using short and long flashes.

!!! example "Everyday example: Morse code is a Flipper in slow motion"
    SOS is `· · · — — — · · ·` — three short flashes, three long, three short. The lamp only
    does **two things** (on, off), yet it can spell any message just by *timing* the
    on/off-ness. Hold that thought: most of the Flipper's radio captures are exactly this —
    on/off timing — just millions of times faster.

## Analog vs digital — the big idea

There are two ways to send a signal, and the difference shapes the whole device.

=== "Analog — smooth"

    The signal can be **any** value, sliding smoothly — like a dimmer knob that goes from
    fully off to fully bright through every brightness in between. A vinyl record and an old
    radio are analog. It's natural, but **noise sticks to it**: a little crackle changes the
    value and you can't tell the crackle from the music.

=== "Digital — only steps"

    The signal is only allowed a few fixed levels — usually just **two**: high or low, on or
    off, which we call **1** and **0**. A single 1-or-0 is one **bit**. Pile up bits and you
    can represent anything — numbers, text, a door code.

<canvas class="anim" data-type="digital"></canvas>
<p class="fz-figcaption">A digital signal: only two levels, high (1) and low (0). Here it spells 1 0 1 0 1 1 0 0.</p>

### Why digital wins for the Flipper

Because there are only two allowed levels, a digital signal can get **smudged by noise and
still be readable** — the receiver just asks "closer to high or to low?" and snaps it back to
a clean 1 or 0.

!!! example "Everyday example: a photocopy of a photocopy"
    Photocopy a **grey watercolour** ten times and it turns to mush (that's analog — errors
    pile up). Photocopy **black text** ten times and it's still perfectly readable (that's
    digital — each copy gets snapped back to "black or white"). Your bank card, the garage
    remote, and the TV remote are all digital for exactly this reason.

### Bits, briefly

Eight bits make a **byte**. A door fob that holds a 40-bit ID is just 40 ones-and-zeros in a
row — a number with about a trillion possibilities. When the [RFID page](../signals/rfid-125khz.md)
says "EM4100 is a 40-bit ID," now you know that's *forty on/off decisions* and nothing more
mysterious.

## Where this is heading

So: electricity is pressure-and-flow, and a digital signal is a stream of on/off bits. The
last foundation question is — *how do those bits jump across thin air with no wire at all?*
That's radio, and it's next.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "In the water analogy, voltage is like…",
    "options": ["the flow rate", "the pressure pushing the water", "the length of the pipe", "the colour of the water"],
    "answer": 1,
    "explain": "Voltage = pressure (push). Current = flow rate (how much actually moves). Wire = pipe."
  },
  {
    "q": "What is a single 'bit'?",
    "options": ["A volt", "One on/off (1 or 0) decision", "A type of antenna", "A megahertz"],
    "answer": 1,
    "explain": "A bit is one binary digit: high/low, on/off, 1/0. Stack many bits to represent anything."
  },
  {
    "q": "Why does a digital signal survive noise better than an analog one?",
    "options": ["It's transmitted with more power", "The receiver snaps each value back to the nearest of just two levels", "It's always encrypted", "It uses a bigger antenna"],
    "answer": 1,
    "explain": "Only two legal levels means a smudged value can be confidently rounded back to a clean 1 or 0."
  },
  {
    "q": "Morse code proves an important point. Which one?",
    "options": ["You need many wires to send a message", "Even a single on/off lamp can carry any message through TIMING", "Analog is always better", "Light can't carry information"],
    "answer": 1,
    "explain": "On/off plus timing = information. That's exactly how many Flipper radio captures work."
  }
]
</script>
</div>

---
*Next: [How Radios Talk](radio-101.md) — sending those bits through thin air.*
