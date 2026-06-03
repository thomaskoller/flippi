---
icon: lucide/waves
---

# Waves & Vibrations 101

!!! tip "Start here — zero physics required"
    This is the very first stop. If the words *amplitude*, *frequency* and *wavelength*
    mean nothing to you yet, you're in exactly the right place. By the end you'll read the
    rest of the site without getting lost. No maths beyond "times" and "divide". 🙂

## What even is a wave?

A **wave** is a wiggle that travels. You make one, it moves away from you, and it carries
**energy** (and, as we'll see, **information**) without anything actually being shipped
across the gap.

You already know dozens of them:

- **Ocean waves** — the water bobs *up and down*, but the wave rolls *toward the beach*.
- **A slinky** you shove — a pulse runs down the coils.
- **Sound** — your speaker pushes air; the push ripples to your ear.
- **A guitar string** — it vibrates back and forth and you hear a note.

!!! example "Everyday example: the stadium 'Mexican wave'"
    Nobody runs around the stadium. Each person just stands up and sits down. Yet a *wave*
    clearly travels all the way around. That's the whole idea: the **thing** stays put, the
    **pattern** moves.

The Flipper Zero's entire bag of tricks — radio remotes, contactless cards, TV remotes — is
just waves at different sizes. Learn the wave, and you've learned the device.

## The three numbers that describe any wave

Picture a wave frozen in a photo, then watch it move. Three measurements describe it
completely.

<canvas class="anim" data-type="sine"></canvas>
<p class="fz-figcaption">One wave. The bracket on the left is the amplitude; the ruler at the bottom is one wavelength.</p>

### 1. Amplitude — "how big"

**Amplitude** is how far the wiggle swings from the calm middle line. Bigger amplitude =
more energy.

- Ocean: a 3-metre wave vs a ripple.
- Sound: amplitude is **loudness** (turn the volume up = bigger amplitude).
- Light: amplitude is **brightness**.

### 2. Wavelength — "how long" (the symbol is λ, a Greek 'L')

**Wavelength** (λ, said "lambda") is the distance from one peak to the next peak. It's a
length, so it's measured in metres, centimetres, etc.

- Ocean: peak-to-peak might be 30 metres.
- Sound: a deep bass note is metres long; a high note is centimetres.

### 3. Frequency — "how often" (measured in hertz, Hz)

**Frequency** is how many full wiggles happen each second. One wiggle per second = **1 hertz
(Hz)**. A thousand per second = 1 **kilohertz (kHz)**, a million = 1 **megahertz (MHz)**.

<canvas class="anim" data-type="freqcompare"></canvas>
<p class="fz-figcaption">Same idea, two speeds: a slow (low-frequency) wave on top, a fast (high-frequency) wave below.</p>

- Sound: frequency is **pitch**. Low frequency = deep/bass. High frequency = high/squeaky.

!!! example "Everyday example: the dog whistle"
    A dog whistle makes a sound so **high-frequency** (fast wiggle, ~23,000 Hz) that your
    ears can't hear it, but a dog's can. Same physics, just a faster wiggle. Your Flipper
    works the same way — it "hears" radio wiggles your body can't feel at all.

## One formula — and it's friendly

Here's the only equation you need from this page, and it's basically common sense:

$$
\text{speed} = \text{frequency} \times \text{wavelength}
$$

In symbols people write it $v = f\lambda$ (speed $v$, frequency $f$, wavelength $\lambda$).

Why it makes sense: if each wiggle is **long** (big wavelength) and you make **lots** of them
per second (high frequency), the wave front has to be racing along fast. Long *and* frequent
⇒ fast.

There's a partner version, the **period**:

$$
T = \frac{1}{f}
$$

The **period** $T$ is just "how many seconds one wiggle takes." If something wiggles 4 times a
second ($f = 4$ Hz), each wiggle takes $1/4 = 0.25$ seconds. Frequency and period are two
ways of saying the same thing.

??? note "Go deeper: a quick number"
    For **radio and light**, the speed is always the same — the speed of light,
    $c \approx 300{,}000{,}000$ m/s (300 million metres per second). So for anything the
    Flipper's radios touch, $c = f\lambda$, and knowing the frequency instantly tells you the
    wavelength: $\lambda = c / f$. We lean on this hard on the next pages.

## Why this matters for the Flipper

Every signal the Flipper deals with is "pick a frequency, ride a wave." A garage remote, a
bank card, and a TV remote differ mostly in **which frequency** they wiggle at — and that one
choice decides everything: how big the antenna is, how far the signal reaches, and whether
you have to *tap* the card or can capture it *from across the street*. That's the next page.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "You turn up the volume on a speaker. Which property of the sound wave just got bigger?",
    "options": ["Frequency", "Amplitude", "Wavelength", "Period"],
    "answer": 1,
    "explain": "Louder = bigger swing from the middle line = bigger amplitude. Pitch (frequency) is unchanged."
  },
  {
    "q": "A wave wiggles 1000 times every second. Its frequency is…",
    "options": ["1000 Hz (= 1 kHz)", "1000 metres", "1 second", "1000 watts"],
    "answer": 0,
    "explain": "Wiggles-per-second is frequency, measured in hertz. 1000 Hz is 1 kilohertz."
  },
  {
    "q": "Frequency goes UP. With the speed fixed (like for radio), the wavelength…",
    "options": ["goes up too", "goes down", "stays the same", "becomes zero"],
    "answer": 1,
    "explain": "speed = frequency × wavelength. If speed is fixed and frequency rises, wavelength must shrink to compensate."
  },
  {
    "q": "Something wiggles 5 times per second. How long does ONE wiggle take (its period)?",
    "options": ["5 seconds", "0.2 seconds", "50 seconds", "It depends on amplitude"],
    "answer": 1,
    "explain": "Period = 1 / frequency = 1/5 = 0.2 s. Amplitude has nothing to do with timing."
  }
]
</script>
</div>

---
*Next: [Electricity & Signals 101](electricity-signals-101.md) — how we turn wiggles into 1s and 0s.*
