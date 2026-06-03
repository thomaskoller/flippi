---
icon: lucide/circuit-board
---

# GPIO & Hardware

<span class="fz-chip run">PYTHON</span>

!!! tip "In plain English"
    **One sentence:** the row of pins on top of the Flipper turns it into a tiny **Arduino** —
    you can wire up LEDs, buttons, and sensors and control them with code.
    **Everyday analogy:** the Flipper's "Lego studs" for electronics. Each pin can switch
    on/off, read a knob, or talk to a chip.
    **You meet it in:** breadboard projects, hobby electronics, talking to add-on modules.
    **What the Flipper actually does:** real **MicroPython** controls digital I/O, interrupts,
    analog input (ADC), PWM, and two UARTs — almost everything in this chapter is runnable.

The GPIO header turns the Flipper into a general-purpose hacking microcontroller, and it's
**fully exposed to MicroPython** — digital I/O, interrupts, ADC, PWM, and two UARTs. This is
the most "Arduino-like" chapter, and almost everything here runs as real code.

## 1 · Theory & Physics

### Digital I/O and the push-pull output stage

A GPIO output is a pair of transistors (push-pull) that connect the pin to either 3.3 V or
ground. An input is a high-impedance sense node, optionally tied through an internal
**pull-up/pull-down** resistor so a floating wire reads a defined level. The
[`flipperzero`](../micropython/flipperzero-api.md) constants map straight onto these:
`GPIO_MODE_OUTPUT_PUSH_PULL`, `GPIO_MODE_INPUT`, `GPIO_PULL_UP`, etc.

!!! warning "3.3 V logic, and current limits"
    Pins are **3.3 V**. Don't feed 5 V signals into an input without level-shifting. Each pin
    sources/sinks only a few mA — drive an LED through a resistor, and switch anything
    bigger (motor, 12 V strike) through a **transistor or relay**, never directly.

### ADC: sampling an analog world

The `adc_read_pin_*` functions run the STM32's successive-approximation ADC. A reading is

$$
\text{counts} = \left\lfloor \frac{V_\text{in}}{V_\text{ref}}\,(2^{N}-1) \right\rfloor
$$

for an $N$-bit converter. `adc_read_pin_value()` gives you the raw counts;
`adc_read_pin_voltage()` does the arithmetic and returns millivolts. By **Nyquist**, to
faithfully capture a signal you must sample at >2× its highest frequency — fine for a
potentiometer or a slow sensor, not for audio.

### PWM: faking analog with a duty cycle

`pwm_start(pin, frequency, duty)` toggles a pin at a fixed frequency; the **duty cycle** sets
the average voltage $\bar V = D\cdot V_\text{high}$. That's how you dim an LED or set a servo
without a DAC. Low frequencies (a few Hz) you'll *see* blink; raise it to kHz and the eye
integrates it into smooth brightness.

## 2 · On the Flipper

The pins MicroPython can name: `PA7, PA6, PA4, PB2, PB3, PC0, PC1, PC3` (see the
[Device Tour](../getting-started/device-tour.md) for the header map). The header also carries
3.3 V and 5 V power and ground.

### Blink — the "hello world" of hardware

```python title="blink.py — external LED on PA7 (LED + ~330Ω to GND)"
import flipperzero as f0
import time

f0.gpio_init_pin(f0.GPIO_PIN_PA7, f0.GPIO_MODE_OUTPUT_PUSH_PULL)
for _ in range(10):
    f0.gpio_set_pin(f0.GPIO_PIN_PA7, True)
    time.sleep_ms(250)
    f0.gpio_set_pin(f0.GPIO_PIN_PA7, False)
    time.sleep_ms(250)
f0.gpio_init_pin(f0.GPIO_PIN_PA7, f0.GPIO_MODE_ANALOG)   # release the pin
```

### Read a button with a pull-up

```python title="button.py — read a switch on PC0"
import flipperzero as f0
import time

# switch between PC0 and GND; pull-up makes 'open' read True, 'pressed' read False
f0.gpio_init_pin(f0.GPIO_PIN_PC0, f0.GPIO_MODE_INPUT, f0.GPIO_PULL_UP)
for _ in range(500):
    pressed = not f0.gpio_get_pin(f0.GPIO_PIN_PC0)
    f0.canvas_clear()
    f0.canvas_set_color(f0.CANVAS_BLACK)
    f0.canvas_set_text(20, 32, 'PRESSED' if pressed else 'released')
    f0.canvas_update()
    time.sleep_ms(20)
f0.gpio_init_pin(f0.GPIO_PIN_PC0, f0.GPIO_MODE_ANALOG)
```

### Interrupts — react without polling

Hardware interrupts call your handler the instant an edge arrives:

```python title="irq.py — PC0 sets, PC1 clears an output on PA7"
import flipperzero as f0
import time

f0.gpio_init_pin(f0.GPIO_PIN_PA7, f0.GPIO_MODE_OUTPUT_PUSH_PULL)
f0.gpio_init_pin(f0.GPIO_PIN_PC0, f0.GPIO_MODE_INTERRUPT_RISE, f0.GPIO_PULL_UP, f0.GPIO_SPEED_VERY_HIGH)
f0.gpio_init_pin(f0.GPIO_PIN_PC1, f0.GPIO_MODE_INTERRUPT_RISE, f0.GPIO_PULL_UP, f0.GPIO_SPEED_VERY_HIGH)

@f0.on_gpio
def on_gpio(pin):
    if pin == f0.GPIO_PIN_PC0:
        f0.gpio_set_pin(f0.GPIO_PIN_PA7, True)
    if pin == f0.GPIO_PIN_PC1:
        f0.gpio_set_pin(f0.GPIO_PIN_PA7, False)

for _ in range(1500):
    time.sleep_ms(10)
for p in (f0.GPIO_PIN_PA7, f0.GPIO_PIN_PC0, f0.GPIO_PIN_PC1):
    f0.gpio_init_pin(p, f0.GPIO_MODE_ANALOG)
```

### Analog in — read a potentiometer

```python title="adc.py — show raw counts and millivolts from PC1"
import flipperzero as f0
import time

f0.gpio_init_pin(f0.GPIO_PIN_PC1, f0.GPIO_MODE_ANALOG)
for _ in range(500):
    raw = f0.adc_read_pin_value(f0.GPIO_PIN_PC1)
    mv  = f0.adc_read_pin_voltage(f0.GPIO_PIN_PC1)
    f0.canvas_clear()
    f0.canvas_set_color(f0.CANVAS_BLACK)
    f0.canvas_set_text(10, 28, '{} counts'.format(raw))
    f0.canvas_set_text(10, 44, '{} mV'.format(mv))
    f0.canvas_update()
    time.sleep_ms(50)
```

### PWM — dim an LED

```python title="pwm.py — visible blink, then fast (smooth) on PA7"
import flipperzero as f0
import time

f0.pwm_start(f0.GPIO_PIN_PA7, 2, 50)    # 2 Hz, 50% — you can see it
time.sleep(3)
f0.pwm_start(f0.GPIO_PIN_PA7, 1000, 25) # 1 kHz, 25% — looks dim but steady
time.sleep(3)
f0.pwm_stop()
```

### UART — talk to another board

```python title="uart.py — send a line, read a reply"
import flipperzero as f0

uart = f0.uart_open(f0.UART_MODE_USART, 115200)
uart.write(b'PING\r\n')
print(uart.readline())
uart.close()
```

!!! note "Wiring a relay safely"
    To switch a mains/12 V device, drive a **relay module** (or a transistor + flyback diode)
    from a GPIO. Power the relay coil from the 5 V pin, control it from a 3.3 V GPIO through
    the module's opto-isolated input. The Flipper never touches the high-voltage side.

## 3 · Real-World Lab

!!! example "Lab: a breadboard you own — LED, button, pot, relay"
    Grab a breadboard, an LED + ~330 Ω resistor, a tactile switch, a 10 kΩ potentiometer,
    and (optionally) a hobby relay module.

    1. Wire the LED to **PA7**/GND and run `blink.py`, then `pwm.py` — watch flicker become
       smooth as frequency rises (your eye low-pass-filtering the PWM).
    2. Wire the button **PC0→GND**, run `button.py`. Add the second switch and run `irq.py`
       to feel the difference between polling and interrupts.
    3. Wire the pot's wiper to **PC1**, run `adc.py`, and turn it — watch counts track
       voltage. Estimate the ADC resolution from how the counts step.
    4. (Optional) Wire a relay module's IN to **PB2**, coil power to **5 V**, and toggle a
       12 V LED strip you own. You've built a Flipper-controlled actuator.

    **Why it matters for pentesting:** this is the muscle behind hardware implants, logic-
    level sniffing, glitching rigs, and sensor tapping. The Flipper is a pocket logic tool.

<div class="quiz" data-title="Test Your Knowledge">
<script type="application/json">
[
  {
    "q": "You wire a switch from PC0 to GND. Which init makes 'open' read True and 'pressed' read False?",
    "options": ["INPUT with PULL_DOWN", "INPUT with PULL_UP", "OUTPUT_PUSH_PULL", "ANALOG"],
    "answer": 1,
    "explain": "A pull-up holds the open line high (True); pressing pulls it to GND (False)."
  },
  {
    "q": "Why does a 1 kHz PWM LED look steadily dim while 2 Hz visibly blinks?",
    "options": ["More power at 1 kHz", "Your eye integrates fast switching into an average brightness", "PWM changes the color", "The ADC smooths it"],
    "answer": 1,
    "explain": "Above the flicker-fusion threshold the eye averages duty cycle into perceived brightness."
  },
  {
    "q": "Best way to switch a 12 V load from a 3.3 V GPIO?",
    "options": ["Connect it directly", "Through a relay or transistor (GPIO controls, not carries, the load)", "Use the ADC pin", "Raise GPIO to 12 V"],
    "answer": 1,
    "explain": "GPIO sources only mA at 3.3 V; use a relay/transistor so the pin only controls the switch."
  },
  {
    "q": "Which of these is NOT exposed to MicroPython on the Flipper?",
    "options": ["GPIO digital out", "ADC voltage read", "Sub-GHz transmit", "PWM"],
    "answer": 2,
    "explain": "GPIO/ADC/PWM are all in the API; the Sub-GHz radio stack is firmware-only."
  }
]
</script>
</div>

---
*Next: [iButton](ibutton.md) — 1-Wire contact keys.*
