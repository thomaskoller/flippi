---
icon: lucide/list
---

# Glossary

Quick definitions for the terms used across the site. Where a concept has its own treatment,
the chapter is linked.

ADC
:   Analog-to-Digital Converter. Turns a voltage into a number. On the Flipper:
    `adc_read_pin_value` / `adc_read_pin_voltage`. See [GPIO](../signals/gpio.md).

Anticollision
:   The NFC handshake that singles out one tag among several and returns its UID/ATQA/SAK
    before any authentication. See [NFC](../signals/nfc.md).

ASK / OOK
:   Amplitude-Shift Keying / On-Off Keying. Encoding bits by varying (or fully gating) the
    carrier amplitude. The dominant Sub-GHz and IR scheme. See [Modulation](../physics-primer/modulation.md).

BLE
:   Bluetooth Low Energy, 2.4 GHz. Runs on the STM32WB55's dedicated M0+ radio core.

CC1101
:   The TI sub-gigahertz transceiver behind the Flipper's [Sub-GHz](../signals/sub-ghz.md) app.

CRYPTO1
:   NXP's proprietary 48-bit cipher in MIFARE Classic — cryptographically broken.

dBm
:   Power in decibels relative to 1 mW. $0\,\text{dBm}=1\,\text{mW}$; +10 dB = ×10.
    See [EM Spectrum](../physics-primer/em-spectrum.md).

DuckyScript
:   The plain-text scripting language for [Bad USB](../signals/bad-usb.md) keystroke payloads.

ECDSA
:   Elliptic Curve Digital Signature Algorithm (P-256 for U2F). See [U2F](../signals/u2f.md).

EM4100
:   A common 125 kHz LF RFID chip storing a static, unauthenticated 40-bit ID. See
    [RFID](../signals/rfid-125khz.md).

Far field
:   The radiative region (distance ≫ λ) where EM energy propagates as a wave; Sub-GHz/BLE.
    Contrast near field.

FSK
:   Frequency-Shift Keying. Bits select between two carrier frequencies; noise-robust. See
    [Modulation](../physics-primer/modulation.md).

GPIO
:   General-Purpose I/O pins. Fully scriptable in MicroPython. See [GPIO](../signals/gpio.md).

HID
:   Human Interface Device — the trusted USB class abused by [Bad USB](../signals/bad-usb.md).

iButton
:   A Dallas 1-Wire contact key (e.g. DS1990A). See [iButton](../signals/ibutton.md).

ISM band
:   Unlicensed Industrial/Scientific/Medical radio bands (315/433/868/915 MHz) where most
    cheap remotes live.

Load modulation
:   How a passive RFID/NFC tag "talks back" — switching its coil load to perturb the reader's
    field. See [RFID](../signals/rfid-125khz.md) and [NFC](../signals/nfc.md).

MIFARE Classic
:   A widely deployed (and weakly secured) 13.56 MHz card family using CRYPTO1. See
    [NFC](../signals/nfc.md).

mp-flipper
:   The community [MicroPython port](https://ofabel.github.io/mp-flipper/) providing the
    `flipperzero` module. See [MicroPython setup](../micropython/setup.md).

Near field
:   The reactive region (distance ≲ λ) where energy is stored, not radiated; coupling is
    inductive. 125 kHz RFID and NFC. See [EM Spectrum](../physics-primer/em-spectrum.md).

NEC
:   A common 38 kHz infrared protocol using pulse-distance encoding. See [Infrared](../signals/infrared.md).

PWM
:   Pulse-Width Modulation. A fixed-frequency square wave whose duty cycle sets average
    voltage. `pwm_start`. See [GPIO](../signals/gpio.md).

Rolling code
:   A remote scheme (KeeLoq etc.) where each press sends a fresh code, defeating naive replay.
    See [Sub-GHz](../signals/sub-ghz.md).

RSSI
:   Received Signal Strength Indicator, in dBm — how strong a captured signal is.

`.sub` / `.nfc` / `.rfid` / `.ir` / `.ibtn`
:   Flipper's on-SD file formats for Sub-GHz, NFC, LF RFID, infrared, and iButton captures.
    Each chapter dissects its format.

STM32WB55
:   The Flipper's dual-core MCU (Cortex-M4 app core + M0+ radio core). See
    [Device Tour](../getting-started/device-tour.md).

T5577
:   A rewritable 125 kHz tag used to clone LF credentials onto a blank. See [RFID](../signals/rfid-125khz.md).

U2F / FIDO
:   Origin-bound public-key second-factor authentication. See [U2F](../signals/u2f.md).

UID
:   Unique Identifier of an RFID/NFC tag, returned during anticollision (not a secret).
