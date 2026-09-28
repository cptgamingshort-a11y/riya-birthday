"use strict";

// Personalize these captions and image paths. Only the three supplied photos are used.
const photos = [
  { src: "assets/images/riya-1.png", caption: "Simply, wonderfully you." },
  { src: "assets/images/riya-2.png", caption: "A little birthday spotlight." },
  { src: "assets/images/riya-3.png", caption: "A memory worth keeping." },
];

const $ = (selector) => document.querySelector(selector);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const screens = Array.from(document.querySelectorAll(".screen"));
const nextLabels = [
  "Let's celebrate →",
  "A little note →",
  "Your photos →",
  "One last wish →",
  "Replay ↻",
];
let currentScreen = 0;
let currentPhoto = 0;
let candleTimers = [];

const music = $("#birthday-music");
const greeting = $("#hindi-greeting");
const musicToggle = $("#music-toggle");
music.volume = 0.3;
greeting.volume = 0.85;
let userPaused = true;
let greetingFinished = false;
function updateMusicButton() {
  const playing = !music.paused || !greeting.paused;
  musicToggle.textContent = playing ? "♫ Pause music" : "♫ Play music";
  musicToggle.setAttribute("aria-label", playing ? "Pause birthday music" : "Play birthday music");
  musicToggle.setAttribute("aria-pressed", String(playing));
}
function startBirthdayAudio() {
  if (userPaused) return;
  music.play().catch(updateMusicButton);
  if (!greetingFinished && greeting.paused) greeting.play().catch(updateMusicButton);
}
greeting.addEventListener("ended", () => { greetingFinished = true; updateMusicButton(); });
[music, greeting].forEach(audio => {
  audio.addEventListener("play", updateMusicButton);
  audio.addEventListener("pause", updateMusicButton);
  audio.addEventListener("error", updateMusicButton);
});
musicToggle.addEventListener("click", () => {
  if (!music.paused || !greeting.paused) {
    userPaused = true;
    music.pause(); greeting.pause();
  } else {
    userPaused = false;
    startBirthdayAudio();
  }
});
// Audio starts only through the music button.
updateMusicButton();

// Five clear screens, with one consistent Next / Back control.
screens.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.setAttribute("aria-hidden", "true");
  $("#step-dots").append(dot);
});

function showScreen(index, focus = true) {
  if (index < 0 || index >= screens.length) return;
  currentScreen = index;
  screens.forEach((screen, position) => {
    screen.hidden = position !== index;
  });
  document
    .querySelectorAll(".dot")
    .forEach((dot, position) => dot.classList.toggle("active", position === index));
  $("#step-dots").setAttribute("aria-label", `Screen ${index + 1} of ${screens.length}`);
  $("#back").disabled = index === 0;
  $("#next").textContent = nextLabels[index];
  const heading = screens[index].querySelector("h1, h2");
  heading.setAttribute("tabindex", "-1");
  if (focus) heading.focus({ preventScroll: true });
  if (index === screens.length - 1) celebrate();
}

$("#back").addEventListener("click", () => showScreen(currentScreen - 1));
$("#next").addEventListener("click", () => {
  if (currentScreen === screens.length - 1) replay();
  else showScreen(currentScreen + 1);
});

// Each candle has its own tap target, extinguishing animation, and smoke.
for (let index = 0; index < 5; index++) {
  const candle = document.createElement("button");
  candle.type = "button";
  candle.className = "candle";
  candle.setAttribute("aria-label", `Blow out candle ${index + 1}`);
  candle.setAttribute("aria-pressed", "false");
  candle.innerHTML = '<i class="wick"></i><i class="flame"></i>';
  candle.addEventListener("click", () => extinguish(candle, index));
  $("#candles").append(candle);
}

function extinguish(candle, index) {
  if (candle.disabled) return;
  candle.disabled = true;
  candle.classList.add("extinguishing");
  candle.setAttribute("aria-pressed", "true");
  candle.setAttribute("aria-label", `Candle ${index + 1} extinguished`);
  const timer = setTimeout(
    () => {
      candle.classList.add("out");
      const smoke = document.createElement("i");
      smoke.className = "smoke";
      candle.append(smoke);
      const remaining = document.querySelectorAll(".candle:not(.out)").length;
      $("#candle-hint").textContent =
        `${remaining} ${remaining === 1 ? "candle" : "candles"} left. Ek aur wish?`;
      if (remaining === 0) {
        $("#candle-hint").hidden = true;
        $("#wish-success").hidden = false;
        if (currentScreen === 1) celebrate();
      }
    },
    reducedMotion ? 0 : 600,
  );
  candleTimers.push(timer);
}

function replay() {
  candleTimers.forEach(clearTimeout);
  candleTimers = [];
  confettiPieces = [];
  document.querySelectorAll(".candle").forEach((candle, index) => {
    candle.disabled = false;
    candle.classList.remove("out", "extinguishing");
    candle.setAttribute("aria-pressed", "false");
    candle.setAttribute("aria-label", `Blow out candle ${index + 1}`);
    candle.querySelector(".smoke")?.remove();
  });
  $("#candle-hint").hidden = false;
  $("#candle-hint").textContent = "Aankhein band karo. Ek wish maango.";
  $("#wish-success").hidden = true;
  currentPhoto = 0;
  renderPhoto();
  showScreen(0);
}

// Photos stay on one screen. Open a portrait for a larger, undistorted view.
function renderPhoto() {
  const photo = photos[currentPhoto];
  $("#memory-image").src = photo.src;
  $("#memory-image").alt = `Riya — photo ${currentPhoto + 1}`;
  $("#photo-caption").textContent = photo.caption;
  $("#photo-count").textContent = `${currentPhoto + 1} / ${photos.length}`;
  $("#photo-open").setAttribute(
    "aria-label",
    `View photo ${currentPhoto + 1} full screen`,
  );
}
function changePhoto(direction) {
  currentPhoto = (currentPhoto + direction + photos.length) % photos.length;
  renderPhoto();
}
$("#photo-prev").addEventListener("click", () => changePhoto(-1));
$("#photo-next").addEventListener("click", () => changePhoto(1));
$("#photo-open").addEventListener("click", () => {
  $("#full-photo").src = photos[currentPhoto].src;
  $("#full-photo").alt = $("#memory-image").alt;
  $("#photo-dialog").showModal();
});
$("#close-photo").addEventListener("click", () => $("#photo-dialog").close());
$("#photo-dialog").addEventListener("close", () =>
  $("#photo-open").focus({ preventScroll: true }),
);
let touchStart;
$("#photo-open").addEventListener(
  "touchstart",
  (event) => {
    touchStart = event.changedTouches[0].clientX;
  },
  { passive: true },
);
$("#photo-open").addEventListener(
  "touchend",
  (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) > 50) changePhoto(distance < 0 ? 1 : -1);
  },
  { passive: true },
);

// Short confetti bursts only; no permanent animation loop or external dependency.
const canvas = $("#confetti");
const context = canvas.getContext("2d");
let confettiPieces = [];
let animationFrame = null;
let previousFrame = 0;
function resizeCanvas() {
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function celebrate() {
  if (reducedMotion || !context || document.hidden) return;
  const colors = ["#edbbca", "#d8bd94", "#f5eadc", "#bda0c9"];
  confettiPieces = Array.from({ length: 55 }, (_, index) => ({
    x: innerWidth / 2,
    y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 9,
    vy: -Math.random() * 7 - 1,
    life: 130,
    rotation: Math.random() * 6,
    color: colors[index % colors.length],
  }));
  if (animationFrame === null) {
    previousFrame = 0;
    animationFrame = requestAnimationFrame(drawConfetti);
  }
}
function drawConfetti(time) {
  const delta = previousFrame ? Math.min((time - previousFrame) / 16.67, 2) : 1;
  previousFrame = time;
  context.clearRect(0, 0, innerWidth, innerHeight);
  if (document.hidden) confettiPieces = [];
  confettiPieces = confettiPieces.filter((piece) => piece.life > 0);
  for (const piece of confettiPieces) {
    piece.life -= delta;
    piece.x += piece.vx * delta;
    piece.y += piece.vy * delta;
    piece.vy += 0.06 * delta;
    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation + time * 0.001);
    context.fillStyle = piece.color;
    context.globalAlpha = Math.min(piece.life / 30, 1);
    context.fillRect(-3, -2, 6, 4);
    context.restore();
  }
  animationFrame = confettiPieces.length ? requestAnimationFrame(drawConfetti) : null;
}
addEventListener("resize", resizeCanvas);
resizeCanvas();
renderPhoto();
showScreen(0, false);
