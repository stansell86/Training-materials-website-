// ==========================================================
// Mobile navigation
// ==========================================================
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// ==========================================================
// Scroll reveal + stat counters
// ==========================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCount(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document.documentElement.classList.add("no-js");
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
}

// ==========================================================
// Interactive sample lesson (quiz)
// Edit the questions below to showcase your own content.
// ==========================================================
const questions = [
  {
    q: "A customer is upset because their order arrived late. What's the best first step?",
    options: [
      "Explain that shipping delays aren't your fault",
      "Listen, acknowledge their frustration, and apologize",
      "Immediately offer a full refund",
      "Transfer them to a manager",
    ],
    answer: 1,
    explain: "Listening and acknowledging feelings first builds trust before you move on to solutions.",
  },
  {
    q: "You spot a spill in a walkway at work. What should you do?",
    options: [
      "Walk around it, since someone else will clean it",
      "Mark the hazard and clean it or report it right away",
      "Wait until the end of your shift to mention it",
    ],
    answer: 1,
    explain: "Flagging hazards immediately prevents slips and injuries for everyone.",
  },
  {
    q: "You receive an email asking you to 'verify your password' through a link. What do you do?",
    options: [
      "Click the link and log in quickly",
      "Reply with your password so IT can check it",
      "Don't click it. Report it to IT as possible phishing",
    ],
    answer: 2,
    explain: "Legitimate teams never ask for your password by email. Reporting helps protect the whole company.",
  },
];

const els = {
  bar: document.getElementById("quiz-bar"),
  step: document.getElementById("quiz-step"),
  question: document.getElementById("quiz-question"),
  options: document.getElementById("quiz-options"),
  feedback: document.getElementById("quiz-feedback"),
  next: document.getElementById("quiz-next"),
  card: document.getElementById("quiz"),
};

let current = 0;
let score = 0;

function renderQuestion() {
  const item = questions[current];
  els.step.textContent = `Question ${current + 1} of ${questions.length}`;
  els.question.textContent = item.q;
  els.feedback.textContent = "";
  els.feedback.className = "quiz-feedback";
  els.next.hidden = true;
  els.bar.style.width = `${(current / questions.length) * 100}%`;
  els.options.innerHTML = "";

  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.type = "button";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(i, btn));
    els.options.appendChild(btn);
  });
}

function choose(index, btn) {
  const item = questions[current];
  const buttons = els.options.querySelectorAll("button");
  buttons.forEach((b) => (b.disabled = true));

  if (index === item.answer) {
    score++;
    btn.classList.add("correct");
    els.feedback.textContent = `Nice! ${item.explain}`;
    els.feedback.classList.add("good");
  } else {
    btn.classList.add("wrong");
    buttons[item.answer].classList.add("correct");
    els.feedback.textContent = `Not quite. ${item.explain}`;
    els.feedback.classList.add("bad");
  }

  els.bar.style.width = `${((current + 1) / questions.length) * 100}%`;
  els.next.textContent = current === questions.length - 1 ? "See results →" : "Next →";
  els.next.hidden = false;
  els.next.focus();
}

function renderResults() {
  els.step.textContent = "Lesson complete";
  els.question.textContent = "";
  els.feedback.textContent = "";
  els.next.hidden = true;
  els.options.innerHTML = `
    <div class="quiz-done">
      <div class="trophy" aria-hidden="true">🏆</div>
      <h3>You scored ${score} / ${questions.length}</h3>
      <p>Imagine this experience built around <strong>your</strong> policies, products, and processes.</p>
      <a href="#contact" class="btn">Let's build yours</a>
      <p><button type="button" class="btn btn-ghost btn-small" id="quiz-restart">Try again</button></p>
    </div>`;
  document.getElementById("quiz-restart").addEventListener("click", () => {
    current = 0;
    score = 0;
    renderQuestion();
  });
}

els.next.addEventListener("click", () => {
  current++;
  if (current < questions.length) renderQuestion();
  else renderResults();
});

renderQuestion();

// ==========================================================
// Contact form
// To receive real submissions, set FORM_ENDPOINT to a form
// service URL (e.g. Formspree, Netlify Forms, Basin).
// ==========================================================
const FORM_ENDPOINT = "";
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== "";
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = "Please fill in your name, a valid email, and a short message.";
    return;
  }

  if (!FORM_ENDPOINT) {
    status.textContent = "Thanks! (Demo mode: connect a form service in js/main.js to receive messages.)";
    form.reset();
    return;
  }

  status.textContent = "Sending…";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error(res.statusText);
    status.textContent = "Thanks! We'll be in touch within one business day.";
    form.reset();
  } catch {
    status.textContent = "Something went wrong. Please email us directly instead.";
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
