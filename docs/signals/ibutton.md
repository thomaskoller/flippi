---
icon: lucide/key-round
---

# iButton (1-Wire)

<span class="fz-chip file">FILE</span> <span class="fz-chip cli">CLI</span>

!!! tip "In plain English"
    **One sentence:** the round metal "magic button" key you touch to an apartment-intercom
    pad — the Flipper can read it and copy it onto a blank.
    **Everyday analogy:** a door key that works by *touching* two metal dots together instead
    of a wireless tap. Zero range — it must physically touch.
    **You meet it in:** apartment-block intercom keys, some lifts and gates, a few access
    systems (the little silver coin on a keyring).
    **What the Flipper actually does:** reads the key's number and writes it to a blank iButton
    or compatible fob. Dallas keys clone fully; **Cyfral/Metakom** are **UID-only**.

The little round metal "coin" key for intercoms and some access systems is an **iButton** —
a Dallas **1-Wire** device read by physical contact. Firmware handles the protocol; the
*electrical* 1-Wire concept overlaps with what MicroPython can bit-bang on GPIO, which makes
this a nice bridge chapter.

## 1 · Theory & Physics

### Contact, not field

Unlike RFID/NFC, there's no coupling physics — it's a **galvanic contact** interface. Two
conductors (the data line and ground) touch the reader's contacts. Because it's wired, range
is literally zero and eavesdropping requires physical access.

### The 1-Wire protocol

[Dallas 1-Wire](https://en.wikipedia.org/wiki/1-Wire) carries **both power and data on a
single line** plus ground. The line idles high through a pull-up; the master pulls it low in
precisely-timed slots to clock bits. A "reset pulse" followed by a "presence pulse" from the
device starts every transaction:

- **Write 0:** master holds the line low for most of the ~60 µs slot.
- **Write 1 / read:** master pulses low briefly, then releases; the device may hold it low to
  signal a 0.

It's a timing-critical, single-ended bus — conceptually the same kind of edge-timed protocol
you can drive with `gpio_set_pin`/`gpio_get_pin` and tight delays (see [GPIO](gpio.md)),
which is why understanding 1-Wire pays off beyond iButton.

### The key types

| Type | Detail |
|---|---|
| **DS1990A / Dallas** | 64-bit ROM: 8-bit family code + 48-bit unique serial + 8-bit CRC. **Static, unauthenticated** — a wired cousin of EM4100. |
| **Cyfral / Metakom** | Soviet-era intercom standards still common in Eastern Europe; different bit framing. The Flipper supports these **UID-only**. |

For a DS1990A the entire "secret" is that 64-bit ROM — no challenge/response. Read it once,
emulate forever. (Official iButton support: Dallas **DS1990/DS1992/DS1996/DS1971**, plus
Cyfral and Metakom at UID level — see the [iButton docs](https://docs.flipper.net/zero/ibutton).)

## 2 · On the Flipper

The iButton contacts are on the **top edge** of the Flipper (and the same pads are used for
the GPIO 1-Wire pin). The app does Read / Save / Emulate / Write (to a blank).

<div class="flipper-sim" data-title="iButton app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "iButton", "items": [
      { "label": "Read",  "go": "read" },
      { "label": "Saved", "go": "saved" },
      { "label": "Add Manually", "go": "manual" }
    ]},
    "read":  { "title": "Read", "lines": ["Touch the key to", "the contacts on", "the top edge"] },
    "saved": { "title": "Saved", "items": [ { "label": "intercom_key", "go": "key" } ] },
    "key":   { "title": "intercom_key", "items": [ { "label": "Emulate", "go": "emu" }, { "label": "Write Blank", "go": "write" }, { "label": "Info", "go": "info" } ] },
    "emu":   { "title": "Emulate", "lines": ["Dallas DS1990A", "Touch Flipper's", "contacts to reader"] },
    "write": { "title": "Write", "lines": ["Touch a writable", "blank key, OK"] },
    "info":  { "title": "Info", "lines": ["Dallas", "64-bit ROM, no crypto"] }
  }
}
</script>
</div>

### Anatomy of an `.ibtn` file

```ini title="intercom_key.ibtn"
Filetype: Flipper iButton key
Version: 1
Key type: Dallas
Data: 01 29 B5 4D 8A 00 00 C7
```

`Key type` plus an 8-byte ROM. Byte 0 is the family code (`01` = DS1990A), the middle six are
the serial, and the last is the CRC. As with LF RFID, the file *is* the credential.

### CLI

```text
ikey read       # read a touched key
ikey emulate    # emulate the saved key
```

!!! note "MicroPython angle"
    There's no high-level `ibutton` Python API, but the underlying **1-Wire is just timed
    GPIO**. As an exercise you can bit-bang a 1-Wire reset/presence detect on a header pin and
    watch the device answer — a great way to *feel* the protocol the firmware abstracts away.

## 3 · Real-World Lab

!!! example "Lab: an intercom key you own"
    Use the iButton fob for *your own* building/locker, or buy DS1990A keys + blanks to play
    with. Don't clone a key to premises you don't control.

    1. **Read** your key on the top-edge contacts; note `Dallas` and the 64-bit ROM.
    2. **Info** — confirm there's no authentication, just the ROM (and verify the CRC byte by
       hand if you're feeling thorough).
    3. (With your *own* blank) **Write Blank** to clone it, and read both to confirm a match.
    4. Edit a byte in the `.ibtn` on your PC, re-import, and watch the emulated ROM change.

    **Defence takeaway:** Dallas iButton is a wired EM4100 — a static serial with no secret.
    Its only real protection is that an attacker must physically touch the contacts.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "How does iButton differ physically from NFC/RFID?",
    "options": ["It's optical", "It's galvanic contact (1-Wire), not field coupling", "It uses 2.4 GHz", "It needs a battery"],
    "answer": 1,
    "explain": "iButton is a wired 1-Wire contact interface — no inductive/near-field coupling."
  },
  {
    "q": "What is the entire 'secret' of a DS1990A key?",
    "options": ["A 128-bit AES key", "A rolling counter", "A static 64-bit ROM (family + serial + CRC)", "A PIN"],
    "answer": 2,
    "explain": "It's unauthenticated: just a fixed 64-bit ROM, like a wired EM4100."
  },
  {
    "q": "Why does understanding 1-Wire help with the GPIO chapter?",
    "options": ["It doesn't", "1-Wire is edge-timed single-line signalling you can bit-bang with timed GPIO", "It uses the ADC", "It's PWM"],
    "answer": 1,
    "explain": "1-Wire is precise low/high timing on one line — exactly the kind of thing timed gpio_set/get can drive."
  }
]
</script>
</div>

---
*Next: [Bad USB](bad-usb.md) — when the Flipper pretends to be your keyboard.*
