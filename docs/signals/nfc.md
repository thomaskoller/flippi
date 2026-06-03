---
icon: lucide/nfc
---

# NFC (13.56 MHz)

<span class="fz-chip file">FILE</span> <span class="fz-chip cli">CLI</span>

!!! tip "In plain English"
    **One sentence:** the "tap" chip in your bank card, phone, and travel card — the Flipper
    can read it and inspect what's inside.
    **Everyday analogy:** a card reader you can carry, that shows you the card's "name tag"
    and (for weak cards) its contents.
    **You meet it in:** contactless bank cards, subway/transit cards, phone tap-to-pay, hotel
    key cards, office badges, passports.
    **What the Flipper actually does:** reads the card's ID and, for old **MIFARE Classic**
    cards, can recover keys and dump data. It **cannot** clone a payment card or fool a
    properly-secured reader — those use live cryptography it can't replay.

NFC is the grown-up sibling of 125 kHz RFID: same near-field idea, but at **13.56 MHz**
with real protocols and (sometimes) real cryptography. Transit cards, hotel keys, office
badges, contactless payment cards, passports. The front-end is an **ST25R3916**.
Firmware-only — **no MicroPython**.

## 1 · Theory & Physics

### Still near-field, still inductive

At 13.56 MHz, $\lambda \approx 22$ m — again far larger than the antenna, so NFC is **near-
field inductive coupling**, just like [125 kHz RFID](rfid-125khz.md). The reader (PCD) powers
the passive tag (PICC) through its field, and the tag answers by **load modulation** of a
subcarrier at $f_c/16 = 847.5$ kHz.

<canvas class="anim" data-type="nfc"></canvas>
<p class="fz-figcaption">The reader's 13.56 MHz field powers the tag; the tag replies by switching its load, impressing a subcarrier the reader detects.</p>

The higher frequency buys **bandwidth**: NFC moves 106 kbit/s and up (vs. ~2 kbit/s for
EM4100), enough for multi-step protocols, mutual authentication, and kilobytes of data.

### The ISO 14443 family

| Type | Examples | Notes |
|---|---|---|
| ISO 14443**A** | MIFARE Classic/Ultralight, NTAG, most badges | the common case |
| ISO 14443**B** | some ID cards, passports | different modulation/anticollision |
| FeliCa (JIS X 6319) | Japanese transit/pay | Sony's flavour — **read + UID emulation only** |

Every type starts with **anticollision** to single out one tag and learn its **UID**, then
proceeds to type-specific commands.

!!! note "What the Flipper supports per card type"
    Officially the Flipper reads ISO 14443-3A/3B/4A, **MIFARE Classic**, **MIFARE Ultralight /
    Ultralight C**, **NTAG**, and **MIFARE DESFire** (read of unprotected data, limited
    emulation). **FeliCa** is **read + UID-level emulation only** — not full emulation. ([NFC
    docs](https://docs.flipper.net/zero/nfc).)

### MIFARE Classic and why it's a teaching classic

MIFARE Classic divides EEPROM into **sectors**, each protected by two keys (A/B) and
governed by access bits. It uses NXP's proprietary **CRYPTO1** cipher — which is
**thoroughly broken** (weak 48-bit cipher, biased PRNG; *nested* and *darkside* attacks
recover keys, and many deployments still use factory defaults like `FFFFFFFFFFFF`).

!!! danger "Read ≠ break ≠ clone"
    - **Reading the UID** of any tag is trivial and passive.
    - **Recovering keys / dumping sectors** is an *attack* — fine on your own card, not on
      someone's badge.
    - **Note:** the UID-only "clone" the Flipper makes won't fool a reader that checks
      sector data and keys; and payment cards (EMV) use dynamic cryptograms you cannot
      replay. The Flipper reads them, but it is **not** a card-cloning shortcut for payments.

## 2 · On the Flipper

### Walking the app

<div class="flipper-sim" data-title="NFC app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "NFC", "items": [
      { "label": "Read",  "go": "read" },
      { "label": "Saved", "go": "saved" },
      { "label": "Detect Reader", "go": "detect" },
      { "label": "Extra Actions", "go": "extra" }
    ]},
    "read":   { "title": "Read", "lines": ["Hold tag to back", "ISO14443A...", "UID + SAK + ATQA"] },
    "saved":  { "title": "Saved", "items": [ { "label": "my_badge", "go": "badge" } ] },
    "badge":  { "title": "my_badge", "items": [ { "label": "Emulate UID", "go": "emu" }, { "label": "Info", "go": "info" } ] },
    "emu":    { "title": "Emulate", "lines": ["MIFARE Classic 1K", "UID: 04 A2 ...", "Emulating"] },
    "info":   { "title": "Info", "lines": ["MF Classic 1K", "16 sectors", "keys: partial"] },
    "detect": { "title": "Detect Reader", "lines": ["Acts as a tag,", "captures reader", "nonces (mfkey)"] },
    "extra":  { "title": "Extra Actions", "lines": ["Read specific card", "types, run dict", "key attacks"] }
  }
}
</script>
</div>

- **Read** runs anticollision and identifies the tag (UID, SAK, ATQA, type).
- For MIFARE Classic the app can try a **key dictionary** (common/default keys) to dump
  sectors; what it can't crack it leaves blank.
- **Detect Reader** turns the Flipper into a tag to harvest reader nonces for the
  `mfkey32`/`nested` key-recovery workflow — *for your own cards*.

!!! example "Magic cards: when emulation isn't enough"
    A normal MIFARE Classic card has a **read-only** manufacturer block 0 (the UID is fixed at
    the factory), so the Flipper's emulation can't *become* an arbitrary card on real hardware.
    **Magic cards** are special blank tags whose block 0 (and thus UID) **is writable**. The
    Flipper can write a saved dump to **Gen1A, Gen2, and Gen4 ("UMC")** magic cards, producing
    a physical clone — for cards you own. ([Magic-card docs](https://docs.flipper.net/zero/nfc/magic-cards).)

### Anatomy of a `.nfc` file

```ini title="my_badge.nfc (abridged)"
Filetype: Flipper NFC device
Version: 4
Device type: Mifare Classic
UID: 04 A2 7C 5B 9D 31 80
ATQA: 00 04
SAK: 08
Mifare Classic type: 1K
Key A 0: FFFFFFFFFFFF
Key B 0: FFFFFFFFFFFF
Block 0: 04 A2 7C 5B 9D 31 80 08 ...
Block 1: 00 00 00 00 00 00 00 00 ...
...
```

- `UID`/`ATQA`/`SAK` — anticollision identity returned before any auth.
- `Mifare Classic type` — 1K = 16 sectors × 4 blocks × 16 bytes.
- `Key A/B n` — recovered (or default) sector keys. `FFFFFFFFFFFF` everywhere is a dead
  giveaway of an unkeyed/default deployment.
- `Block n` — the raw memory. Block 0 is the read-only manufacturer block (UID + BCC).

### CLI

```text
nfc detect        # poll for a tag and print UID/type
nfc emulate       # emulate the last tag (UID-level)
```

!!! note "MicroPython and NFC"
    The ST25R3916 stack is firmware-only; Python can't poll a tag. It *can* post-process a
    `.nfc` dump — e.g. flag sectors still using the default key:

    ```python title="audit default keys in a .nfc dump"
    import io
    with io.open('/ext/nfc/my_badge.nfc', 'r') as fh:
        for line in fh:
            if line.startswith('Key ') and 'FFFFFFFFFFFF' in line:
                print('default key:', line.strip())
    ```

## 3 · Real-World Lab

!!! example "Lab: read & inspect your own cards (read-only)"
    Gather cards **you own**: a transit card, a hotel key from a past stay, your office
    badge, an NTAG sticker. Goal is *understanding*, not cloning.

    1. **Read** each. Record UID, ATQA, SAK, and the detected type. Notice how many are plain
       MIFARE Classic vs. Ultralight/NTAG vs. "can't fully read."
    2. For an NTAG sticker you own, write a URL to it (NDEF) and read it back — see the data
       model with no crypto in the way.
    3. For a MIFARE Classic card you own, try the key dictionary. If sectors dump with
       `FFFFFFFFFFFF`, that card trusted default keys — a real finding.
    4. Open a `.nfc` file and map sector 0 / block 0; locate the UID and BCC.

    **Defence takeaway:** UID-only systems are spoofable; MIFARE Classic with default or
    crackable keys is little better. Authenticated tech (DESFire EV2/3, SEOS) is the upgrade.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "NFC at 13.56 MHz is fundamentally which kind of link?",
    "options": ["Far-field radiative", "Near-field inductive coupling", "Optical", "Acoustic"],
    "answer": 1,
    "explain": "λ ≈ 22 m ≫ antenna, so like 125 kHz it's near-field inductive — just faster."
  },
  {
    "q": "What can you always obtain from an ISO 14443A tag, even without any keys?",
    "options": ["The full memory", "The sector keys", "The UID (via anticollision)", "The PIN"],
    "answer": 2,
    "explain": "Anticollision returns the UID/ATQA/SAK before any authentication."
  },
  {
    "q": "A MIFARE Classic dump shows Key A = FFFFFFFFFFFF on every sector. That means…",
    "options": ["The card is encrypted strongly", "It uses default factory keys — effectively unprotected", "The Flipper failed", "It's a payment card"],
    "answer": 1,
    "explain": "All-FF is the classic default key; the deployment never set real keys."
  },
  {
    "q": "Why isn't the Flipper a shortcut for cloning a contactless bank card?",
    "options": ["Bank cards aren't NFC", "EMV uses dynamic cryptograms that can't be replayed", "The frequency is different", "It only reads UIDs"],
    "answer": 1,
    "explain": "EMV payment uses per-transaction cryptograms; a static read can't be replayed to pay."
  }
]
</script>
</div>

---
*Next: [Infrared](infrared.md) — and finally, real MicroPython.*
