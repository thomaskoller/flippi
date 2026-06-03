---
icon: lucide/shield-check
---

# U2F / FIDO

<span class="fz-chip cli">USB/BLE</span>

!!! tip "In plain English"
    **One sentence:** the Flipper as a **login security key** — the tap-to-confirm second
    factor that stops phishing, like a YubiKey.
    **Everyday analogy:** a physical key for your online accounts. The website asks "prove
    it's really you," the Flipper signs the challenge, you tap to confirm.
    **You meet it in:** the "Security key" 2FA option on GitHub, Google, Microsoft, etc.
    **What the Flipper actually does:** acts as a FIDO U2F authenticator over USB/BLE. Note it
    stores keys in normal storage (not a tamper-proof secure element), so treat it as a
    *learning* key, not a high-security one.

A refreshing change of pace: this is the Flipper as a **defensive** tool. It can act as a
**U2F/FIDO** hardware security key for two-factor authentication — a YubiKey-style second
factor for your own GitHub, Google, etc. Understanding it also teaches the public-key
challenge-response that underpins phishing-resistant auth.

## 1 · Theory & Crypto

### The problem U2F solves: phishing

A TOTP code (the 6 digits from an authenticator app) can be phished — type it into a fake
site and the attacker relays it. U2F/FIDO fixes this with **origin-bound public-key
cryptography**: the key signs a challenge *together with the website's origin*, so a
credential for `github.com` is useless to `gith-ub.com`.

### Registration and authentication

U2F uses **ECDSA** over the NIST **P-256** curve. Two phases:

=== "Registration"

    1. The site sends a challenge and its **AppID/origin**.
    2. The authenticator generates a fresh **key pair** bound to that origin, keeps the
       private key, and returns the **public key** + a **key handle**.
    3. The site stores the public key against your account.

=== "Authentication"

    1. The site sends a challenge (a random nonce) and the key handle.
    2. The authenticator signs `challenge ‖ origin ‖ counter` with the **private key** and a
       **physical user-presence** tap.
    3. The site verifies the signature with the stored public key.

A signature proves possession of the private key without ever revealing it:

$$
\text{verify}\big(\text{pub},\ m,\ \sigma\big) \stackrel{?}{=} \text{true}, \qquad
m = \text{challenge} \,\|\, \text{origin} \,\|\, \text{counter}
$$

### The monotonic counter (clone detection)

Each authenticator keeps a **counter** that increments every signature. The server tracks the
last value it saw; if it ever sees a counter go *backwards or stall*, that hints a key was
**cloned**. It's an elegant, low-cost anti-duplication signal baked into the protocol.

!!! warning "The Flipper is not a secure element"
    A real hardware key (YubiKey, Titan) stores its private keys in tamper-resistant
    silicon. The Flipper keeps U2F key material in regular firmware/SD storage, so it's
    great for **learning** and a convenient backup factor, but it is **not** as resistant to
    extraction as a dedicated secure-element token. Treat it accordingly.

## 2 · On the Flipper

The U2F app presents the Flipper to the host (over USB, and on some setups BLE) as a FIDO
authenticator. When a site needs a touch, the Flipper prompts you to confirm — that press is
the "user presence" check.

!!! note "Windows 11 caveat"
    The Flipper isn't a certified FIDO device, so **Windows 11 may refuse it for Windows
    sign-in** specifically. It still works fine as a 2FA key for websites (GitHub, Google,
    etc.) in your browser. ([U2F docs](https://docs.flipper.net/zero/u2f).)

<div class="flipper-sim" data-title="U2F app">
<script type="application/json">
{
  "start": "main",
  "screens": {
    "main": { "title": "U2F", "items": [
      { "label": "Connect & Use", "go": "use" },
      { "label": "About", "go": "about" }
    ]},
    "use":   { "title": "U2F", "lines": ["Waiting for site...", "Press OK to confirm", "presence when asked"] },
    "about": { "title": "About", "lines": ["FIDO U2F token", "ECDSA P-256", "Tap = user presence"] }
  }
}
</script>
</div>

The Flipper stores its U2F key material in a file on the device. **Back it up** — losing it
means losing that second factor (which is exactly why services insist you register a *second*
key or keep recovery codes).

!!! note "Not MicroPython"
    U2F is a firmware feature using the device's crypto and USB stack; it isn't part of the
    `flipperzero` Python module.

## 3 · Real-World Lab

!!! example "Lab: register the Flipper as a 2FA key on your own account"
    Use an account **you own** (GitHub and Google both support FIDO security keys).

    1. In your account's **Security → 2FA / Security keys** settings, choose **Add security
       key**.
    2. Open the Flipper's **U2F** app, connect via USB, and follow the browser prompt.
    3. When the Flipper prompts, **press OK** — that's the user-presence tap during
       registration.
    4. Log out and back in; when challenged, confirm on the Flipper. You've completed a full
       public-key challenge-response without ever exposing a private key.
    5. **Back up** the U2F key file, and register a *second* factor (a phone or another key)
       so a lost Flipper doesn't lock you out.

    **Defence takeaway:** FIDO's origin binding is what makes it phishing-resistant — the
    single biggest upgrade over TOTP. Living through the registration/auth flow makes that
    concrete.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Why is U2F phishing-resistant when TOTP codes are not?",
    "options": ["The codes are longer", "Signatures are bound to the site's origin, so a credential for one domain is useless on another", "It uses a faster hash", "It works offline"],
    "answer": 1,
    "explain": "Origin binding means a signature for github.com won't validate for a look-alike phishing domain."
  },
  {
    "q": "What does the monotonic signature counter let a server detect?",
    "options": ["A weak password", "Possible cloning of the authenticator", "A phishing site", "An expired certificate"],
    "answer": 1,
    "explain": "If the counter regresses or stalls, two copies of the key may exist — a clone signal."
  },
  {
    "q": "Compared with a YubiKey, the Flipper as U2F is mainly limited by…",
    "options": ["slower USB", "no tamper-resistant secure element for key storage", "lack of ECDSA", "needing BLE"],
    "answer": 1,
    "explain": "It stores keys in ordinary firmware/SD storage rather than a dedicated secure element."
  }
]
</script>
</div>

---
*Next: the [Glossary](../reference/glossary.md) and [Resources](../reference/resources.md).*
