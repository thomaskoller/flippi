// Dependency-free physics animations rendered to <canvas>.
//
// Authoring:
//   <canvas class="anim" data-type="emwave" data-caption="..."></canvas>
//
// Supported data-type values:
//   emwave   — propagating electromagnetic wave (orthogonal E and B fields)
//   ask      — OOK / ASK: a bitstream gating a carrier on and off
//   fsk      — FSK: a bitstream shifting the carrier between two frequencies
//   ir       — 38 kHz IR carrier gated by NEC-style mark/space pulses
//   nfc      — 13.56 MHz reader field + tag load modulation
//   rfid     — 125 kHz inductive coupling between reader and tag coils
//
// Animations pause when offscreen and honor prefers-reduced-motion (single static frame).

(function () {
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pull theme-ish colors from CSS custom properties when present.
  function colors() {
    const s = getComputedStyle(document.body);
    const accent =
      s.getPropertyValue("--md-accent-fg-color").trim() || "#ff7a18";
    const primary =
      s.getPropertyValue("--md-primary-fg-color").trim() || "#ff6a00";
    const fg =
      s.getPropertyValue("--md-default-fg-color").trim() || "#e0e0e0";
    const faint =
      s.getPropertyValue("--md-default-fg-color--light").trim() ||
      "rgba(160,160,160,0.6)";
    return { accent, primary, fg, faint };
  }

  function setup(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 640;
    const cssH = canvas.clientHeight || 220;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: cssW, h: cssH };
  }

  function axis(ctx, w, h, c) {
    ctx.strokeStyle = c.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }

  // --- individual renderers: (ctx, w, h, t, colors) ----------------------

  function emwave(ctx, w, h, t, c) {
    const mid = h / 2;
    const A = h * 0.32;
    const k = (2 * Math.PI) / (w * 0.5);
    const speed = 1.6;
    axis(ctx, w, h, c);

    // B field (into/out of page) drawn as a vertical, phase-shifted lighter wave
    ctx.strokeStyle = c.faint;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 3) {
      const y = mid + A * 0.6 * Math.sin(k * x - speed * t) * 0.0; // flat ref
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // E field (vertical sinusoid)
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = mid - A * Math.sin(k * x - speed * t);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // B field as perspective wave (smaller, primary color)
    ctx.strokeStyle = c.primary;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const amp = A * 0.5 * Math.sin(k * x - speed * t);
      const y = mid - amp * 0.35;
      const xs = x + amp * 0.4;
      if (x === 0) ctx.moveTo(xs, y);
      else ctx.lineTo(xs, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // propagation arrow
    ctx.fillStyle = c.fg;
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("E", 6, mid - A - 4);
    ctx.fillText("B", 6, mid + 14);
    ctx.fillText("→ propagation (c)", w - 130, mid - 6);
  }

  // Generates a repeatable pseudo-bitstream for the keying demos.
  const BITS = [1, 0, 1, 1, 0, 0, 1, 0];
  function bitAt(phase) {
    const i = Math.floor(phase) % BITS.length;
    return BITS[(i + BITS.length) % BITS.length];
  }

  function ask(ctx, w, h, t, c) {
    const mid = h / 2;
    const A = h * 0.3;
    const bitWidth = w / BITS.length;
    const scroll = (t * 40) % bitWidth;
    axis(ctx, w, h, c);

    // baseband (the digital data) as a faint step line on top
    ctx.strokeStyle = c.faint;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const phase = (x + scroll) / bitWidth;
      const b = bitAt(phase);
      const y = h * 0.16 - b * h * 0.1;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // modulated carrier
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 1) {
      const phase = (x + scroll) / bitWidth;
      const b = bitAt(phase);
      const y = mid - b * A * Math.sin(x * 0.5);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("data", 6, h * 0.1);
    ctx.fillText("OOK / ASK carrier", 6, mid + A + 14);
  }

  function fsk(ctx, w, h, t, c) {
    const mid = h / 2;
    const A = h * 0.3;
    const bitWidth = w / BITS.length;
    const scroll = (t * 40) % bitWidth;
    axis(ctx, w, h, c);

    ctx.strokeStyle = c.faint;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const b = bitAt((x + scroll) / bitWidth);
      const y = h * 0.16 - b * h * 0.1;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let acc = 0;
    let prevX = 0;
    for (let x = 0; x <= w; x += 1) {
      const b = bitAt((x + scroll) / bitWidth);
      const freq = b ? 0.75 : 0.32; // mark vs space
      acc += freq * (x - prevX);
      prevX = x;
      const y = mid - A * Math.sin(acc);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("data", 6, h * 0.1);
    ctx.fillText("FSK carrier (mark / space)", 6, mid + A + 14);
  }

  // 38 kHz IR carrier gated by NEC-like marks and spaces.
  const IR_PULSES = [9, 4.5, 1, 1, 1, 3, 1, 1, 1, 3, 1, 3, 1, 1]; // mark/space units
  function ir(ctx, w, h, t, c) {
    const mid = h / 2;
    const A = h * 0.28;
    const total = IR_PULSES.reduce((a, b) => a + b, 0);
    const unit = w / total;
    const scroll = (t * 60) % w;
    axis(ctx, w, h, c);

    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 1) {
      const xx = (x + scroll) % w;
      // determine if within a "mark"
      let acc = 0,
        mark = true,
        on = false;
      for (let i = 0; i < IR_PULSES.length; i++) {
        const seg = IR_PULSES[i] * unit;
        if (xx >= acc && xx < acc + seg) {
          on = mark;
          break;
        }
        acc += seg;
        mark = !mark;
      }
      const y = on ? mid - A * Math.sin(x * 1.6) : mid;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = c.fg;
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("38 kHz carrier bursts (NEC frame)", 6, mid + A + 16);
  }

  function nfc(ctx, w, h, t, c) {
    const cx = w * 0.5,
      cy = h * 0.5;
    // reader coil pulsing field
    ctx.strokeStyle = c.accent;
    for (let r = 10; r < Math.min(w, h) * 0.5; r += 16) {
      const a = 0.5 + 0.5 * Math.sin(t * 3 - r * 0.05);
      ctx.globalAlpha = 0.15 + 0.35 * a;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // reader (left) and tag (right) glyphs
    ctx.fillStyle = c.fg;
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("reader 13.56 MHz", 6, 16);

    // tag load modulation: small bursts riding the field
    const load = Math.sin(t * 18) > 0 && Math.sin(t * 1.5) > 0;
    ctx.fillStyle = load ? c.primary : c.faint;
    ctx.fillText(load ? "tag: load ON (subcarrier)" : "tag: load off", w - 170, h - 10);
    ctx.beginPath();
    ctx.arc(w - 30, cy, 6 + (load ? 3 : 0), 0, Math.PI * 2);
    ctx.fill();
  }

  function rfid(ctx, w, h, t, c) {
    const lcx = w * 0.28,
      rcx = w * 0.72,
      cy = h * 0.5;
    // two coils
    function coil(x, label) {
      ctx.strokeStyle = c.fg;
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(x + i * 4, cy, 10, h * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = c.fg;
      ctx.font = "12px system-ui, sans-serif";
      ctx.fillText(label, x - 24, h - 8);
    }
    coil(lcx, "reader 125 kHz");
    coil(rcx, "tag (EM4100)");

    // flux lines coupling the two coils, pulsing
    ctx.strokeStyle = c.accent;
    const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 4));
    ctx.globalAlpha = a;
    for (let k = 1; k <= 3; k++) {
      const spread = k * (h * 0.12);
      ctx.beginPath();
      ctx.moveTo(lcx, cy - spread);
      ctx.bezierCurveTo(
        (lcx + rcx) / 2,
        cy - spread - 20,
        (lcx + rcx) / 2,
        cy - spread - 20,
        rcx,
        cy - spread
      );
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lcx, cy + spread);
      ctx.bezierCurveTo(
        (lcx + rcx) / 2,
        cy + spread + 20,
        (lcx + rcx) / 2,
        cy + spread + 20,
        rcx,
        cy + spread
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  const RENDERERS = { emwave, ask, fsk, ir, nfc, rfid };

  function animate(canvas) {
    const type = canvas.dataset.type;
    const render = RENDERERS[type];
    if (!render) return;

    let dims = setup(canvas);
    const c = colors();
    let start = null;
    let raf = null;
    let visible = true;

    function frame(ts) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      dims.ctx.clearRect(0, 0, dims.w, dims.h);
      render(dims.ctx, dims.w, dims.h, t, c);
      if (visible && !reduceMotion) raf = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (reduceMotion) {
        dims.ctx.clearRect(0, 0, dims.w, dims.h);
        render(dims.ctx, dims.w, dims.h, 1.2, c); // one representative frame
        return;
      }
      cancelAnimationFrame(raf);
      start = null;
      raf = requestAnimationFrame(frame);
    }

    // Pause when scrolled out of view to save battery.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) startLoop();
          else cancelAnimationFrame(raf);
        },
        { threshold: 0.05 }
      );
      io.observe(canvas);
    }

    // Handle resize / DPR changes.
    let rt;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        dims = setup(canvas);
        startLoop();
      }, 120);
    });
    ro.observe(canvas);

    startLoop();
  }

  function init() {
    document.querySelectorAll("canvas.anim").forEach((cv) => {
      if (cv.dataset.animReady === "1") return;
      cv.dataset.animReady = "1";
      animate(cv);
    });
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(init);
  } else if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
