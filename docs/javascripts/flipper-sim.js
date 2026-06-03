// A tiny mock of the Flipper Zero's 128x64 monochrome UI with a working D-pad.
// Pure JS/DOM, no dependencies. It does NOT emulate firmware — it just lets the
// reader walk a scripted menu tree so a tutorial can show "where the buttons go".
//
// Authoring (md_in_html lets this live inside Markdown):
//
//   <div class="flipper-sim" data-title="Sub-GHz app">
//   <script type="application/json">
//   {
//     "start": "main",
//     "screens": {
//       "main": { "title": "Sub-GHz", "items": [
//         { "label": "Read",       "go": "read" },
//         { "label": "Read RAW",   "go": "raw"  },
//         { "label": "Saved",      "go": "saved" }
//       ]},
//       "read":  { "title": "Read", "lines": ["433.92 MHz", "AM650", "Listening..."] },
//       "raw":   { "title": "Read RAW", "lines": ["Recording...", "press OK to stop"] },
//       "saved": { "title": "Saved", "items": [ { "label": "Garage_1", "go": "main" } ] }
//     }
//   }
//   </script>
//   </div>
//
// Screens are either menus ("items": [{label, go}]) or text screens ("lines": [...]).
// LEFT / Back returns to the previous screen.

(function () {
  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function build(container) {
    if (container.dataset.simReady === "1") return;
    const dataEl = container.querySelector('script[type="application/json"]');
    if (!dataEl) return;
    let model;
    try {
      model = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error("flipper-sim JSON parse error", e);
      return;
    }
    container.innerHTML = "";
    container.dataset.simReady = "1";

    const title = el("div", "fsim-title", container.dataset.title || "Flipper Zero");
    container.appendChild(title);

    const device = el("div", "fsim-device");

    // Screen
    const screen = el("div", "fsim-screen");
    const screenInner = el("div", "fsim-screen-inner");
    screen.appendChild(screenInner);
    device.appendChild(screen);

    // Controls
    const controls = el("div", "fsim-controls");
    const dpad = el("div", "fsim-dpad");
    const btnUp = el("button", "fsim-btn fsim-up", "▲");
    const btnDown = el("button", "fsim-btn fsim-down", "▼");
    const btnLeft = el("button", "fsim-btn fsim-left", "◀");
    const btnRight = el("button", "fsim-btn fsim-right", "▶");
    const btnOk = el("button", "fsim-btn fsim-ok", "OK");
    [btnUp, btnLeft, btnOk, btnRight, btnDown].forEach((b) =>
      b.setAttribute("type", "button")
    );
    dpad.append(btnUp, btnLeft, btnOk, btnRight, btnDown);
    const btnBack = el("button", "fsim-btn fsim-back", "Back");
    btnBack.setAttribute("type", "button");
    controls.append(dpad, btnBack);
    device.appendChild(controls);
    container.appendChild(device);

    // --- state machine -----------------------------------------------------
    const state = { current: model.start, sel: 0, stack: [] };

    function screenDef(id) {
      return (model.screens && model.screens[id]) || { title: "?", lines: ["(missing)"] };
    }

    function draw() {
      const def = screenDef(state.current);
      screenInner.innerHTML = "";
      const hdr = el("div", "fsim-hdr", def.title || "");
      screenInner.appendChild(hdr);

      if (def.items) {
        const list = el("div", "fsim-list");
        def.items.forEach((it, i) => {
          const row = el("div", "fsim-row" + (i === state.sel ? " sel" : ""), it.label);
          list.appendChild(row);
        });
        screenInner.appendChild(list);
      } else {
        const body = el("div", "fsim-body");
        (def.lines || []).forEach((ln) => body.appendChild(el("div", "fsim-line", ln)));
        screenInner.appendChild(body);
      }
    }

    function move(delta) {
      const def = screenDef(state.current);
      if (!def.items) return;
      state.sel = (state.sel + delta + def.items.length) % def.items.length;
      draw();
    }

    function enter() {
      const def = screenDef(state.current);
      if (def.items && def.items[state.sel] && def.items[state.sel].go) {
        state.stack.push({ id: state.current, sel: state.sel });
        state.current = def.items[state.sel].go;
        state.sel = 0;
        draw();
      }
    }

    function back() {
      if (state.stack.length) {
        const prev = state.stack.pop();
        state.current = prev.id;
        state.sel = prev.sel;
        draw();
      }
    }

    btnUp.addEventListener("click", () => move(-1));
    btnDown.addEventListener("click", () => move(1));
    btnOk.addEventListener("click", enter);
    btnRight.addEventListener("click", enter);
    btnLeft.addEventListener("click", back);
    btnBack.addEventListener("click", back);

    // Keyboard support when the device has focus.
    device.tabIndex = 0;
    device.addEventListener("keydown", (ev) => {
      const k = ev.key;
      if (k === "ArrowUp") { move(-1); ev.preventDefault(); }
      else if (k === "ArrowDown") { move(1); ev.preventDefault(); }
      else if (k === "ArrowRight" || k === "Enter") { enter(); ev.preventDefault(); }
      else if (k === "ArrowLeft" || k === "Backspace") { back(); ev.preventDefault(); }
    });

    draw();
  }

  function init() {
    document.querySelectorAll(".flipper-sim").forEach(build);
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(init);
  } else if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
