---
icon: lucide/terminal
---

# Firmware, the SD card, and the CLI

Three things you'll touch constantly: the **firmware** running the show, the **SD card**
layout where everything is stored, and the **serial CLI** — your most powerful (and most
underused) interface to the device.

## Firmware

The Flipper ships with **official firmware**. There are also popular community
distributions (Unleashed, RogueMaster, Momentum) that unlock region-restricted Sub-GHz
frequencies and add extra apps.

!!! warning "Region locks and the law are not the same thing"
    Custom firmware can *remove* the Sub-GHz transmit restrictions baked into the official
    build. That makes it your responsibility to know which bands you may legally transmit
    on in your country. Removing a software lock does not grant legal permission. See
    [Ethics & Law](ethics-and-law.md).

Update firmware with the desktop **qFlipper** app or over BLE from the mobile app. Both
also give you file access to the SD card.

## SD card layout

Almost everything the Flipper does is just **files on the microSD card**. Knowing the
layout demystifies the whole device:

```text
/ext/                     # the SD card root, as seen by the firmware ("external" storage)
├── subghz/               # captured/created .sub files
├── nfc/                  # .nfc dumps
├── lfrfid/               # .rfid (125 kHz) dumps
├── infrared/             # .ir remotes
├── ibutton/              # .ibtn keys
├── badusb/               # DuckyScript .txt payloads
├── apps/                 # installed .fap applications (incl. uPython)
│   └── Tools/upython.fap
└── scripts/              # a good home for your MicroPython .py files
```

Because these are plain text (mostly), you can read, diff, and hand-edit them on your
computer. Every signal chapter dissects the relevant format line by line.

## The serial CLI

Plug in over USB-C and you get a serial console. Connect with any terminal at the usual
settings (the baud rate is effectively irrelevant over USB CDC):

=== "Linux / macOS"

    ```bash
    # device usually shows up as /dev/ttyACM0 (Linux) or /dev/tty.usbmodemXXXX (macOS)
    screen /dev/ttyACM0
    # or
    picocom /dev/ttyACM0
    ```

=== "Windows"

    ```text
    Use PuTTY or the Arduino Serial Monitor on the COM port that appears
    (Device Manager → Ports). Then type `help`.
    ```

Once connected, `help` lists every command. A few you'll use across chapters:

```text
help                      # list all commands
device_info               # hardware + firmware versions
storage list /ext         # browse the SD card
storage read /ext/...     # dump a file
loader open <app> <arg>   # launch an app, optionally with an argument
subghz rx 433920000       # listen on Sub-GHz (frequency in Hz)
nfc detect                # poll for an NFC tag
```

!!! tip "The CLI is scriptable from your PC"
    Anything on the CLI can be driven from a host script (PySerial, expect, even `echo`
    into the serial port). That's how a lot of "automation" with the Flipper actually
    happens — the *host* orchestrates, the Flipper executes. The community
    [pyFlipper](https://github.com/wh00hw/pyFlipper) wrapper formalizes this.

## Running MicroPython

The on-device Python comes from the [mp-flipper](https://ofabel.github.io/mp-flipper/)
port, installed as `upython.fap`. Two ways to run a script:

=== "From the Flipper UI"

    1. Install **uPython** from the Flipper Lab app catalogue.
    2. Copy your `.py` to the SD card (e.g. `/ext/scripts/blink.py`) with qFlipper.
    3. Open the uPython app and pick your script in the file browser.

=== "From the CLI"

    ```text
    # launch the app with a script in one shot:
    loader open /ext/apps/Tools/upython.fap /ext/scripts/blink.py

    # or, while the uPython app is already running, use the py command:
    py /ext/scripts/blink.py
    ```

!!! note "If a script hangs"
    Only one script runs at a time, and a tight loop can lock the UI. Hard-reboot by
    holding **Left + Back** for ~5 seconds.

The [MicroPython chapter](../micropython/setup.md) goes deeper, and
[the API reference](../micropython/flipperzero-api.md) catalogues every function.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Where do captured Sub-GHz signals live on the device?",
    "options": ["/ext/nfc/", "/ext/subghz/ as .sub files", "in flash, inaccessible", "/ext/badusb/"],
    "answer": 1,
    "explain": "Sub-GHz captures are .sub text files under /ext/subghz/."
  },
  {
    "q": "Your script locked up the UI. What's the quick fix?",
    "options": ["Reflash the firmware", "Pull the SD card", "Hold Left + Back ~5s to reboot", "Wait for the battery to die"],
    "answer": 2,
    "explain": "Left + Back held for ~5 seconds forces a reboot."
  },
  {
    "q": "Why can a host PC script 'automate' the Flipper so effectively?",
    "options": ["It overclocks the M4", "The serial CLI exposes most functions, so the PC can orchestrate", "It bypasses the firmware", "BLE is faster than USB"],
    "answer": 1,
    "explain": "The CLI is a full text interface; tools like pyFlipper drive it from the host."
  }
]
</script>
</div>

---
*Next: [Ethics & Law](ethics-and-law.md) — the part that keeps you out of trouble.*
