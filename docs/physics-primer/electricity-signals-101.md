---
icon: lucide/zap
---

# Electricity & Signals 101

!!! tip "Heads up: this page is dense on purpose"
    This is the chapter that turns "electricity" into "**a signal the Flipper can make and
    read**." We go from raw charge all the way to bits-on-a-wire, with the real definitions and
    a few equations. Take it slowly — every idea here is reused on every signal page. New to
    waves? Skim [Waves 101](waves-101.md) first; the absolute-beginner water analogy is kept
    below as a sidebar.

## 1 · What electricity actually is

Everything electrical starts with **electric charge** ($Q$, measured in **coulombs, C**).
Charge comes in two signs; the mobile one in metals is the **electron** (negative). Like
charges repel, opposites attract, with a force given by **Coulomb's law**:

$$
F = k\,\frac{q_1 q_2}{r^2}, \qquad k \approx 8.99\times10^{9}\ \tfrac{\text{N·m}^2}{\text{C}^2}
$$

A charge doesn't just sit there — it fills the space around it with an **electric field**
$\mathbf{E}$ (units **volts per metre, V/m**), defined as the force a tiny test charge would
feel per unit charge:

$$
\mathbf{E} = \frac{\mathbf{F}}{q}
$$

A **conductor** (a wire, a PCB trace, an antenna) is special because it holds a *sea of free
electrons* that can drift the instant a field is applied. Hold that picture — it's literally
what the Flipper pushes on.

!!! note "Why this matters for the Flipper"
    Every pin, every trace, and the Sub-GHz antenna are this same electron sea. "Doing radio"
    or "blinking an LED" both reduce to **applying a field that makes those electrons move the
    way you want.**

## 2 · Voltage, current, resistance — the working definitions

Three quantities describe what those electrons are doing.

| Quantity | Symbol & unit | Definition | Water analogy |
|---|---|---|---|
| **Voltage** | $V$, volts (J/C) | energy given to each coulomb of charge, $V = W/q$ | pressure |
| **Current** | $I$, amps (C/s) | rate of charge flow, $I = \dfrac{dQ}{dt}$ | flow rate |
| **Resistance** | $R$, ohms | how much the path opposes flow | a narrow pipe |

They're tied together by **Ohm's law** and the **power** law:

$$
V = I\,R, \qquad P = V I = I^2 R
$$

!!! example "Beginner sidebar: water in pipes"
    Voltage = **pressure** pushing the water; current = **flow rate** (how much actually
    moves per second); a resistor = a **narrow** stretch of pipe; a battery = the **pump**.
    The Flipper runs at about **3.3 V** — gentle pressure, which is why it's safe to probe.

<canvas class="anim" data-type="current"></canvas>
<p class="fz-figcaption">Current is charge in motion. Voltage is the push (field) that drives it; resistance limits how much flows.</p>

??? note "Go deeper: electrons crawl, but signals fly"
    The **drift velocity** of electrons in a wire is astonishingly slow — often less than a
    millimetre per second. Yet a light turns on instantly when you flip the switch. The
    resolution: you're not waiting for *an* electron to travel the wire; the **electric field**
    that pushes the whole electron sea propagates down the conductor at a sizeable fraction of
    the speed of light $c$. The *signal* is the field, not the individual electron. This is
    exactly why a 433 MHz waveform can race along an antenna that's only centimetres long.

## 3 · The bridge: how electricity *becomes* a signal

Here's the step the rest of the internet usually skips. A **signal** is any physical quantity
deliberately **varied in time** to carry information — written $s(t)$. In electronics, that
quantity is almost always **the voltage on a wire as a function of time, $V(t)$.**

So the real question is: *what physically sets $V(t)$?* A **switch**. Specifically a
**transistor** — a voltage-controlled valve (a MOSFET) that, on command, connects a wire
either to the supply rail ($V_+$, "high") or to ground ($0\,\text{V}$, "low"):

```text
        V+  ──[ top switch ]──┐
                              ├──●── the wire  →  V(t)
        GND ──[ bottom sw. ]──┘
   control: close top → wire = V+ (a "1")
            close bottom → wire = 0 V (a "0")
```

A **controller** — the Flipper's **microcontroller (MCU)** — opens and closes billions of
these tiny switches per second. The opening/closing is paced by a **clock**: a quartz
**crystal** oscillator ticking at a fixed rate. So a signal is *manufactured*: the MCU, on
each clock tick, decides "high or low?" and the transistor slams the wire to that voltage. The
resulting voltage-vs-time **is** the signal.

<canvas class="anim" data-type="digital"></canvas>
<p class="fz-figcaption">The literal output of switching: the wire is slammed high or low on each clock tick. That V(t) is the signal — here it spells 1 0 1 0 1 1 0 0.</p>

!!! note "How the Flipper does it (concretely)"
    A **GPIO pin** is exactly this switch. In MicroPython, `gpio_set_pin(pin, True)` ties the
    pin to **3.3 V**; `gpio_set_pin(pin, False)` ties it to **0 V**. That voltage-over-time is
    a signal you authored. **PWM** is the hardware doing the toggling automatically at a set
    rate; the **speaker/DAC** sets a *continuously variable* voltage instead of just two
    levels. The **STM32WB55**'s core clock (up to **64 MHz**) is the ceiling on how fast it can
    change the line — and therefore on the fastest signal it can synthesise directly. See
    [GPIO](../signals/gpio.md).

## 4 · From $V(t)$ to bits — encoding and logic levels

A waveform is just voltage until two parties **agree what it means** — that agreement is a
**protocol**. For digital signals the agreement has two parts:

1. **Levels:** a voltage above a threshold (say $> 2.0\,\text{V}$) counts as **1**; below
   another (say $< 0.8\,\text{V}$) counts as **0**. The gap between them is the **noise
   margin** — wiggle room so a little interference can't flip a bit.
2. **Timing:** *when* do you read the line? Either a shared **clock** says "sample now," or
   the data is **self-clocked** (the encoding guarantees regular edges — that's what
   [Manchester](modulation.md) buys you).

!!! example "Everyday example: Morse code is V(t) for humans"
    SOS is `· · · — — — · · ·`. One lamp, two states (on/off), yet any message fits — because
    meaning lives in the **timing** of the on/off-ness. A Flipper Sub-GHz capture is the same
    idea: a list of how long the carrier was on, then off, then on… just millions of times
    faster. That's why `.sub` files are literally timing lists.

## 5 · Analog vs digital — two disciplines for varying $V(t)$

=== "Analog — any value"

    $V(t)$ is allowed to slide through **every** value — a microphone's output, a temperature
    sensor, a radio's raw received waveform. Natural and information-rich, but **noise adds
    directly to the value** and can never be fully removed. *Flipper:* the **ADC**
    (`adc_read_pin_voltage`) measures an analog voltage — e.g. a potentiometer knob — and turns
    it into a number (this is **quantization**: rounding a smooth value to the nearest step).

=== "Digital — only two bands"

    $V(t)$ is restricted to **high** or **low** with the noise-margin gap between them. A
    single high/low decision is one **bit**. *Flipper:* GPIO read/write, the CC1101's decoded
    bitstream, every file format on the SD card.

### Why digital survives where analog rots

Because only two bands are legal, a receiver can **regenerate** a smudged signal: it asks
"closer to high or to low?" and snaps it back to a perfect 1 or 0. Each hop **resets** the
noise instead of accumulating it. (The headroom is measured as **signal-to-noise ratio**,
quoted in decibels — see [the dB section on the EM page](em-spectrum.md).)

!!! example "Everyday example: a photocopy of a photocopy"
    Copy a **grey watercolour** ten times → mush (analog: errors pile up). Copy **black text**
    ten times → still crisp (digital: each copy is snapped back to black-or-white). Your bank
    card, the garage remote and the TV remote are digital for exactly this reason.

A door fob's "40-bit ID" is now demystified: it's **forty high/low decisions** in a row — a
number with about a trillion possibilities ([RFID](../signals/rfid-125khz.md)).

## 6 · Edges aren't free → bandwidth (the hinge to radio)

Real wires have **capacitance**. A capacitor stores charge, $Q = C V$, and it takes time to
charge through a resistance — the **RC time constant**:

$$
\tau = R C
$$

That's why a "square" edge is never truly vertical; it rounds off over a few $\tau$. The
deep consequence: **a sharper, faster edge contains higher-frequency content.** Any signal
$V(t)$ can be built from a sum of pure sine waves (the **Fourier** idea), and the faster you
make $V(t)$ change, the higher the frequencies you need — that span of frequencies is the
signal's **bandwidth**. Slow data = narrow; fast/sharp data = wide.

!!! note "Why this matters for the Flipper"
    Bandwidth is the through-line of the whole site: the Sub-GHz **presets** (`AM270` vs
    `AM650`) are just *different bandwidths*; [Modulation](modulation.md) is all about fitting
    a signal's bandwidth into a channel. And it foreshadows the next page — a **fast-changing
    current** is a charge that's **accelerating**, and accelerating charges throw off radio
    waves.

## 7 · Where this is heading

You can now state the chain: a controller sets a **time-varying voltage** $V(t)$ → that drives
a **time-varying current** $I(t)$ in a wire → which means the charges are **accelerating** →
and accelerating charge **radiates an electromagnetic wave**. That last leap — voltage on a
trace becoming a wave in the air — is radio, and it's next.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "In electronics, what IS a (digital) signal, physically?",
    "options": ["A magnetic field in the battery", "The voltage on a wire deliberately varied over time, V(t)", "The resistance of the circuit", "The colour of the LED"],
    "answer": 1,
    "explain": "A signal is a quantity varied in time to carry information; in electronics that's V(t), the wire voltage versus time."
  },
  {
    "q": "What component actually 'produces' that V(t) by slamming the wire high or low?",
    "options": ["A resistor", "A transistor/switch, toggled by the clocked MCU", "The antenna", "The SD card"],
    "answer": 1,
    "explain": "A transistor acts as a voltage-controlled switch connecting the wire to V+ or GND; the MCU flips it on each clock tick. A GPIO pin is exactly this."
  },
  {
    "q": "Why can a digital signal be cleaned up after noise but an analog one cannot?",
    "options": ["Digital uses more power", "Only two legal levels exist, so a smudged value is snapped back to the nearest one", "Digital is encrypted", "Analog has no voltage"],
    "answer": 1,
    "explain": "Regeneration: with just high/low allowed, each stage rounds the value back to a perfect 1 or 0, resetting the noise."
  },
  {
    "q": "A faster, sharper edge in V(t) implies…",
    "options": ["lower frequencies and less bandwidth", "higher-frequency content and more bandwidth", "no change in frequency", "a bigger battery"],
    "answer": 1,
    "explain": "By the Fourier view, sharp/fast changes need high-frequency sine components — i.e. more bandwidth. RC rounding is the physical limit."
  },
  {
    "q": "Electrons drift through copper at well under 1 mm/s, yet signals are near-instant. Why?",
    "options": ["Electrons actually move at light speed", "The pushing electric field propagates down the wire near c; the signal is the field, not one electron", "The wire is hollow", "Resistance speeds them up"],
    "answer": 1,
    "explain": "The information rides the field, which propagates at a large fraction of c. Individual electrons barely move."
  }
]
</script>
</div>

---
*Next: [How Radios Talk](radio-101.md) — turning V(t) on a trace into a wave in the air.*
