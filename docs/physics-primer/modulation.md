---
icon: lucide/activity
---

# Modulation: putting bits on a carrier

!!! tip "In plain English"
    A steady radio wave (the **carrier**) is like holding one long note — it says nothing on
    its own. **Modulation** is *changing* that note to spell out your 1s and 0s. There are
    only three things you can change about a wave, so there are only three basic families of
    modulation. That's the whole page.

!!! example "Everyday example: signalling with a flashlight"
    Point a torch at a friend across a field. You can send a message three ways:

    - **Brightness** — bright = 1, dim/off = 0. *(This is amplitude / ASK / OOK.)*
    - **Colour** — swap a red filter for a green one to mean 1 vs 0. *(This is frequency /
      FSK — frequency is a wave's "colour.")*
    - **Timing nudges** — a clever scheme where you shift *when* the flicker happens.
      *(This is phase / PSK.)*

    A radio does exactly this to its carrier wave, just millions of times a second.

A bare sinusoid carries no information — it's just a tone. **Modulation** varies one of its
three free parameters to encode data:

$$
s(t) = \underbrace{A(t)}_{\text{brightness}}\,\cos\!\big(2\pi \underbrace{f(t)}_{\text{colour}}\, t + \underbrace{\phi(t)}_{\text{timing}}\big)
$$

- vary $A(t)$ → **amplitude** modulation (ASK / OOK) — *brightness*
- vary $f(t)$ → **frequency** modulation (FSK) — *colour*
- vary $\phi(t)$ → **phase** modulation (PSK) — *timing*

The Flipper's Sub-GHz world is almost entirely **ASK/OOK and FSK**, because that's what
cheap remotes use. Knowing these two cold lets you read almost any `.sub` file. New to
waves? Detour through [Waves 101](waves-101.md) first.

## ASK / OOK — the workhorse of cheap remotes

**Amplitude-Shift Keying** encodes bits by switching the carrier amplitude between levels.
The degenerate, ubiquitous case is **On-Off Keying (OOK)**: amplitude is either *full* or
*zero*. A "1" is "carrier present," a "0" is "carrier absent":

$$
s_{\text{OOK}}(t) = b(t)\,A\cos(2\pi f_c t), \qquad b(t)\in\{0,1\}
$$

<canvas class="anim" data-type="ask"></canvas>
<p class="fz-figcaption">OOK/ASK: the digital data (top) simply gates the carrier on and off.</p>

OOK is dirt cheap to build — the transmitter is essentially a carrier and a switch — which
is exactly why your garage remote, your wireless doorbell, and most 433 MHz gadgets use it.
The receiver just needs an envelope detector. On the Flipper this is the `AM270`/`AM650`
preset family.

!!! note "OOK and timing *is* the message"
    Because amplitude only says "on" or "off," all the information lives in the **timing** of
    the on/off transitions. That's why Sub-GHz captures are stored as lists of durations
    (see the [Sub-GHz `.sub` format](../signals/sub-ghz.md)). Encodings like **PWM** (a long
    pulse = 1, short pulse = 0) and **Manchester** (a transition mid-bit) sit on top of OOK.

## FSK — two tones, more robust

**Frequency-Shift Keying** holds amplitude constant and shifts the carrier between two
frequencies: a "mark" $f_1$ and a "space" $f_2$.

$$
s_{\text{FSK}}(t) = A\cos\!\big(2\pi f_{\{1,2\}} t\big)
$$

<canvas class="anim" data-type="fsk"></canvas>
<p class="fz-figcaption">FSK: amplitude is constant; the bit selects between a higher (mark) and lower (space) frequency.</p>

Because the information is in *frequency*, FSK shrugs off amplitude noise and fading much
better than OOK — so it shows up in slightly more "serious" devices (some car TPMS sensors,
weather stations, higher-end remotes). On the Flipper these are the `FM238`/`FM476` presets.
The cost is bandwidth: you need room for both tones plus their sidebands.

## PSK — encoding in phase

**Phase-Shift Keying** keeps amplitude and frequency fixed and jumps the phase. The
simplest, **BPSK**, uses two phases $180°$ apart:

$$
s_{\text{BPSK}}(t) = A\cos\!\big(2\pi f_c t + \pi b(t)\big),\quad b\in\{0,1\}
$$

<canvas class="anim" data-type="psk"></canvas>
<p class="fz-figcaption">BPSK: amplitude and frequency never change — watch the carrier suddenly "flip" (invert) at each '0'. That flip is the bit.</p>

PSK is spectrally efficient and noise-robust, but needs a coherent receiver (it must track
the carrier phase), so it's overkill for a $2 doorbell. You'll meet it more in NFC
subcarrier schemes and modern comms than in Sub-GHz remotes — but it completes the trio.

## One level deeper: line codes (Manchester)

Modulation gets the bits onto the carrier; a **line code** decides how a "1" and "0" are
*shaped in time* before that. The most common one you'll meet (it's how 125 kHz RFID fobs
talk) is **Manchester**: instead of "high = 1, low = 0," every bit is a **transition in the
middle** — say high-to-low for a 1, low-to-high for a 0.

<canvas class="anim" data-type="manchester"></canvas>
<p class="fz-figcaption">Manchester: there's a flip in the MIDDLE of every single bit. A constant level is "no data."</p>

Why bother? Because there's a guaranteed edge in every bit, the receiver can **stay in sync**
with the sender's clock and never gets lost counting a long run of identical bits — handy
when the tag has no clock of its own and is just coasting on the reader's field.

## Bandwidth, symbol rate, and Shannon (the "why you can't cheat" part)

Faster data needs a wider signal, and every channel has a hard speed limit set by its noise.
That's why cheap remotes send slowly and simply **repeat** their packet several times instead
of doing clever error-correction — when you see a `.sub` file send the same burst 5×, that
repetition **is** the error-correction.

??? note "Go deeper: Nyquist & Shannon"
    Two facts you'll lean on when reading captures:

    1. **Nyquist:** to send $R_s$ symbols/second without inter-symbol interference you need at
       least $R_s/2$ Hz of baseband bandwidth. Faster data ⇒ wider signal.
    2. **Shannon–Hartley** caps the error-free bit rate of a channel:

    $$
    C = B\,\log_2\!\left(1 + \frac{S}{N}\right)
    $$

    So a noisy, narrow channel (a cheap remote in a busy ISM band) is *fundamentally* limited.

## How this maps to the rest of the site

| Modulation | Where you'll meet it | Flipper preset |
|---|---|---|
| OOK / ASK | most 433/315/868 MHz remotes, doorbells | `AM270`, `AM650` |
| 2-FSK | TPMS, weather stations, some remotes | `FM238`, `FM476` |
| Load-modulated subcarrier | NFC tag → reader (13.56 MHz) | (NFC app) |
| OOK + Manchester/biphase | 125 kHz RFID (EM4100) | (LF RFID app) |
| Carrier gating @ ~38 kHz | Infrared remotes | (IR app) |

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "A $2 wireless doorbell almost certainly uses which scheme, and why?",
    "options": ["BPSK — spectrally efficient", "OOK — a carrier plus a switch is the cheapest possible transmitter", "FSK — noise immunity", "QAM — high data rate"],
    "answer": 1,
    "explain": "OOK needs only a carrier and an on/off switch, with a trivial envelope-detector receiver. Cheapest to build."
  },
  {
    "q": "In an OOK signal, where does the actual information live?",
    "options": ["In the carrier frequency", "In the phase", "In the timing of the on/off transitions", "In the amplitude levels"],
    "answer": 2,
    "explain": "Amplitude is just on/off, so all data is in the durations — which is why .sub files are timing lists."
  },
  {
    "q": "Why does FSK tolerate amplitude noise better than OOK?",
    "options": ["It transmits more power", "Information is carried in frequency, not amplitude", "It uses error-correcting codes", "It's encrypted"],
    "answer": 1,
    "explain": "Fading and amplitude noise don't change which of the two frequencies is present."
  },
  {
    "q": "A .sub capture repeats the same burst five times. The most likely reason is…",
    "options": ["a bug in the Flipper", "crude error tolerance — repetition raises the odds the receiver hears one clean copy", "encryption", "to drain the battery"],
    "answer": 1,
    "explain": "Cheap one-way links can't ARQ, so they brute-force reliability by repeating the packet."
  }
]
</script>
</div>

---
*Next: the signal chapters. Start with [Infrared](../signals/infrared.md) for runnable code, or [Sub-GHz](../signals/sub-ghz.md) for OOK/FSK in the wild.*
