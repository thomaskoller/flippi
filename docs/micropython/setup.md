---
icon: lucide/play
---

# MicroPython on the Flipper: setup

The Flipper can run **MicroPython** through the community
[mp-flipper](https://ofabel.github.io/mp-flipper/) port by Oliver Fabel, packaged as the
**uPython** app. This is the only way to write code that runs *on the device itself* — and
it's how every <span class="fz-chip run">PYTHON</span> snippet on this site executes.

!!! note "What it can and can't do"
    mp-flipper exposes the Flipper's **peripherals**: GPIO, ADC, PWM, the speaker, LEDs,
    vibro, the LCD canvas, buttons, the SD card, UART, and **infrared TX/RX**. It does
    **not** expose the Sub-GHz, NFC, 125 kHz RFID, or iButton radio stacks — those stay in
    firmware. So: real remotes and circuits, yes; software-defined radio, no.

## Install

1. On the Flipper, open **Apps → Tools** (or the Flipper Lab catalogue) and install
   **uPython**. It lands at `/ext/apps/Tools/upython.fap`.
2. Connect the Flipper to your computer with USB-C and open **qFlipper** (or use the mobile
   app over BLE) to access the SD card.

## Write and run your first script

Create `blink.py` and copy it to `/ext/scripts/` on the SD card:

```python title="blink.py"
import flipperzero as f0
import time

# The on-board RGB LED — pulse it green a few times.
for _ in range(5):
    f0.light_set(f0.LIGHT_GREEN, 255)
    time.sleep_ms(200)
    f0.light_set(f0.LIGHT_GREEN, 0)
    time.sleep_ms(200)
```

Then run it one of two ways:

=== "From the Flipper UI"

    Open the **uPython** app and select `blink.py` in the file browser. The LED blinks.

=== "From the serial CLI"

    ```text
    # launch the app pointed at the script:
    loader open /ext/apps/Tools/upython.fap /ext/scripts/blink.py

    # …or, while uPython is already running, from its CLI:
    py /ext/scripts/blink.py
    ```

That `import flipperzero as f0` line is the whole game — `flipperzero` is the hardware
module, and aliasing it to `f0` (as the official examples do) keeps lines short.

## Mental model & gotchas

This is **MicroPython**, not CPython, on a microcontroller with very little RAM. A few
things will bite you if you forget:

- **Tiny heap.** Total SRAM is 256 KB and the interpreter only gets a fraction. Don't build
  big lists/strings; stream from the SD card with the `io` module instead.
- **One script at a time.** The uPython app runs a single program; a tight `while True:`
  with no sleep will peg the CPU and freeze the UI.
- **Always `time.sleep`/`sleep_ms` in loops.** It yields and keeps the device responsive.
  Many examples loop a fixed number of times (`for _ in range(1, 1000): time.sleep_ms(10)`)
  rather than spinning forever — a clean way to bound runtime.
- **Reset your pins.** After driving GPIO, set them back to `GPIO_MODE_ANALOG` (high-Z) so
  you don't leave a pin pushing current. The interrupt example does exactly this on exit.
- **Hung? Reboot.** Hold **Left + Back** ~5 seconds.

## The standard library you get

Beyond `flipperzero`, the port ships trimmed versions of familiar modules:

| Module | Use |
|---|---|
| `time` | `sleep()`, `sleep_ms()`, timing |
| `io` | `open()` → `TextFileIO` / `BinaryFileIO` for SD-card files (read/write/seek) |
| `logging` | levelled logging (`TRACE`…`ERROR`) to the CLI |
| `random` | `random()`, `randint()`, `choice()`, `seed()`, … |

A file-streaming sketch you'll reuse in the lab chapters:

```python title="read a capture line by line"
import io

with io.open('/ext/subghz/garage.sub', 'r') as fh:
    for line in fh:                 # streamed — no giant buffer
        if line.startswith('RAW_Data:'):
            print(line.strip())
```

Now head to the **[flipperzero API reference](flipperzero-api.md)** for every function,
grouped by peripheral, with runnable snippets.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Why won't `import flipperzero` let you transmit a 433 MHz signal?",
    "options": ["You need to import 'subghz'", "The port exposes peripherals, not the radio stacks — Sub-GHz stays in firmware", "You must enable it in settings", "MicroPython is too slow"],
    "answer": 1,
    "explain": "mp-flipper wraps GPIO/IR/ADC/PWM/etc. The CC1101 radio stack isn't exposed to Python."
  },
  {
    "q": "Your script freezes the UI. The most likely cause is…",
    "options": ["too many imports", "a tight loop with no sleep", "using floats", "the SD card is full"],
    "answer": 1,
    "explain": "A loop with no sleep starves the UI. Add time.sleep_ms() and/or bound the loop count."
  },
  {
    "q": "Best practice after toggling a GPIO output pin in a script?",
    "options": ["Leave it — it resets on reboot", "Set it back to GPIO_MODE_ANALOG (high-Z)", "Short it to ground", "Set it to 5 V"],
    "answer": 1,
    "explain": "Returning the pin to analog/high-impedance avoids leaving it actively driving current."
  }
]
</script>
</div>

---
*Next: [flipperzero API reference](flipperzero-api.md).*
