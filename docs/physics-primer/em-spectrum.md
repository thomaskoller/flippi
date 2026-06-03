---
icon: lucide/waves
---

# The Electromagnetic Spectrum

Almost everything the Flipper does — Sub-GHz, NFC, RFID, infrared, even the BLE link — is
*the same physics at different frequencies*: oscillating electric and magnetic fields. If
you have a physics background this is a refresher; the payoff is that the per-signal
chapters can then just say "this is near-field at 13.56 MHz" and you'll know exactly what
that implies.

## One wave, many names

A plane electromagnetic wave propagating in $z$ has orthogonal, in-phase electric and
magnetic fields:

$$
\mathbf{E}(z,t) = E_0\,\hat{\mathbf{x}}\,\cos(kz - \omega t), \qquad
\mathbf{B}(z,t) = \frac{E_0}{c}\,\hat{\mathbf{y}}\,\cos(kz - \omega t)
$$

with angular frequency $\omega = 2\pi f$, wavenumber $k = 2\pi/\lambda$, and the
defining relationship

$$
c = f\lambda \approx 3.0\times10^{8}\ \text{m/s}.
$$

<canvas class="anim" data-type="emwave"></canvas>
<p class="fz-figcaption">Orthogonal E (bright) and B (dim) fields propagating at c. They are in phase — both peak together.</p>

That single equation $c = f\lambda$ is the backbone of the whole device. It tells you the
**wavelength** for each radio, which in turn tells you the **antenna size** and whether
you're in the *near field* or *far field*.

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

## Near field vs. far field — the single most useful distinction

The boundary is roughly one wavelength (more precisely $\sim\lambda/2\pi$ for the reactive
near field). It explains *why RFID/NFC are "tap" technologies and Sub-GHz is "across the
street."*

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

## Decibels: dB, dBm, and why everyone uses them

RF spans many orders of magnitude, so we work logarithmically. A **ratio** in decibels:

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
