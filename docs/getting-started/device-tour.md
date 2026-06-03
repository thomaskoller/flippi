---
icon: lucide/cpu
---

# Device Tour: what's inside the dolphin

Before chasing signals, it pays to know what hardware is generating and receiving them.
The Flipper Zero is a deliberately *modest* embedded computer with a surprisingly broad
set of radios bolted on.

## The brain: STM32WB55

| Part | Detail |
|---|---|
| MCU | STMicroelectronics **STM32WB55RG** |
| Application core | Arm **Cortex-M4F** @ 64 MHz |
| Radio co-processor | Arm **Cortex-M0+** (runs the BLE stack, isolated from app code) |
| Flash | 1 MB |
| RAM | 256 KB SRAM |
| Display | 1.4″ monochrome LCD, **128 × 64** pixels |
| Storage | microSD card |
| Power | ~2000 mAh Li-Po, USB-C charging |
| Link | USB-C (serial + mass storage) and **Bluetooth LE** |

The dual-core split matters: the M0+ owns the 2.4 GHz BLE radio so the M4 can be reset,
reflashed, or crash without taking Bluetooth down with it. Your MicroPython scripts and
the firmware UI all live on the **M4**.

!!! note "Why so little RAM?"
    256 KB total, and MicroPython only gets a slice of it (on the order of tens of KB of
    heap). That constraint shapes the [MicroPython chapter](../micropython/setup.md): no
    giant buffers, no huge data structures.

## The radios and front-ends

Each "signal" chapter on this site maps to one of these front-ends. The Flipper is
essentially a microcontroller wired to a small zoo of dedicated transceivers:

<div class="grid cards" markdown>

-   :satellite: __Sub-GHz — TI CC1101__

    ---

    A dedicated sub-gigahertz transceiver covering **300–348, 387–464, 779–928 MHz**.
    Does OOK/ASK and 2-FSK. This is the chip behind garage remotes and weather stations.
    → [Sub-GHz chapter](../signals/sub-ghz.md)

-   :credit_card: __NFC — ST25R3916__

    ---

    A **13.56 MHz** high-frequency front-end. ISO 14443 A/B, FeliCa, MIFARE, NTAG.
    → [NFC chapter](../signals/nfc.md)

-   :id: __125 kHz RFID__

    ---

    A low-frequency inductive antenna for EM4100, HID Prox, Indala — the classic
    "thick white access card."
    → [RFID chapter](../signals/rfid-125khz.md)

-   :flashlight: __Infrared__

    ---

    A wide-angle IR receiver plus a high-power IR LED — a universal remote with a
    learning mode.
    → [Infrared chapter](../signals/infrared.md)

-   :electric_plug: __1-Wire / iButton__

    ---

    Two contacts on the top edge speak Dallas 1-Wire for iButton keys.
    → [iButton chapter](../signals/ibutton.md)

-   :gear: __GPIO header__

    ---

    18 pins of 3.3 V GPIO, plus UART/SPI/I²C/1-Wire and 3.3 V & 5 V power rails.
    → [GPIO chapter](../signals/gpio.md)

</div>

## The GPIO header

The 18-pin header along the top edge is your gateway to the physical world (and the only
place MicroPython can drive electrical signals directly). It carries power rails, a UART,
SPI, I²C, and several general-purpose pins.

The pins MicroPython can address by name are:

| `flipperzero` constant | STM32 pin | Common alt-function |
|---|---|---|
| `GPIO_PIN_PA7` | PA7 | SPI MOSI |
| `GPIO_PIN_PA6` | PA6 | SPI MISO |
| `GPIO_PIN_PA4` | PA4 | SPI CS |
| `GPIO_PIN_PB2` | PB2 | — |
| `GPIO_PIN_PB3` | PB3 | SPI SCK |
| `GPIO_PIN_PC0` | PC0 | — |
| `GPIO_PIN_PC1` | PC1 | — / ADC |
| `GPIO_PIN_PC3` | PC3 | — / ADC |

!!! warning "3.3 V logic"
    The GPIO pins are **3.3 V** logic. The header also exposes a **5 V** power pin (handy
    for relays and some sensors), but do **not** feed 5 V *signals* back into a GPIO input
    without level-shifting. There's also a 3.3 V rail you can enable from the GPIO menu /
    via the API.

## A mental model

Think of the Flipper as **one small CPU multiplexed across many physical layers**. The
CPU never "sees radio" directly — it configures a transceiver (CC1101, ST25R3916, …),
hands it bytes or timing patterns, and reads back what the chip demodulated. That's why
MicroPython can blink an LED or bit-bang a GPIO but *cannot* synthesize a 433 MHz
transmission: the radio PHY lives in firmware drivers talking to dedicated silicon.

Keep that picture in mind — every chapter is really "how does the CPU talk to *this*
front-end, and what physics is the front-end doing on its behalf?"

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "Which core runs your MicroPython script and the firmware UI?",
    "options": ["The Cortex-M0+ radio core", "The Cortex-M4 application core", "The CC1101", "The ST25R3916"],
    "answer": 1,
    "explain": "The M4 is the application core. The M0+ is walled off to run the BLE stack."
  },
  {
    "q": "You want to transmit a 433.92 MHz garage-door signal. Which front-end is responsible?",
    "options": ["ST25R3916", "The infrared LED", "TI CC1101", "The 125 kHz antenna"],
    "answer": 2,
    "explain": "433.92 MHz sits in the CC1101's 387–464 MHz band."
  },
  {
    "q": "What is the practical risk of the Flipper's small RAM for your code?",
    "options": ["Scripts can't use floats", "MicroPython heap is tiny — avoid large buffers", "GPIO is disabled", "You can't use the SD card"],
    "answer": 1,
    "explain": "Total SRAM is 256 KB and MicroPython only gets a fraction; keep allocations small."
  }
]
</script>
</div>

---
*Next: [Firmware, SD & CLI](firmware-sd-cli.md) — how to actually drive the thing.*
