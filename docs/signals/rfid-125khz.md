---
icon: lucide/scan-line
---

# 125 kHz RFID (Low-Frequency)

<span class="fz-chip file">FILE</span> <span class="fz-chip cli">CLI</span>
The thick white "prox" card clipped to a million lanyards is low-frequency RFID. The
Flipper reads, saves, and emulates the common LF families (EM4100, HID Prox, Indala). As
with Sub-GHz, this lives entirely in firmware — **no MicroPython**.

## 1 · Theory & Physics

### Inductive coupling, not radio

At 125 kHz the wavelength is ~2.4 km (see the [EM primer](../physics-primer/em-spectrum.md)),
so the few-cm antenna is *deep* in the **reactive near field**. There is no radiated wave to
speak of — the reader and card form a loosely-coupled **air-core transformer**.

<canvas class="anim" data-type="rfid"></canvas>
<p class="fz-figcaption">The reader coil's oscillating flux threads the tag coil, inducing a voltage (Faraday's law) that powers the passive tag.</p>

The reader drives its coil at 125 kHz, creating an oscillating magnetic flux $\Phi_B$. The
card's coil sits in that flux and, by Faraday's law,

$$
\mathcal{E} = -\,\frac{d\Phi_B}{dt}
$$

a voltage is induced. A passive LF tag has **no battery** — it harvests all of its operating
power from this induced EMF. That's why range is a couple of centimetres and orientation
matters: tilt the card and you cut the flux linkage.

### How the tag talks back: load modulation

The tag has no transmitter. To send its ID, it **modulates its own load** — switching a
resistor/capacitor across its coil on and off. That changes the current drawn from the
reader's field, which the reader detects as a tiny change in its own coil voltage. The bits
are encoded by **OOK + Manchester** at a sub-rate of the carrier.

For an **EM4100** tag the payload is just **40 bits**: a fixed header, an 8-bit version/
customer ID, a 32-bit unique ID, plus row/column parity. No challenge, no response, **no
secret** — the card simply recites its number whenever energised. It is a *wireless
barcode*.

!!! danger "Why LF prox is fundamentally weak"
    An EM4100 broadcasts a static, unauthenticated number. Anyone who can get a coil within
    a few centimetres (a brush past in a lift) can read it, and a blank T5577 can be written
    to emulate it. There is no cryptography to break because there is none to begin with.

## 2 · On the Flipper

### Walking the app

<div class="flipper-sim" data-title="125 kHz RFID app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "125 kHz RFID", "items": [
      { "label": "Read",  "go": "read" },
      { "label": "Saved", "go": "saved" },
      { "label": "Add Manually", "go": "manual" }
    ]},
    "read":  { "title": "Read", "lines": ["Hold card to back", "Reading EM4100,", "HID, Indala..."] },
    "saved": { "title": "Saved", "items": [ { "label": "gym_fob", "go": "fob" } ] },
    "fob":   { "title": "gym_fob", "items": [ { "label": "Emulate", "go": "emu" }, { "label": "Write to T5577", "go": "write" }, { "label": "Info", "go": "info" } ] },
    "emu":   { "title": "Emulate", "lines": ["EM4100", "ID: 1A:2B:3C:4D:5E", "Broadcasting..."] },
    "write": { "title": "Write", "lines": ["Place blank T5577", "on the back", "OK = write"] },
    "info":  { "title": "Info", "lines": ["EM4100", "40-bit, no crypto"] }
  }
}
</script>
</div>

- **Read** energises the field and decodes EM4100 / HID Prox / Indala automatically.
- **Saved → Emulate** makes the Flipper *pretend to be the card*.
- **Write to T5577** burns the saved ID onto a blank rewritable LF tag — a physical clone.

### Anatomy of a `.rfid` file

```ini title="gym_fob.rfid"
Filetype: Flipper RFID key
Version: 1
Key type: EM4100
Data: 1A 2B 3C 4D 5E
```

That's the whole secret: a 5-byte (40-bit) number. Compare with how much a Sub-GHz rolling
code or an NFC MIFARE sector key carries — LF prox is the simplest credential the Flipper
handles.

### CLI

```text
rfid read              # read and decode an LF tag
rfid emulate           # emulate the last-read tag
```

!!! note "MicroPython can't drive the LF antenna"
    The 125 kHz front-end isn't exposed to Python. But the `.rfid` file is trivial to parse,
    which is a nice way to reason about ID structure:

    ```python title="parse an EM4100 .rfid"
    import io
    with io.open('/ext/lfrfid/gym_fob.rfid', 'r') as fh:
        for line in fh:
            if line.startswith('Data:'):
                bytes_ = line.split(':')[1].split()
                print('40-bit ID =', ''.join(bytes_))
    ```

## 3 · Real-World Lab

!!! example "Lab: an old EM4100 fob you own"
    Use a disused gym/locker fob, or buy a pack of blank **T5577** cards plus an EM4100 fob
    to experiment with. Do **not** clone a fob that opens something you don't control.

    1. **Read** the fob. The Flipper shows `EM4100` and a 5-byte ID.
    2. **Save** it, open **Info** — note there's no key, no counter, nothing but the number.
    3. (Optional, with your *own* blank tag) **Write to T5577** to make a working clone, and
       confirm both read identically.
    4. Inspect the `.rfid` file on your PC. Try changing one hex byte, re-import, and see how
       the emulated ID changes — the ID *is* the data.

    **Defence takeaway:** LF prox should be treated as a username, never a secret. Real
    security here means upgrading to authenticated 13.56 MHz credentials (see [NFC](nfc.md)).

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "A passive 125 kHz tag gets its operating power from…",
    "options": ["a tiny internal battery", "the EMF induced by the reader's oscillating field", "the sun", "the Flipper's USB port"],
    "answer": 1,
    "explain": "It's near-field inductive: Faraday's law induces a voltage in the tag coil, powering the chip."
  },
  {
    "q": "How does an EM4100 tag send its ID back to the reader?",
    "options": ["It transmits at 125 kHz", "Load modulation — switching its coil load to perturb the reader's field", "Over Bluetooth", "Via an LED"],
    "answer": 1,
    "explain": "Passive tags have no transmitter; they modulate the load on their coil, which the reader senses."
  },
  {
    "q": "Why is an EM4100 credential considered insecure by design?",
    "options": ["The encryption is weak", "It's a static, unauthenticated 40-bit number with no secret", "It uses rolling codes", "It needs a PIN"],
    "answer": 1,
    "explain": "There's no crypto at all — it just recites a fixed number, easily read and cloned to a T5577."
  }
]
</script>
</div>

---
*Next: [NFC](nfc.md) — same near-field idea, ten times the frequency and a lot more brains.*
