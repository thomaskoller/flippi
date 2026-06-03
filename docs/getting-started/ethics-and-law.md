---
icon: lucide/scale
---

# Ethics & Law

You're a pen tester, so none of this is new — but the Flipper makes a *lot* of attacks
trivially easy, which means it's worth being deliberate about scope. This page is the
contract for everything else on the site.

## The one rule

!!! danger "Test only what you own or are explicitly authorized to test"
    Every lab in this site is framed around **your own devices**: your TV, your own access
    fob, a cheap doorbell you bought to experiment with, your own 2FA accounts. The moment
    a target belongs to someone else, you need **written authorization** (an engagement
    scope, a bug-bounty policy, or explicit owner consent).

## Why this device specifically needs care

The Flipper collapses the skill barrier. Capturing and replaying a static-code garage
remote used to require an SDR and some DSP knowledge; now it's three button presses. Two
consequences:

- **The legal exposure is real and immediate.** Replaying *someone else's* car/garage
  remote, cloning *someone else's* access card, or transmitting on restricted bands can be
  a serious offence — unauthorized access, interception of communications, or illegal RF
  emission, depending on jurisdiction.
- **Transmitting is regulated even when no "hacking" is involved.** Sub-GHz and other
  bands are governed by your national radio regulator (FCC, Ofcom, BNetzA, …). Custom
  firmware that unlocks a frequency does **not** make it legal for you to transmit there.

## A quick decision checklist

Before any transmit/clone/emulate action, run this mentally:

- [ ] Do I **own** the target device, or do I have **explicit written permission**?
- [ ] Is the **frequency / protocol** legal for me to *transmit* on here?
- [ ] Am I capturing data that's **personal** (someone's badge ID, card UID)? If so, do I
      have a basis to handle it, and a plan to delete it?
- [ ] Could this action **disrupt** something safety-relevant (a real gate, an alarm, a
      medical/industrial device)? If unsure, stop.
- [ ] Is **read/observe** enough to learn what I need, instead of **replay/clone**?

When in doubt, the read-only path teaches you almost everything anyway — most chapters
note where you can learn from *receiving* without ever transmitting.

## Read vs. write: the safer learning posture

| Action | Risk | Good for learning? |
|---|---|---|
| **Receive / read / detect** | Low (passive) | ✅ Almost always sufficient |
| **Decode / inspect a file** | Low (offline) | ✅ The real "aha" moments live here |
| **Emulate / replay / transmit** | High (active, often regulated) | Only on devices you own |

## Responsible disclosure

If, while poking at your own gear, you discover a genuine vulnerability in a product
(a static-code remote, a default-keyed card system), treat it like any other finding:
contact the vendor, give them time, don't publish weaponized specifics against deployed
systems you don't control.

!!! note "This site's stance"
    Content here is intentionally **educational and read-biased**. Where an attack is
    inherently active (replay, BadUSB), the lab targets *your own* device and the writeup
    focuses on *understanding and defending against* it — not on victimizing third parties.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Custom firmware unlocks a Sub-GHz frequency your region restricts. Can you transmit on it?",
    "options": ["Yes — the firmware allows it", "Only if it's legal for you to transmit there regardless of firmware", "Yes, below 1 watt", "Only at night"],
    "answer": 1,
    "explain": "Software locks and the law are independent. Legality is set by your radio regulator, not the firmware."
  },
  {
    "q": "You want to learn how your office badge works. What's the lowest-risk first step?",
    "options": ["Clone it and test the clone on the door", "Read/inspect its UID and data offline", "Brute-force the reader", "Replay it during business hours"],
    "answer": 1,
    "explain": "Reading and inspecting is passive and teaches you the structure without any active, potentially unauthorized step."
  },
  {
    "q": "Which target is unambiguously fair game for a lab?",
    "options": ["A neighbour's car fob", "A cheap 433 MHz doorbell you bought yourself", "A hotel room you're staying in", "A coworker's transit card"],
    "answer": 1,
    "explain": "You own it, so you can do whatever you like with it. The others involve someone else's property or system."
  }
]
</script>
</div>

---
*Next: the [Physics Primer](../physics-primer/em-spectrum.md), or jump to [MicroPython setup](../micropython/setup.md).*
