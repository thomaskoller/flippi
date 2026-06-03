---
icon: lucide/satellite-dish
---

# Sub-GHz Radio

<span class="fz-chip file">FILE</span> <span class="fz-chip cli">CLI</span>

!!! tip "In plain English"
    **One sentence:** the short-range radio that runs garage doors, gate remotes, and cheap
    wireless gadgets — the Flipper can listen to it and play it back.
    **Everyday analogy:** a universal "record and replay" button for the invisible beeps your
    remotes send.
    **You meet it in:** garage-door remotes, wireless doorbells, car key fobs, remote-control
    mains sockets, weather stations.
    **What the Flipper actually does:** captures and replays **static (fixed) codes** like
    cheap sockets and old gates. **Modern rolling codes** (most cars, modern garages) it can
    *hear* but **not clone** — by design.

The Sub-GHz app is the Flipper's most famous feature: capture, analyse, and replay the
short-range radio that runs garage doors, gate remotes, wireless doorbells, weather
stations, and cheap remote sockets. The radio itself is a **TI CC1101** transceiver — and
crucially, it is **not** reachable from MicroPython; everything here is the native app,
the `.sub` file format, and the CLI.

## 1 · Theory & Physics

### The bands

The CC1101 covers three slices of spectrum, all in the ISM (Industrial/Scientific/Medical)
allocations where unlicensed low-power devices live:

| Band | Typical regional frequencies | Used by |
|---|---|---|
| 300–348 MHz | 315 MHz (US/Asia) | garage/car remotes |
| 387–464 MHz | 433.92 MHz (worldwide ISM) | the vast majority of cheap remotes |
| 779–928 MHz | 868 MHz (EU), 915 MHz (US) | weather stations, higher-end devices |

From the [EM primer](../physics-primer/em-spectrum.md): at 433 MHz, $\lambda = c/f
\approx 0.69$ m, so a quarter-wave antenna is ~17 cm — much bigger than the trace on a
keyfob, which is why those remotes are inefficient and short-range. This is **far-field**
radio: it propagates, reflects, and can be captured from a good distance.

### The modulation

Almost all of these devices use **OOK/ASK** (the cheap remotes) or **2-FSK** (slightly
better gear). Revisit [Modulation](../physics-primer/modulation.md) for the waveforms.

<canvas class="anim" data-type="ask"></canvas>
<p class="fz-figcaption">A typical 433 MHz remote: OOK. The data is entirely in the on/off timing.</p>

The Flipper exposes these as **presets**, which set the demodulator and bandwidth:

| Preset | Modulation | Notes |
|---|---|---|
| `AM270` | OOK, 270.83 kHz BW | narrow, for clean signals |
| `AM650` | OOK, 650 kHz BW | wide, the common default |
| `FM238` | 2-FSK, 2.38 kHz deviation | narrow FSK |
| `FM476` | 2-FSK, 47.61 kHz deviation | wide FSK |

!!! warning "Receiving is wider than transmitting"
    The CC1101 can *listen* across the full 300–348 / 387–464 / 779–928 MHz ranges, but the
    official firmware only *transmits* on **region-approved frequencies** — it deliberately
    refuses to key the radio on bands you're not allowed to use where you are.
    ([Flipper frequency docs](https://docs.flipper.net/zero/sub-ghz/frequencies).)

### Static codes vs. rolling codes (the crux)

This single distinction decides whether a capture is *useful* and whether an attack is even
possible:

<canvas class="anim" data-type="rollingcode"></canvas>
<p class="fz-figcaption">Static code: the same value every press, so a recording replays forever. Rolling code: a counter ticks up each press, so yesterday's recording is already "spent."</p>

=== "Static / fixed code"

    The remote sends the **same** bit pattern every time (often a DIP-switch or factory ID
    plus a button code). Capture once, replay forever. Old gates, cheap doorbells, many
    remote power sockets. **Replayable.**

=== "Rolling code (hopping code)"

    Each press sends a **different** code derived from a secret key and an incrementing
    counter (KeeLoq, AUT64, etc.). The receiver accepts only codes ahead of its counter
    within a window. A naive replay **fails** — the captured code is already "used." Modern
    cars and garage openers. **Not replayable** by capture-and-resend.

    !!! note "Stock firmware does not clone rolling codes"
        The official Flipper firmware can **receive and recognise** many rolling-code
        protocols, but it deliberately **does not implement the encoder** to forge the next
        valid code — so it cannot clone or open a rolling-code device. (Third-party firmwares
        add partial "custom button" support for a few brands, but it's incomplete and out of
        scope here.) This is the security working, not a missing feature.

!!! danger "Don't replay what isn't yours"
    Even where replay is *technically* possible, doing it against a gate, car, or building
    you don't own is illegal. Labs below use a device you bought specifically to learn on.

## 2 · On the Flipper

### Walking the app

<div class="flipper-sim" data-title="Sub-GHz app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "Sub-GHz", "items": [
      { "label": "Read",        "go": "read" },
      { "label": "Read RAW",    "go": "raw" },
      { "label": "Saved",       "go": "saved" },
      { "label": "Add Manually","go": "manual" },
      { "label": "Frequency Analyzer", "go": "analyzer" }
    ]},
    "read":     { "title": "Read", "lines": ["433.92 MHz", "Preset: AM650", "", "Listening..."] },
    "raw":      { "title": "Read RAW", "lines": ["Recording timings", "to .sub file", "OK = stop"] },
    "saved":    { "title": "Saved", "items": [ { "label": "doorbell.sub", "go": "play" }, { "label": "socket_on.sub", "go": "play" } ] },
    "play":     { "title": "doorbell", "lines": ["433.92 MHz AM650", "OK = Send", "(only your own!)"] },
    "manual":   { "title": "Add Manually", "lines": ["Pick protocol:", "Princeton, CAME,", "Nice FLO, ..."] },
    "analyzer": { "title": "Freq Analyzer", "lines": ["Hold remote near", "Flipper, read the", "strongest freq"] }
  }
}
</script>
</div>

- **Read** decodes *known protocols* live (Princeton, CAME, NICE, Holtek, …) at a chosen
  frequency/preset.
- **Read RAW** records the raw timing edges to a `.sub` when the protocol is unknown.
- **Frequency Analyzer** finds *which* frequency a nearby remote uses — start here when you
  don't know the band.

### Anatomy of a `.sub` file

A decoded, known-protocol capture is compact and human-readable:

```ini title="doorbell.sub (decoded protocol)"
Filetype: Flipper SubGhz Key File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: Princeton
Bit: 24
Key: 00 00 00 00 00 9A 4C 50
TE: 350
```

- `Frequency` — in **Hz** (433.92 MHz here).
- `Preset` — demodulator (OOK, 650 kHz BW).
- `Protocol` — the decoder that understood it.
- `Bit` / `Key` — the payload: a 24-bit code, right-aligned in the 8-byte `Key`.
- `TE` — the base time element (µs) the protocol's pulse widths are multiples of.

A **RAW** capture instead stores the literal edge timings — exactly the duration-list idea
from [Modulation](../physics-primer/modulation.md):

```ini title="unknown.sub (RAW timings)"
Filetype: Flipper SubGhz RAW File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: RAW
RAW_Data: 350 -350 700 -350 350 -700 350 -350 ...
```

Positive numbers are "carrier on" durations (µs), negatives are "off." Decode it by eye:
with `TE = 350`, a `350 -350` is one symbol and `700 -350` another — that's **PWM-over-OOK**.

### CLI

```text
subghz rx 433920000          # listen and decode on 433.92 MHz
subghz tx <...>              # transmit (frequency-restricted on official firmware)
subghz decode_raw /ext/subghz/unknown.sub
```

!!! note "MicroPython can't do this"
    The CC1101 radio stack is firmware-only. What you *can* do from Python is **parse and
    analyse `.sub` files** on the SD card — useful for understanding encodings:

    ```python title="dump the RAW timings of a .sub"
    import io
    with io.open('/ext/subghz/unknown.sub', 'r') as fh:
        for line in fh:
            if line.startswith('RAW_Data:'):
                edges = [int(x) for x in line.split(':')[1].split()]
                print('symbols:', len(edges))
    ```

## 3 · Real-World Lab

!!! example "Lab: a 433 MHz remote power socket you own"
    Buy a cheap remote-controlled mains socket set (the kind with a little 433 MHz fob).
    They are almost always **static-code OOK** — perfect and safe to learn on.

    1. **Frequency Analyzer**: hold the fob near the Flipper, press a button, note the
       frequency (usually 433.92 MHz).
    2. **Read** on that frequency with `AM650`. Press the fob's "on" button. The Flipper
       should decode a known protocol (often Princeton/Holtek) and show a `Key`.
    3. Press "off" and capture that too. Compare the two `Key` values — you'll see which
       bits encode the channel vs. the on/off command.
    4. **Save** each, then **Send** one back to your *own* socket. It switches. You've just
       demonstrated a replay attack against a static-code device.
    5. Open the `.sub` files on your computer and map the bitfields.

    **Defence takeaway:** this is exactly why anything security-relevant uses rolling codes.
    A static code is a password sent in the clear, forever.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "433.92 MHz remote, single button. Which Flipper preset is the natural first try?",
    "options": ["FM476", "AM650", "2FSK wide", "NFC-A"],
    "answer": 1,
    "explain": "Cheap remotes are OOK; AM650 is the wide-bandwidth OOK preset and the common default."
  },
  {
    "q": "You capture a car key fob and replay it — nothing happens. Most likely because…",
    "options": ["wrong frequency", "it's a rolling code; the captured value is already spent", "the battery is low", "the CC1101 can't do 433 MHz"],
    "answer": 1,
    "explain": "Rolling codes change every press and the receiver won't accept a replayed (already-used) code."
  },
  {
    "q": "In a RAW .sub, an entry of `-700` means…",
    "options": ["700 µs of carrier ON", "700 µs of carrier OFF (gap)", "frequency 700 Hz", "700 bits"],
    "answer": 1,
    "explain": "Negative durations are 'off' intervals; positive are 'on'. It's an OOK timing list."
  },
  {
    "q": "Can you transmit a .sub from MicroPython?",
    "options": ["Yes, via f0.subghz_transmit", "No — the CC1101 stack is firmware-only; Python can only parse the file", "Only on custom firmware", "Only RAW files"],
    "answer": 1,
    "explain": "mp-flipper doesn't expose Sub-GHz. Python can read/parse .sub files but not key the radio."
  }
]
</script>
</div>

---
*Next: [125 kHz RFID](rfid-125khz.md) — into the near field.*
