---
icon: lucide/waves
---

# The Electromagnetic Spectrum

!!! tip "In plain English"
    Every radio trick the Flipper does is **the same wave at a different size**. A door fob,
    a garage remote and a TV remote differ mostly in **frequency** — and that one number
    decides the antenna size and whether you must *tap* the thing or can grab it *from across
    the street*. This page puts numbers on that. New here? Do the three
    [101 pages](waves-101.md) first.

Almost everything the Flipper does — Sub-GHz, NFC, RFID, infrared, even the Bluetooth link —
is *the same physics at different frequencies*: a wiggling wave of electric and magnetic
fields. The payoff of this page is that the per-signal chapters can then just say "this is
near-field at 13.56 MHz" and you'll know exactly what that implies.

## One wave, many names

A radio wave is an **electric field** and a **magnetic field** taking turns, locked together,
racing outward at the speed of light. They peak together and sit at right angles to each
other — but you don't need that detail to use the device; the picture below is enough.

<canvas class="anim" data-type="emwave"></canvas>
<p class="fz-figcaption">The electric field (bright) and magnetic field (dim) travel together at the speed of light, c.</p>

The one relationship that runs the whole device is the friendly formula from
[Waves 101](waves-101.md):

$$
c = f\lambda \approx 3.0\times10^{8}\ \text{m/s}
$$

In words: **(speed of light) = (frequency) × (wavelength)**, and for radio the speed is always
the same. So if you know the frequency, you instantly know the wavelength
($\lambda = c/f$) — and the wavelength tells you the **antenna size** and whether you're in
the *near field* (tap to read) or *far field* (works across a room).

??? note "Go deeper: the actual field equations"
    A plane electromagnetic wave propagating in $z$ has orthogonal, in-phase electric and
    magnetic fields:

    $$
    \mathbf{E}(z,t) = E_0\,\hat{\mathbf{x}}\,\cos(kz - \omega t), \qquad
    \mathbf{B}(z,t) = \frac{E_0}{c}\,\hat{\mathbf{y}}\,\cos(kz - \omega t)
    $$

    with angular frequency $\omega = 2\pi f$ and wavenumber $k = 2\pi/\lambda$. The magnetic
    field is smaller than the electric one by exactly a factor of $c$, and both peak at the
    same instant (they're *in phase*).

## The bands the Flipper lives in

| Signal | Frequency | Wavelength $\lambda = c/f$ | Regime |
|---|---|---|---|
| 125 kHz RFID | $1.25\times10^{5}$ Hz | ~2.4 km | Deep **near field** (inductive) |
| NFC | 13.56 MHz | ~22 m | **Near field** (inductive) |
| Sub-GHz | ~300–928 MHz | ~0.3–1 m | **Far field** (radiative) |
| BLE | 2.4 GHz | ~12.5 cm | Far field |
| Infrared | ~$3\times10^{14}$ Hz (~940 nm) | ~940 nm | Optical |

Notice the enormous span: the same $c=f\lambda$ stretches from kilometre-scale
wavelengths (125 kHz) to sub-micron light (IR). That's why the front-ends are so
different — you cannot use one antenna for all of them.

!!! example "Everyday-scale intuition"
    - **125 kHz RFID** waves are ~2.4 km long — *stadium-sized*. Your few-centimetre fob can
      barely interact with such a giant wave, so it only works when you basically **hug** the
      reader. (That's a feature: nobody reads your fob from across the lobby.)
    - **433 MHz Sub-GHz** waves are ~70 cm — *arm's-length*. They radiate happily and fly
      **across the street**, which is why a garage remote works from your driveway… and why a
      Flipper can capture one from a distance.
    - **Infrared** is light at ~940 nm — so small it behaves like a beam. That's why a TV
      remote needs roughly **line of sight**, like a torch.

## Near field vs. far field — the single most useful distinction

The boundary is roughly one wavelength (more precisely $\sim\lambda/2\pi$ for the reactive
near field). It explains *why RFID/NFC are "tap" technologies and Sub-GHz is "across the
street."*

<canvas class="anim" data-type="nearfar"></canvas>
<p class="fz-figcaption">Left: near-field coils only "talk" when they almost touch. Right: a far-field antenna sends a wave that reaches clear across the room.</p>

=== "Near field (RFID, NFC)"

    At 125 kHz and 13.56 MHz, the wavelength (kilometres, tens of metres) dwarfs the few-cm
    antenna and the few-cm read range. You are operating **inside the reactive near field**,
    where energy is stored in the field around the coil rather than radiated away. Coupling
    is **inductive** — like a loosely-coupled transformer:

    $$
    \mathcal{E} = -\,\frac{d\Phi_B}{dt}
    $$

    The reader's coil sets up an oscillating magnetic flux $\Phi_B$; the card's coil sits in
    that flux and a voltage is *induced* across it. No flux through the card's coil → no
    power → no read. This is why range is centimetres and why orientation matters so much.

=== "Far field (Sub-GHz, BLE)"

    At hundreds of MHz the wavelength is comparable to the antenna, energy **radiates** as a
    travelling wave, and power falls off with the inverse-square law in free space:

    $$
    P_r = P_t\, G_t G_r \left(\frac{\lambda}{4\pi d}\right)^2
    $$

    (the Friis equation). Range is metres to hundreds of metres, orientation matters less,
    and walls/obstacles cause reflection and multipath. This is the world of garage remotes
    and weather stations.

!!! note "Why this matters for attacks"
    Near-field links are *physically* hard to eavesdrop from a distance — you basically have
    to be at the reader. Far-field links can be captured from across a parking lot. The
    physics, not the protocol, sets the baseline threat distance.

!!! warning "A note on the Flipper's Bluetooth"
    BLE (2.4 GHz) is in the far-field column above, but the **stock Flipper does not sniff or
    scan Bluetooth**. Its BLE radio is locked down to two jobs: talking to the phone app, and
    acting as a wireless keyboard/remote (HID). There's no general Bluetooth capture on
    official firmware — don't expect one. ([Flipper BLE docs](https://docs.flipper.net/zero/bluetooth).)

## Decibels: dB, dBm, and why everyone uses them

Radio power ranges over **billions-to-one**, so writing it out in plain numbers is hopeless.
Engineers compress that range with **decibels (dB)** — a scale where you *add* instead of
*multiply*. The only two rules of thumb you actually need:

- **+3 dB ≈ twice the power.** −3 dB ≈ half.
- **+10 dB = ten times the power.** −10 dB = one tenth.

So "+20 dB" is just 10×10 = **100×**, and "−30 dB" is one-thousandth. **dBm** is the same
idea but measured against a fixed reference of 1 milliwatt, so it gives an *absolute* power:
$0\ \text{dBm} = 1\ \text{mW}$, $+10\ \text{dBm} = 10\ \text{mW}$,
$-30\ \text{dBm} = 1\ \mu\text{W}$.

??? note "Go deeper: the logarithms behind it"
    A **ratio** in decibels:

    $$
    G_{\text{dB}} = 10\log_{10}\!\left(\frac{P_{\text{out}}}{P_{\text{in}}}\right)
    $$

    An **absolute** power referenced to 1 mW is **dBm**:

    $$
    P_{\text{dBm}} = 10\log_{10}\!\left(\frac{P}{1\ \text{mW}}\right)
    $$

Handy anchors: $0\ \text{dBm} = 1\ \text{mW}$, $+10\ \text{dBm} = 10\ \text{mW}$,
$-30\ \text{dBm} = 1\ \mu\text{W}$. Every **+3 dB ≈ doubling** of power, every
**+10 dB = 10×**. When a Sub-GHz capture shows an RSSI of $-75$ dBm, that's
$\approx 3\times10^{-8}$ mW — and your receiver still decodes it, which tells you how
sensitive these front-ends are.

## Polarization and antennas (the one-paragraph version)

The wave's **polarization** is the direction of $\mathbf{E}$ (here, $\hat{\mathbf{x}}$).
A receiving antenna couples best when aligned with it — a cross-polarized antenna can lose
20 dB. A simple resonant **quarter-wave** monopole has length $\lambda/4$: at 433 MHz
that's about 17 cm, which is why a 433 MHz remote with a tiny PCB trace antenna is
*electrically short* and inefficient (and why your Flipper's range varies wildly with
orientation and how you hold it).

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "NFC runs at 13.56 MHz. Roughly what is its free-space wavelength?",
    "options": ["~22 metres", "~22 centimetres", "~940 nanometres", "~2.4 kilometres"],
    "answer": 0,
    "explain": "λ = c/f = 3e8 / 13.56e6 ≈ 22 m — far larger than the few-cm read range, hence near-field."
  },
  {
    "q": "Why is a 125 kHz RFID link inherently 'tap to read'?",
    "options": ["The data rate is too low for distance", "It's reactive near-field inductive coupling; flux must thread the card coil", "Regulations cap the power", "The CC1101 is weak"],
    "answer": 1,
    "explain": "At 125 kHz you're deep in the near field. Coupling is inductive — no shared flux, no power, no read."
  },
  {
    "q": "An amplifier adds +10 dB. The output power is…",
    "options": ["10 mW more", "10× the input", "doubled", "halved"],
    "answer": 1,
    "explain": "+10 dB is a factor of 10 in power (+3 dB ≈ ×2)."
  },
  {
    "q": "Sub-GHz can be captured from across a parking lot, NFC essentially cannot. The reason is fundamentally…",
    "options": ["encryption", "the protocol design", "near-field vs far-field physics", "antenna cost"],
    "answer": 2,
    "explain": "Far-field radiates and propagates; near-field energy stays bound near the coil. Physics sets the threat distance."
  }
]
</script>
</div>

---
*Next: [Modulation](modulation.md) — how we put information onto these waves.*
