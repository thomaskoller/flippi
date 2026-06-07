---
icon: lucide/radio-tower
---

# How Radios Talk (Without Wires)

!!! tip "The steep one — and the most rewarding"
    [Electricity & Signals 101](electricity-signals-101.md) ended with a cliffhanger: a
    controller sets a time-varying voltage, which drives a time-varying current, which means
    charges are **accelerating**. This page follows that thread all the way to a wave in the
    air — introducing the **magnetic field**, **Maxwell's equations**, **what an antenna
    actually is** down at the electron level, and **induction**. Every step ends with what the
    **Flipper** is physically doing. Deep breath. 🌊

## 1 · The hand-off

From the last page: $V(t) \rightarrow I(t) \rightarrow$ **moving charge**. A *steady* current
is charge moving at constant speed; a *changing* current is charge **accelerating**. The whole
of radio is the answer to one question:

> **What does a moving — and then an accelerating — charge do to the space around it?**

## 2 · The electric field, revisited

A single charge $q$ fills space with a radial **electric field**:

$$
E = k\,\frac{q}{r^2}, \qquad \mathbf{F} = q\mathbf{E}
$$

Picture **field lines** pointing out of a positive charge. A *stationary* charge has a
*static* field — strong nearby, fading as $1/r^2$, but **frozen**. A static charge makes **no
wave**. Something has to *change* for a wave to exist.

## 3 · A moving charge makes a magnetic field (meet **B**)

The moment charge **moves** (a current), a second field appears: the **magnetic field**
$\mathbf{B}$ (units **tesla, T**). Around a long straight wire it forms **circles** threaded
through the wire, with strength

$$
B = \frac{\mu_0 I}{2\pi r}
$$

Its direction follows the **right-hand rule**: thumb along the current $I$, fingers curl the
way $\mathbf{B}$ points.

<canvas class="anim" data-type="bfield"></canvas>
<p class="fz-figcaption">Current in a wire is wrapped in circular magnetic-field loops. Point your right thumb along the current; your fingers curl with B.</p>

!!! note "How the Flipper does it — coils are pure B field"
    This is *exactly* the 125 kHz **RFID** and 13.56 MHz **NFC** front-ends. They don't try to
    radiate a wave at all — they push a big **oscillating current through a coil** to make a
    strong oscillating **B field** right next to the device. The card sits in that field. This
    is the **near field**, and it's why those are "tap" technologies. (More:
    [RFID](../signals/rfid-125khz.md), [NFC](../signals/nfc.md).)

## 4 · The key fact: an *accelerating* charge **radiates**

A charge moving at **constant velocity** drags its field along with it — no wave. But a charge
that **accelerates** (speeds up, slows, or reverses) cannot update its whole field instantly:
a **"kink"** appears in the field lines and **peels off**, travelling outward at the speed of
light. **That detached kink is the electromagnetic wave.** The radiated power grows with the
*square of the acceleration* (the **Larmor** result):

$$
P \;=\; \frac{q^2 a^2}{6\pi \varepsilon_0 c^3} \;\propto\; a^2
$$

Drive the charge **sinusoidally** (back and forth at frequency $f$) and it accelerates
continuously, radiating a steady wave at that same frequency.

!!! note "How the Flipper does it"
    To transmit on 433.92 MHz, the Sub-GHz chip forces the antenna's electrons to **oscillate
    433.92 million times a second**. Each reversal is a huge acceleration → continuous
    radiation at 433.92 MHz. *Higher frequency = more violent acceleration = easier
    radiation*, which is the deep reason low-frequency tags (125 kHz) barely radiate while
    Sub-GHz flies across the street.

## 5 · Maxwell's equations — the engine that keeps the wave alive

Once a kink is launched, what sustains it with no wire and no medium? Four laws, in words:

| Law | Plain meaning |
|---|---|
| **Gauss (E)** | electric charges create electric fields |
| **Gauss (B)** | magnetic field lines always close in loops — no magnetic "charges" |
| **Faraday** | a **changing magnetic field** creates a curling **electric** field |
| **Ampère–Maxwell** | a **changing electric field** creates a curling **magnetic** field |

Read the last two together and you get a self-perpetuating relay: a changing $\mathbf{E}$
gives birth to a $\mathbf{B}$, whose change gives birth to an $\mathbf{E}$, on and on —
**a wave that carries itself through empty space**. Maxwell computed its speed from two
constants you can measure on a bench:

$$
c = \frac{1}{\sqrt{\mu_0 \varepsilon_0}} \approx 3.0\times10^{8}\ \text{m/s}
$$

…and found it *equalled the measured speed of light* — proving light is an EM wave. In the
travelling wave the two fields are locked together with $B = E/c$ (so $\mathbf{B}$ looks
"small," but it's not optional — it's half the engine).

<canvas class="anim" data-type="emwave"></canvas>
<p class="fz-figcaption">The self-sustaining wave: a changing E (bright) makes B (dim), whose change remakes E. Neither can exist alone in flight.</p>

## 6 · What an antenna *actually is* (electron-level)

An antenna is just a **conductor** — but think about its electron sea. Apply an **oscillating
voltage** across it and you set up an oscillating **E field inside the metal**, which drives
all the free electrons to **accelerate up and down in unison**. Because the conductor has
ends, the current can't flow out — it reflects and forms a **standing wave of current** along
the rod. Every one of those accelerating electrons radiates (Section 4), and in the **far
field** their little waves **add up in phase** into one strong beam.

<canvas class="anim" data-type="antenna"></canvas>
<p class="fz-figcaption">An antenna at the electron level: a driving voltage slams the free electrons up and down together; their synchronised acceleration radiates expanding wavefronts.</p>

**Why antenna length tracks wavelength.** The radiation is strongest when the rod is sized to
the current standing wave — a **half-wave dipole** ($L = \lambda/2$) or a **quarter-wave
monopole** ($L = \lambda/4$) puts a current antinode where it does the most good. To the
driving circuit, an efficient antenna even "looks like" a resistor — its **radiation
resistance** — because it's genuinely turning electrical power into radiated power.

!!! note "How the Flipper does it"
    At 433 MHz an ideal quarter-wave whip is about **17 cm**. The Flipper's antenna is a tiny
    PCB trace — **electrically short**, so it's an inefficient radiator and very sensitive to
    orientation and how you hold it. That's not a defect; it's the physics of cramming a
    433 MHz antenna into a pocket toy. (See the polarization note on the
    [EM Spectrum](em-spectrum.md) page.)

## 7 · Reception = induction, running in reverse

To *receive*, you let the incoming wave do to your electrons what the transmitter did to its
own. The wave's **E field** exerts $\mathbf{F} = q\mathbf{E}$ on the free electrons in the
receive antenna, driving a **tiny oscillating voltage** that a low-noise amplifier boosts.

For **coils** (the near-field world), reception is literally **Faraday's law of induction**:
a changing magnetic flux $\Phi_B$ through the loop induces a voltage,

$$
\mathcal{E} = -\,\frac{d\Phi_B}{dt}
$$

— the minus sign is **Lenz's law** (the induced current opposes the change that made it).

!!! note "How the Flipper does it"
    This single equation is the entire physical basis of [RFID](../signals/rfid-125khz.md) and
    [NFC](../signals/nfc.md): the reader's coil is the transformer primary, the card's coil is
    the secondary. The card even *answers* by changing how much current it draws — **load
    modulation** — nudging $\Phi_B$ so the reader senses a reply. Same law, used both ways.

## 8 · The full transmit pipeline (so you can picture the chip)

Putting it together, here's what a radio chip like the Flipper's **CC1101** must do to put a
clean carrier in the air:

1. **Synthesize** a precise carrier voltage at the chosen frequency — a **PLL/frequency
   synthesizer** locked to the crystal makes, say, exactly 433.92 MHz.
2. **Amplify** it (a **power amplifier**) so the electrons slosh hard enough to radiate
   usefully.
3. **Match** it (a **matching network**) so power actually transfers into the antenna instead
   of reflecting back.
4. **Modulate** it — vary the drive to encode bits: amplitude for **OOK**, frequency for
   **FSK** ([Modulation](modulation.md)).

And the family resemblance across the device:

- **Sub-GHz / BLE** — drive an **antenna**, radiate a **far-field** wave.
- **125 kHz RFID / 13.56 MHz NFC** — drive a **coil**, make a strong **near-field B field**.
- **Infrared** — not radio at all: accelerate electrons across an **LED junction** so they
  emit **photons** (light), gated at ~38 kHz ([Infrared](../signals/infrared.md)).

## 9 · Carrier, tuning, and reach — now from the physics

**Carrier.** A receiver can't lock onto a faint, arbitrary wiggle in a sea of noise, so a
transmitter first emits a clean **carrier**: a steady sinusoid at one frequency (Section 4).
By itself it says nothing; **modulation** scribbles the message onto it.

**Tuning.** Physically, tuning is **resonance**. A receiver couples an inductor $L$ and
capacitor $C$ into a circuit that rings hardest at exactly

$$
f = \frac{1}{2\pi\sqrt{LC}}
$$

so it amplifies one frequency and rejects the rest — choosing a "station." *Flipper:* the
Sub-GHz **Frequency Analyzer** is finding which carrier a nearby remote uses (usually
433.92 MHz) so it can tune there.

**Reach.** Frequency sets the wavelength ($\lambda = c/f$), and wavelength versus distance
splits the world into **near field** (energy stored around a coil, "tap to read") and **far
field** (energy radiated away, "across the street"). The [EM Spectrum](em-spectrum.md) page
puts numbers on that boundary — it's the single most useful idea on the site.

!!! note "What the Flipper can — and can't — do on the air"
    The Flipper has a real radio for **Sub-GHz** (~300–928 MHz), plus separate front-ends for
    **NFC**, **125 kHz RFID**, and **infrared**. Its **Bluetooth** is locked to talking to the
    phone app and acting as a wireless keyboard/remote — it **cannot sniff or scan other
    Bluetooth devices** on stock firmware. **Wi-Fi** and other exotic radios aren't built in;
    they need add-on boards. We stay honest about this throughout.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Which kind of charge motion actually launches a propagating radio wave?",
    "options": ["A charge sitting still", "A charge moving at constant velocity", "An ACCELERATING charge (e.g. oscillating)", "A charge that has been removed"],
    "answer": 2,
    "explain": "Static and constant-velocity charges don't radiate a detached wave. Acceleration creates the field-line 'kink' that peels off at c (Larmor, P ∝ a²)."
  },
  {
    "q": "A steady current in a straight wire is surrounded by…",
    "options": ["nothing", "circular magnetic-field loops (right-hand rule)", "a static electric field only", "radio waves at 433 MHz"],
    "answer": 1,
    "explain": "Moving charge makes a B field that circles the wire; the right-hand rule gives its direction. B = μ₀I/2πr."
  },
  {
    "q": "In Maxwell's picture, what keeps an EM wave going through empty space?",
    "options": ["A medium it pushes against", "A changing E field makes B, whose change remakes E — endlessly", "The battery keeps feeding it", "Gravity"],
    "answer": 1,
    "explain": "Faraday + Ampère–Maxwell form a self-sustaining relay between E and B, travelling at c = 1/√(μ₀ε₀). No medium needed."
  },
  {
    "q": "Why is a half-wave dipole about λ/2 long?",
    "options": ["To fit in a pocket", "So the rod matches the current standing wave, radiating efficiently", "To store more charge", "Tradition"],
    "answer": 1,
    "explain": "Resonant antenna length matches the current standing wave (½λ dipole, ¼λ monopole), maximising radiation. Hence length ∝ wavelength."
  },
  {
    "q": "How does a passive RFID/NFC card both receive power and 'talk back'?",
    "options": ["A tiny battery and Bluetooth", "Faraday induction from the reader's changing B field, plus load modulation to nudge that field", "Infrared light", "It transmits its own 125 kHz carrier"],
    "answer": 1,
    "explain": "ℰ = −dΦ_B/dt induces power in the card coil; the card changes its load to perturb the reader's field as a reply. Same induction law, both ways."
  }
]
</script>
</div>

---
*Next: [The EM Spectrum](em-spectrum.md) — putting numbers on 'near' vs 'far'.*
