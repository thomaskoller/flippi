---
icon: lucide/flashlight
---

# Infrared

<span class="fz-chip run">PYTHON</span> <span class="fz-chip file">FILE</span>
The first chapter where you write **real, runnable MicroPython** that touches the physical
world — because the IR receiver and high-power IR LED *are* exposed by the
[`flipperzero`](../micropython/flipperzero-api.md) module. We'll build a working
universal-remote in Python.

## 1 · Theory & Physics

### Light, not radio

Infrared remotes don't use the radio spectrum at all — they're **optical**, using a near-IR
LED around **940 nm** (just past visible red). From $c=f\lambda$ that's a frequency of
~$3.2\times10^{14}$ Hz, but you never think in those terms for IR; you think in **carrier**
and **timing**.

### The 38 kHz carrier (and why it exists)

If a remote just flashed its LED on and off slowly, sunlight and room lighting would swamp
the receiver. So remotes **modulate the IR onto a ~38 kHz carrier**: "LED on" actually means
"LED pulsing at 38 kHz." The receiver is a tuned band-pass demodulator that ignores
everything not flickering at ~38 kHz, rejecting ambient light.

<canvas class="anim" data-type="ir"></canvas>
<p class="fz-figcaption">Each "mark" is really a burst of ~38 kHz pulses; "spaces" are dark. Data lives in the mark/space durations — OOK, optically.</p>

So an IR frame is **OOK in the optical domain**: a *mark* is a 38 kHz burst, a *space* is
darkness, and the message is the pattern of durations — exactly the timing-list idea from
[Modulation](../physics-primer/modulation.md).

### Protocols: NEC, RC5, SIRC

Manufacturers layer an encoding on top:

| Protocol | Carrier | Encoding | Notable |
|---|---|---|---|
| **NEC** | 38 kHz | pulse-distance (bit = mark + variable space) | 9 ms + 4.5 ms lead-in; 32-bit (addr + ~addr + cmd + ~cmd) |
| **RC5** (Philips) | 36 kHz | Manchester, 14 bits | has a toggle bit so "held" ≠ "re-pressed" |
| **SIRC** (Sony) | 40 kHz | pulse-width, 12/15/20 bit | sent three times |

You don't have to memorise these — the Flipper recognises common ones, and for the rest you
capture **raw** timings and replay them.

## 2 · On the Flipper

### The built-in IR app

<div class="flipper-sim" data-title="Infrared app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "Infrared", "items": [
      { "label": "Universal Remotes", "go": "universal" },
      { "label": "Learn New Remote",  "go": "learn" },
      { "label": "Saved Remotes",     "go": "saved" }
    ]},
    "universal": { "title": "Universal", "items": [ { "label": "TV", "go": "tv" }, { "label": "Audio", "go": "tv" }, { "label": "Projector", "go": "tv" }, { "label": "A/C", "go": "tv" } ] },
    "tv":        { "title": "Universal TV", "lines": ["Brute-forces a DB", "of POWER codes", "until your TV obeys"] },
    "learn":     { "title": "Learn", "lines": ["Point your remote", "at the Flipper,", "press a button"] },
    "saved":     { "title": "Saved", "items": [ { "label": "Living Room TV", "go": "btns" } ] },
    "btns":      { "title": "Living Room TV", "items": [ { "label": "Power", "go": "send" }, { "label": "Vol+", "go": "send" }, { "label": "Mute", "go": "send" } ] },
    "send":      { "title": "Send", "lines": ["Transmitting...", "(NEC, 38 kHz)"] }
  }
}
</script>
</div>

- **Universal Remotes** ship a *database* of codes and brute-force, e.g., every known TV
  POWER command — that's how one Flipper turns off "any" TV.
- **Learn New Remote** captures one button at a time from your real remote.
- Saved remotes are `.ir` files.

### Anatomy of an `.ir` file

```ini title="Living_Room_TV.ir"
Filetype: IR signals file
Version: 1
#
name: Power
type: parsed
protocol: NEC
address: 04 00 00 00
command: 08 00 00 00
#
name: Vol_up
type: raw
frequency: 38000
duty_cycle: 0.330000
data: 9000 4500 560 560 560 1690 560 560 ...
```

Two kinds of buttons:

- **`type: parsed`** — a recognised protocol (`NEC` here) with semantic `address`/`command`
  fields. Compact and editable.
- **`type: raw`** — literal microsecond `data` timings, plus the `frequency` (carrier) and
  `duty_cycle`. This maps **directly** onto what MicroPython's `infrared_receive()` returns.

### Real MicroPython: capture and replay

`infrared_receive()` blocks until it captures a burst and returns a **list of microsecond
durations** (alternating mark/space). `infrared_transmit(signal)` sends such a list back
out. The minimal "record + replay" is four lines:

```python title="ir_repeat.py — capture one button, resend it"
import flipperzero as f0
import time

signal = f0.infrared_receive()   # point a remote at the Flipper and press a button
print('captured', len(signal), 'edges')
time.sleep(3)
f0.infrared_transmit(signal)     # the Flipper re-emits the same button
```

Build a tiny **universal remote** with the on-board buttons — capture three functions, then
replay them with UP/OK/DOWN:

```python title="mini_remote.py — a 3-button learning remote"
import flipperzero as f0
import time

slots = {}            # button -> captured IR signal
labels = {
    f0.INPUT_BUTTON_UP: 'A',
    f0.INPUT_BUTTON_OK: 'B',
    f0.INPUT_BUTTON_DOWN: 'C',
}

def show(msg):
    f0.canvas_clear()
    f0.canvas_set_color(f0.CANVAS_BLACK)
    f0.canvas_set_text(6, 20, 'Mini IR remote')
    f0.canvas_set_text(6, 40, msg)
    f0.canvas_update()

learning = True       # first pass: learn; press BACK to switch to replay mode

@f0.on_input
def on_input(button, type):
    global learning
    if type != f0.INPUT_TYPE_SHORT:
        return
    if button == f0.INPUT_BUTTON_BACK:
        learning = not learning
        show('mode: ' + ('LEARN' if learning else 'SEND'))
        return
    if button in labels:
        name = labels[button]
        if learning:
            show('learn ' + name + ': press remote')
            slots[button] = f0.infrared_receive()      # blocks for one capture
            show('stored ' + name)
        elif button in slots:
            f0.infrared_transmit(slots[button])         # replay it
            show('sent ' + name)

show('LEARN: UP/OK/DOWN')
for _ in range(6000):      # ~60 s session, then exit cleanly
    time.sleep_ms(10)
```

!!! tip "Why this one *does* run (when Sub-GHz didn't)"
    IR is genuinely in the MicroPython API (`infrared_receive`/`infrared_transmit`), whereas
    the CC1101/NFC radio stacks are not. Same "capture a timing list and replay it" idea as
    a `.sub`, but here Python is allowed to drive the hardware.

A read-only **signal viewer** (adapted from the port's `infrared_signal_viewer.py`) draws
the captured waveform on the LCD so you can *see* the marks and spaces — a great way to
connect the file's `data:` line back to the physics:

```python title="ir_view.py — visualise a captured burst"
import flipperzero as f0
import time

f0.canvas_set_text(10, 32, 'Waiting for IR...')
f0.canvas_update()
signal = f0.infrared_receive()

f0.canvas_clear()
x, level = 0, True
for d in signal[:120]:
    w = max(1, int(d / 100))          # scale µs -> pixels
    y = 28 if level else 40
    f0.canvas_draw_line(x, y, x + w, y)
    x += w
    level = not level
    if x > f0.canvas_width():
        break
f0.canvas_update()
time.sleep(5)
```

## 3 · Real-World Lab

!!! example "Lab: clone your own TV remote"
    Everything here targets your *own* TV/soundbar/AC — totally fair game.

    1. Run `ir_repeat.py`. Point your TV remote at the Flipper's IR window, press **Power**.
       Watch the "captured N edges" count, then watch the Flipper power-cycle your TV.
    2. Run `ir_view.py` and capture **Vol+**. Read the bar pattern: long lead-in, then short
       marks with long/short spaces — that's NEC's pulse-distance coding by eye.
    3. Load `mini_remote.py`. Learn Power/Vol+/Mute onto UP/OK/DOWN, hit **Back** to flip to
       SEND mode, and run your TV from the Flipper's D-pad.
    4. Compare with the built-in **Learn New Remote** flow, then open the resulting `.ir`
       file and find the `data:` timings — same numbers your Python saw.

    **Defence takeaway:** IR is unauthenticated and line-of-sight; the "threat" is mostly
    nuisance (TV-B-Gone style). The interesting bit is that IR and a 433 MHz remote are the
    *same OOK timing game* in different media.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Why do IR remotes modulate onto a ~38 kHz carrier instead of just blinking the LED?",
    "options": ["To send more data", "So the receiver can band-pass filter out ambient light", "To save battery", "Legal requirement"],
    "answer": 1,
    "explain": "A 38 kHz tuned receiver rejects sunlight/room lighting, which don't flicker at 38 kHz."
  },
  {
    "q": "What does flipperzero.infrared_receive() return?",
    "options": ["A decoded command byte", "A list of microsecond durations (marks/spaces)", "A .ir file path", "An NEC address"],
    "answer": 1,
    "explain": "It returns the raw timing list, which infrared_transmit() can replay directly."
  },
  {
    "q": "In an .ir file, a button with `type: raw` stores…",
    "options": ["a protocol name and command", "literal µs timings plus carrier frequency and duty cycle", "nothing useful", "a Sub-GHz key"],
    "answer": 1,
    "explain": "Raw entries store the timing list, frequency (e.g. 38000), and duty_cycle."
  },
  {
    "q": "IR is to a 433 MHz OOK remote as…",
    "options": ["apples to oranges — totally different", "the same OOK timing scheme in a different medium (light vs radio)", "FSK to PSK", "analog to digital"],
    "answer": 1,
    "explain": "Both encode data as on/off durations; IR just does it with a 38 kHz optical carrier."
  }
]
</script>
</div>

---
*Next: [GPIO & Hardware](gpio.md) — more runnable Python, now with electrons.*
