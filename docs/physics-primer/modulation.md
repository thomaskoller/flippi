---
icon: lucide/activity
---

# Modulation: putting bits on a carrier

A bare sinusoid carries no information — it's just a tone. **Modulation** is varying one of
its three free parameters to encode data:

$$
s(t) = A(t)\,\cos\!\big(2\pi f(t)\, t + \phi(t)\big)
$$

- vary $A(t)$ → **amplitude** modulation (ASK / OOK)
- vary $f(t)$ → **frequency** modulation (FSK)
- vary $\phi(t)$ → **phase** modulation (PSK)

The Flipper's Sub-GHz world is almost entirely **ASK/OOK and FSK**, because that's what
cheap remotes use. Knowing these two cold lets you read almost any `.sub` file.

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

PSK is spectrally efficient and noise-robust, but needs a coherent receiver (it must track
the carrier phase), so it's overkill for a $2 doorbell. You'll meet it more in NFC
subcarrier schemes and modern comms than in Sub-GHz remotes — but it completes the trio.

## Bandwidth, symbol rate, and Shannon (the "why you can't cheat" part)

Two facts you'll lean on when reading captures:

1. **Nyquist:** to send $R_s$ symbols/second without inter-symbol interference you need at
   least $R_s/2$ Hz of baseband bandwidth. Faster data ⇒ wider signal.
2. **Shannon–Hartley** caps the error-free bit rate of a channel:

$$
C = B\,\log_2\!\left(1 + \frac{S}{N}\right)
$$

So a noisy, narrow channel (a cheap remote in a busy ISM band) is *fundamentally* limited —
which is partly why these devices send slowly and repeat their packets several times. When
you see a `.sub` file repeat the same burst 5×, that repetition **is** the error-correction.

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
