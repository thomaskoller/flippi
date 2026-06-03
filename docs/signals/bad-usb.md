---
icon: lucide/usb
---

# Bad USB (HID Injection)

<span class="fz-chip file">FILE</span>

!!! tip "In plain English"
    **One sentence:** a keyboard that types by itself — plug the Flipper into a PC and it
    machine-guns pre-written keystrokes faster than any human.
    **Everyday analogy:** an autopilot for your keyboard. To the computer it's just a normal
    keyboard, so it's trusted instantly.
    **You meet it in:** IT automation, demos, and — in the wrong hands — "drop a USB stick"
    attacks. (Here, only ever against a machine **you own**.)
    **What the Flipper actually does:** acts as a USB HID keyboard and runs a **DuckyScript**
    text file of keystrokes. It can't escalate privileges — it's limited to whatever the
    logged-in user can already type.

Plug the Flipper into a computer's USB-C port and it can pretend to be a **keyboard**,
typing at hundreds of words per minute. This is the classic "Rubber Ducky" attack, driven by
**DuckyScript** payload files. There's no exotic RF here — the physics is just USB — but it's
one of the most effective techniques in the box.

## 1 · Theory & Concept

### Why it works: implicit trust in HID

USB devices announce a **class** during enumeration. A Human Interface Device (keyboard) is
trusted *implicitly* — the OS doesn't ask "should this keyboard be allowed to type?" because
keyboards are assumed benign. The Flipper enumerates as a HID keyboard and then **injects
keystrokes** faster than any human, exploiting that trust rather than any software bug.

```text title="the enumeration → injection flow"
Flipper                         Target PC
   │  USB enumerate as "keyboard"   │
   │ ──────────────────────────────▶│
   │      accepted (HID trusted)    │
   │ ◀──────────────────────────────│
   │  GUI+r  →  "powershell ..."     │
   │ ──────────────────────────────▶│   keystrokes executed as the
   │  ENTER                          │   currently logged-in user
   │ ──────────────────────────────▶│
```

The attack is bounded only by what the *logged-in user* can do — Bad USB doesn't escalate
privileges by itself; it automates the keyboard of whoever's session is active.

### DuckyScript

Payloads are plain-text scripts. A taste of the language:

| Command | Meaning |
|---|---|
| `STRING text` | type `text` literally |
| `GUI r` | press Win/Cmd + R |
| `ENTER`, `TAB`, `CTRL`, `ALT` | named keys / modifiers |
| `DELAY 500` | wait 500 ms |
| `REM comment` | comment |
| `DEFAULT_DELAY` / `DEFAULTDELAY` | delay between every line |

```text title="demo.txt — open Notepad and type (Windows; harmless)"
REM A harmless demo for YOUR OWN machine
DELAY 1000
GUI r
DELAY 300
STRING notepad
ENTER
DELAY 800
STRING Hello from a Flipper Zero acting as a keyboard.
```

!!! danger "Keystroke injection is an active attack"
    Run payloads **only against computers you own or are authorized to test**. Even a
    "harmless" script is unauthorized access on someone else's machine. Keep payloads benign
    while learning — opening Notepad proves the concept without doing harm.

### Why layout matters (the #1 gotcha)

The Flipper sends **HID scan codes**, not letters. The target OS maps scan codes to
characters using *its* keyboard layout. If your payload assumes US-QWERTY and the target is
AZERTY/QWERTZ, symbols and letters come out wrong. Flipper Bad USB lets you pick the layout
file to match the target.

## 2 · On the Flipper

Payloads live in `/ext/badusb/` as `.txt`. The app lists them; you select one, plug into the
target, and press run.

<div class="flipper-sim" data-title="Bad USB app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "Bad USB", "items": [
      { "label": "demo.txt", "go": "run" },
      { "label": "hello.txt", "go": "run" },
      { "label": "(layout) US", "go": "layout" }
    ]},
    "run":    { "title": "demo.txt", "lines": ["Connect USB to a", "PC you own.", "OK = run payload"] },
    "layout": { "title": "Layout", "lines": ["Pick a keymap that", "matches the TARGET", "US / DE / FR ..."] }
  }
}
</script>
</div>

!!! note "Not MicroPython"
    Bad USB is a firmware feature reading DuckyScript files; it isn't part of the
    `flipperzero` Python module. The Flipper's USB stack is doing the HID work.

## 3 · Real-World Lab

!!! example "Lab: a benign payload on your own laptop"
    1. Create `/ext/badusb/demo.txt` with the harmless Notepad script above (or the macOS/
       Linux equivalent using `GUI SPACE` for Spotlight, etc.).
    2. Set the **layout** to match your laptop's keyboard.
    3. Plug the Flipper into **your own** computer, run it, and watch Notepad open and type.
    4. Deliberately mismatch the layout and re-run — observe the garbled output. Now you
       understand why layout is the first thing to get right.
    5. **Defensive experiment:** enable a USB-control / device-control policy (or a tool like
       USBGuard on Linux) and see the injection get blocked. That's the real lesson.

    **Defence takeaways:** lock screens when away (injection needs an unlocked session),
    restrict new HID enumeration on sensitive hosts, and disable the Run dialog / constrain
    PowerShell via policy.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Why does HID injection work without exploiting a software bug?",
    "options": ["It cracks the password", "Keyboards are an implicitly trusted USB class; the OS accepts keystrokes", "It uses Sub-GHz", "It overflows a buffer"],
    "answer": 1,
    "explain": "USB HID keyboards are trusted by default; the attack abuses that trust to type commands."
  },
  {
    "q": "Your payload types gibberish on the target. The most likely cause?",
    "options": ["Wrong baud rate", "Keyboard layout mismatch (scan codes mapped differently)", "Low battery", "USB 2.0 vs 3.0"],
    "answer": 1,
    "explain": "The Flipper sends scan codes; a layout mismatch maps them to the wrong characters."
  },
  {
    "q": "What does Bad USB NOT do on its own?",
    "options": ["Type quickly", "Open a Run dialog", "Escalate privileges beyond the logged-in user", "Enumerate as a keyboard"],
    "answer": 2,
    "explain": "It automates the current user's keyboard; it can't by itself gain more rights than that user has."
  }
]
</script>
</div>

---
*Next: [U2F](u2f.md) — the Flipper as a hardware security key.*
