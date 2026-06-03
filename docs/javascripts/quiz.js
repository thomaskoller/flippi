// Lightweight, dependency-free quiz component.
//
// Authoring (works inside Markdown because md_in_html is enabled):
//
//   <div class="quiz" data-title="Test Your Knowledge">
//   <script type="application/json">
//   [
//     {
//       "q": "What keying scheme does a cheap 433 MHz remote use?",
//       "options": ["FM", "OOK / ASK", "QAM-64", "DSSS"],
//       "answer": 1,
//       "explain": "It just gates the carrier on and off — on-off keying (a form of ASK)."
//     }
//   ]
//   </script>
//   </div>
//
// "answer" is the zero-based index of the correct option. "explain" is optional.

(function () {
  function buildQuestion(item, qIndex) {
    const wrap = document.createElement("div");
    wrap.className = "quiz-q";

    const prompt = document.createElement("p");
    prompt.className = "quiz-prompt";
    prompt.innerHTML = `<span class="quiz-num">${qIndex + 1}.</span> ${item.q}`;
    wrap.appendChild(prompt);

    const list = document.createElement("div");
    list.className = "quiz-options";

    let answered = false;

    (item.options || []).forEach((optText, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.innerHTML = optText;
      btn.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = i === item.answer;
        btn.classList.add(correct ? "is-correct" : "is-wrong");
        if (!correct) {
          // also reveal the right one
          const right = list.children[item.answer];
          if (right) right.classList.add("is-correct");
        }
        // lock all buttons
        Array.from(list.children).forEach((b) => (b.disabled = true));
        if (item.explain) {
          const exp = document.createElement("div");
          exp.className = "quiz-explain " + (correct ? "ok" : "no");
          exp.innerHTML =
            (correct ? "✓ Correct. " : "✗ Not quite. ") + item.explain;
          wrap.appendChild(exp);
        }
      });
      list.appendChild(btn);
    });

    wrap.appendChild(list);
    return wrap;
  }

  function render(container) {
    if (container.dataset.quizReady === "1") return;
    const dataEl = container.querySelector('script[type="application/json"]');
    if (!dataEl) return;

    let items;
    try {
      items = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error("Quiz JSON parse error", e);
      return;
    }

    container.innerHTML = "";
    container.dataset.quizReady = "1";

    const title = document.createElement("div");
    title.className = "quiz-title";
    title.textContent = container.dataset.title || "Test Your Knowledge";
    container.appendChild(title);

    items.forEach((item, i) => container.appendChild(buildQuestion(item, i)));
  }

  function init() {
    document.querySelectorAll(".quiz").forEach(render);
  }

  // Re-run on Zensical instant navigation; fall back to DOMContentLoaded.
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(init);
  } else if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
