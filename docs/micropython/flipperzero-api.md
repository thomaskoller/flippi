---
icon: lucide/book-marked
---

# `flipperzero` API reference

A practical, grouped reference to the [mp-flipper](https://ofabel.github.io/mp-flipper/)
`flipperzero` module, with runnable snippets adapted from the port's own examples. For the
canonical, always-current signatures, keep the
[official reference](https://ofabel.github.io/mp-flipper/) open alongside this page.

Convention used throughout (and in the upstream examples):

```python
import flipperzero as f0
```

## LED & backlight

The RGB status LED and the LCD backlight are all driven through `light_set`.

| Symbol | Meaning |
|---|---|
| `LIGHT_RED`, `LIGHT_GREEN`, `LIGHT_BLUE` | the three RGB channels |
| `LIGHT_BACKLIGHT` | the LCD backlight |
| `light_set(light, brightness)` | set a channel, `brightness` 0–255 |
| `light_blink_start(light, brightness, on_time, period)` | hardware blink (ms) |
| `light_blink_set_color(light)` | change the blink colour on the fly |
| `light_blink_stop()` | stop blinking |

```python title="cycle the LED, then blink"
import flipperzero as f0
import time

for i in range(0, 25):
    b = i * 10
    f0.light_set(f0.LIGHT_RED, b)
    f0.light_set(f0.LIGHT_BACKLIGHT, b)
    time.sleep_ms(100)

f0.light_blink_start(f0.LIGHT_RED, 200, 100, 200)  # brightness, on=100ms, period=200ms
time.sleep(1)
f0.light_blink_set_color(f0.LIGHT_BLUE)
time.sleep(1)
f0.light_blink_stop()
```

## Vibro

```python
f0.vibro_set(True)    # motor on
time.sleep_ms(150)
f0.vibro_set(False)   # motor off
```

## Speaker

`speaker_start(frequency, volume)` plays a tone; `volume` is `0.0`–`1.0`. There are also
108 note constants `SPEAKER_NOTE_C0` … `SPEAKER_NOTE_B8`, plus `SPEAKER_VOLUME_MIN` /
`SPEAKER_VOLUME_MAX`.

```python title="a decaying tone (from the port's speaker example)"
import flipperzero as f0
import time

def play(frequency):
    vol = 0.8
    f0.speaker_start(frequency, vol)
    for _ in range(150):
        vol *= 0.9945679           # exponential decay
        f0.speaker_set_volume(vol)
        time.sleep_ms(1)
    f0.speaker_stop()

for hz in (100.0, 200.0, 300.0, 500.0, 800.0, 1300.0):
    play(hz)
```

## GPIO

The named pins are `GPIO_PIN_PA7`, `PA6`, `PA4`, `PB2`, `PB3`, `PC0`, `PC1`, `PC3`.

| Function | Purpose |
|---|---|
| `gpio_init_pin(pin, mode[, pull][, speed])` | configure a pin |
| `gpio_set_pin(pin, value)` | drive an output (`True`/`False`) |
| `gpio_get_pin(pin)` | read an input → bool |
| `gpio_deinit_pin(pin)` | release a pin |
| `@on_gpio` | decorator: interrupt handler `def handler(pin): …` |

Modes: `GPIO_MODE_INPUT`, `GPIO_MODE_OUTPUT_PUSH_PULL`, `GPIO_MODE_OUTPUT_OPEN_DRAIN`,
`GPIO_MODE_ANALOG`, `GPIO_MODE_INTERRUPT_RISE`, `GPIO_MODE_INTERRUPT_FALL`.
Pull: `GPIO_PULL_NO`, `GPIO_PULL_UP`, `GPIO_PULL_DOWN`.
Speed: `GPIO_SPEED_LOW`, `GPIO_SPEED_MEDIUM`, `GPIO_SPEED_HIGH`, `GPIO_SPEED_VERY_HIGH`.

```python title="blink an external LED on PA7"
import flipperzero as f0
import time

f0.gpio_init_pin(f0.GPIO_PIN_PA7, f0.GPIO_MODE_OUTPUT_PUSH_PULL)
for _ in range(5):
    f0.gpio_set_pin(f0.GPIO_PIN_PA7, True)
    time.sleep_ms(250)
    f0.gpio_set_pin(f0.GPIO_PIN_PA7, False)
    time.sleep_ms(250)
f0.gpio_init_pin(f0.GPIO_PIN_PA7, f0.GPIO_MODE_ANALOG)   # release
```

```python title="interrupt-driven input (two buttons set/clear an output)"
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

## ADC

Initialise the pin as `GPIO_MODE_ANALOG`, then read raw counts or millivolts:

```python title="read a voltage on PC1"
import flipperzero as f0

f0.gpio_init_pin(f0.GPIO_PIN_PC1, f0.GPIO_MODE_ANALOG)
raw = f0.adc_read_pin_value(f0.GPIO_PIN_PC1)     # raw ADC counts
mv  = f0.adc_read_pin_voltage(f0.GPIO_PIN_PC1)   # millivolts
print(raw, mv)
```

## PWM

`pwm_start(pin, frequency, duty)` — `frequency` in Hz, `duty` in percent. Also
`pwm_stop()` and `pwm_is_running()`.

```python title="two PWM settings on PA7"
import flipperzero as f0
import time

f0.pwm_start(f0.GPIO_PIN_PA7, 4, 50)    # 4 Hz, 50% duty
time.sleep(3)
f0.pwm_start(f0.GPIO_PIN_PA7, 1, 25)    # 1 Hz, 25% duty
time.sleep(3)
f0.pwm_stop()
```

## Infrared

This is the marquee feature for Python: full **receive and transmit**.

| Function | Behaviour |
|---|---|
| `infrared_receive([timeout])` | block until a signal is captured; returns a **list of durations** (µs), alternating mark/space |
| `infrared_transmit(signal)` | replay such a list |
| `infrared_is_busy()` | True while the IR peripheral is active |

```python title="receive then replay (the port's IR example)"
import flipperzero as f0
import time

signal = f0.infrared_receive()   # list of microsecond durations
time.sleep(3)
f0.infrared_transmit(signal)     # send it back out
```

The [Infrared chapter](../signals/infrared.md) builds a full mini universal-remote on top
of this, including how to interpret the duration list.

## Canvas (the 128 × 64 LCD)

| Function | Purpose |
|---|---|
| `canvas_width()`, `canvas_height()` | dimensions (128 × 64) |
| `canvas_clear()` | blank the frame buffer |
| `canvas_set_color(color)` | `CANVAS_BLACK` or `CANVAS_WHITE` |
| `canvas_set_text(x, y, str)` | draw text |
| `canvas_set_font(font)`, `canvas_set_text_align(align)` | text style |
| `canvas_draw_dot(x, y)` | single pixel |
| `canvas_draw_line(x0, y0, x1, y1)` | line |
| `canvas_draw_box` / `canvas_draw_frame` | filled / outlined rectangle |
| `canvas_draw_circle` / `canvas_draw_disc` | outlined / filled circle |
| `canvas_update()` | **flush** the frame buffer to the screen |

!!! warning "Nothing shows until `canvas_update()`"
    All drawing goes to an off-screen buffer. Call `canvas_update()` to flip it to the LCD.

```python title="draw text + a box"
import flipperzero as f0
import time

f0.canvas_clear()
f0.canvas_set_color(f0.CANVAS_BLACK)
f0.canvas_draw_frame(2, 2, 124, 60)
f0.canvas_set_text(10, 32, "Hello, Flipper")
f0.canvas_update()
time.sleep(3)
```

## Input (buttons)

Register a handler with the `@on_input` decorator; it receives the `button` and the event
`type`.

Buttons: `INPUT_BUTTON_UP`, `DOWN`, `LEFT`, `RIGHT`, `OK`, `BACK`.
Types: `INPUT_TYPE_PRESS`, `RELEASE`, `SHORT`, `LONG`, `REPEAT`.

```python title="show which button was pressed (port example)"
import time
import flipperzero as f0

@f0.on_input
def on_input(button, type):
    f0.canvas_clear()
    f0.canvas_set_color(f0.CANVAS_BLACK)
    f0.canvas_set_text(20, 32, '{} - {}'.format(button, type))
    f0.canvas_update()

for _ in range(1000):
    time.sleep_ms(10)
```

## Dialog

A built-in modal with a header, body text, and up to two buttons. `dialog_message_show()`
blocks and returns the button that was pressed.

```python title="a yes/no dialog (port example)"
import flipperzero as f0

f0.dialog_message_set_header('Important', 64, 12)
f0.dialog_message_set_text('Shutdown?', 64, 24)
f0.dialog_message_set_button('Yes', f0.INPUT_BUTTON_LEFT)
f0.dialog_message_set_button('No',  f0.INPUT_BUTTON_RIGHT)

while f0.dialog_message_show() is not f0.INPUT_BUTTON_LEFT:
    pass
```

## UART

`uart_open(mode, baudrate)` returns a `UART` object (`read`, `readline`, `readlines`,
`write`, `flush`, `close`). Modes: `UART_MODE_LPUART`, `UART_MODE_USART` — these map to the
two UARTs broken out on the GPIO header.

```python title="echo over the USART pins"
import flipperzero as f0

uart = f0.uart_open(f0.UART_MODE_USART, 115200)
uart.write(b'hello\r\n')
line = uart.readline()
uart.close()
```

---

### At a glance

| Group | Runs in Python? | Chapter |
|---|:--:|---|
| LED / vibro / speaker | ✅ | this page |
| GPIO / ADC / PWM | ✅ | [GPIO](../signals/gpio.md) |
| Infrared TX/RX | ✅ | [Infrared](../signals/infrared.md) |
| Canvas / input / dialog | ✅ | this page |
| UART | ✅ | [GPIO](../signals/gpio.md) |
| Sub-GHz / NFC / RFID / iButton | ❌ (firmware only) | their chapters |
