/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("hide");
  }, 1200);
});

/* =========================================================
   BASIC SETUP
========================================================= */

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* =========================================================
   CURSOR GLOW
========================================================= */

const cursorGlow = document.querySelector(".cursor-glow");

if (!reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

/* =========================================================
   MOUSE PARTICLES
========================================================= */

const particleLayer = document.getElementById("particleLayer");

if (!reduceMotion) {
  const particles = [];

  for (let i = 0; i < 35; i++) {
    const particle = document.createElement("span");

    particle.style.position = "absolute";
    particle.style.width = `${Math.random() * 3 + 1}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = "50%";

    particle.style.background = ["#df9da9", "#f2df9c", "#c8d8c1", "#c8dce8"][
      Math.floor(Math.random() * 4)
    ];

    particle.style.left = `${Math.random() * 100}%`;

    particle.style.top = `${Math.random() * 100}%`;

    particle.style.opacity = `${Math.random() * 0.45 + 0.1}`;

    particleLayer.appendChild(particle);

    particles.push({
      element: particle,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: Math.random() * 0.15 + 0.03,
      offset: Math.random() * Math.PI * 2,
    });
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animateParticles(time) {
    particles.forEach((particle) => {
      const dx = (mouseX - particle.x) * 0.0003;

      const dy = (mouseY - particle.y) * 0.0003;

      particle.x += dx;
      particle.y += Math.sin(time * 0.0005 + particle.offset) * particle.speed;

      particle.element.style.transform = `translate3d(${particle.x}px, ${particle.y}px, 0)`;
    });

    requestAnimationFrame(animateParticles);
  }

  requestAnimationFrame(animateParticles);
}

/* =========================================================
   CLICK SPARKLES
========================================================= */

const sparkleLayer = document.getElementById("sparkleLayer");

function createSparkles(x, y, count = 9) {
  if (reduceMotion) return;

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("span");

    sparkle.style.position = "fixed";

    sparkle.style.left = `${x}px`;

    sparkle.style.top = `${y}px`;

    sparkle.style.width = "5px";
    sparkle.style.height = "5px";

    sparkle.style.borderRadius = "50%";

    sparkle.style.background = ["#df9da9", "#f2df9c", "#f5c7a8", "#c8d8c1"][
      Math.floor(Math.random() * 4)
    ];

    sparkle.style.pointerEvents = "none";

    const angle = Math.random() * Math.PI * 2;

    const distance = Math.random() * 70 + 30;

    const sx = Math.cos(angle) * distance;

    const sy = Math.sin(angle) * distance;

    sparkle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
        },
        {
          transform: `translate(
                            calc(-50% + ${sx}px),
                            calc(-50% + ${sy}px)
                        )
                        scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration: Math.random() * 500 + 500,
        easing: "cubic-bezier(.16,1,.3,1)",
      },
    );

    sparkleLayer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1100);
  }
}

document.addEventListener("click", (event) => {
  createSparkles(event.clientX, event.clientY, 9);
});

/* =========================================================
   CONFETTI
========================================================= */

function confetti(amount = 80) {
  if (reduceMotion) return;

  const colors = ["#df9da9", "#f2df9c", "#f5c7a8", "#c8d8c1", "#c8dce8"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");

    piece.style.position = "fixed";

    piece.style.left = "50%";
    piece.style.top = "50%";

    piece.style.width = `${Math.random() * 7 + 4}px`;

    piece.style.height = `${Math.random() * 12 + 5}px`;

    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    piece.style.zIndex = "95";

    piece.style.pointerEvents = "none";

    const angle = Math.random() * Math.PI * 2;

    const distance = Math.random() * 450 + 150;

    const x = Math.cos(angle) * distance;

    const y = Math.sin(angle) * distance;

    piece.animate(
      [
        {
          transform: "translate(-50%, -50%) rotate(0deg)",
          opacity: 1,
        },
        {
          transform: `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        rotate(${Math.random() * 900}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: Math.random() * 1500 + 1200,
        easing: "cubic-bezier(.1,.8,.3,1)",
      },
    );

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 2800);
  }
}

/* =========================================================
   ENVELOPE — opens/closes on every click. Scroll unlocks the
   first time it opens and stays unlocked even if the envelope
   is closed again afterward.
========================================================= */

const envelope = document.getElementById("envelope");

const openCardButton = document.getElementById("openCardButton");

const scrollHint = document.getElementById("scrollHint");

let envelopeEverOpened = false;

function unlockScroll() {
  document.documentElement.classList.remove("scroll-locked");
  document.body.classList.remove("scroll-locked");

  scrollHint.classList.add("is-visible");
}

function toggleEnvelope() {
  const isOpen = envelope.classList.toggle("open");

  if (isOpen) {
    confetti(envelopeEverOpened ? 40 : 90);

    const rect = envelope.getBoundingClientRect();

    createSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
  }

  if (!envelopeEverOpened) {
    envelopeEverOpened = true;

    openCardButton.classList.add("is-hidden");

    setTimeout(unlockScroll, 900);
  }
}

envelope.addEventListener("click", toggleEnvelope);

openCardButton.addEventListener("click", toggleEnvelope);

/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(".reveal, .reveal-3d");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px",
  },
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =========================================================
   TIMELINE DRAW — build a smooth S-curve sized to the timeline's
   actual pixel box (instead of stretching a fixed-ratio path),
   so it always flows properly instead of zig-zagging.
========================================================= */

const timeline = document.querySelector(".timeline");

const timelineSvg = document.querySelector(".timeline-svg");

const timelinePath = document.querySelector(".timeline-path");

function buildTimelinePath() {
  if (!timeline || !timelineSvg || !timelinePath) return;

  const w = Math.max(timeline.offsetWidth, 1);

  const h = Math.max(timeline.offsetHeight, 1);

  timelineSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const cx = w / 2;

  const amp = Math.min(w * 0.26, 150);

  const segments = 4;

  const segH = h / segments;

  let d = `M${cx} 0`;

  for (let i = 0; i < segments; i++) {
    const y0 = i * segH;

    const y1 = y0 + segH;

    const dir = i % 2 === 0 ? -1 : 1;

    // Both control points sit on the SAME side within a segment (the
    // "belt" for that swing) — this is what keeps the join between
    // segments tangent-continuous instead of kinking at each node.
    const beltX = cx + dir * amp;

    const cy1 = y0 + segH * 0.33;

    const cy2 = y0 + segH * 0.67;

    d += ` C${beltX} ${cy1}, ${beltX} ${cy2}, ${cx} ${y1}`;
  }

  timelinePath.setAttribute("d", d);
}

buildTimelinePath();

window.addEventListener("load", buildTimelinePath);

let timelineResizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(timelineResizeTimer);

  timelineResizeTimer = setTimeout(buildTimelinePath, 200);
});

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        timeline.classList.add("draw");
      }
    });
  },
  {
    threshold: 0.2,
  },
);

timelineObserver.observe(timeline);

/* =========================================================
   3D MEMORY PHOTO TILT
========================================================= */

const photos = document.querySelectorAll(".memory-photo");

photos.forEach((photo) => {
  photo.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 700) return;

    const rect = photo.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;

    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;

    const rotateX = ((centerY - y) / centerY) * 8;

    const rotation = photo.style.getPropertyValue("--rotation") || "0deg";

    photo.style.transform = `
                rotate(${rotation})
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.03)
                `;
  });

  photo.addEventListener("pointerleave", () => {
    const rotation = photo.style.getPropertyValue("--rotation") || "0deg";

    photo.style.transform = `rotate(${rotation})`;
  });
});

/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightboxImage");

const lightboxCaption = document.getElementById("lightboxCaption");

const lightboxClose = document.getElementById("lightboxClose");

photos.forEach((photo) => {
  photo.addEventListener("click", () => {
    const image = photo.querySelector("img");

    lightboxImage.src = image.src;

    lightboxCaption.textContent = photo.dataset.caption || "";

    lightbox.classList.add("open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

if (!reduceMotion) {
  const magneticElements = document.querySelectorAll(".magnetic");

  magneticElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;

      const y = event.clientY - rect.top - rect.height / 2;

      element.style.transform = `translate(
                        ${x * 0.18}px,
                        ${y * 0.18}px
                    )`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

/* =========================================================
   PARALLAX BALLOONS
========================================================= */

if (!reduceMotion) {
  const heroBalloons = document.querySelectorAll(".hero-balloon");

  window.addEventListener(
    "scroll",
    () => {
      const scroll = window.scrollY;

      heroBalloons.forEach((balloon, index) => {
        const speed = 0.05 + index * 0.012;

        balloon.style.translate = `0 ${scroll * speed}px`;
      });
    },
    {
      passive: true,
    },
  );
}

/* =========================================================
   WISH STARS
========================================================= */

const wishStars = document.getElementById("wishStars");

for (let i = 0; i < 80; i++) {
  const star = document.createElement("span");

  star.className = "wish-star";

  star.style.left = `${Math.random() * 100}%`;

  star.style.top = `${Math.random() * 100}%`;

  star.style.animationDelay = `${Math.random() * 3}s`;

  wishStars.appendChild(star);
}

/* =========================================================
   WISH REVEAL
========================================================= */

const wishButton = document.getElementById("wishButton");

const wishNote = document.getElementById("wishNote");

wishButton.addEventListener("click", () => {
  wishNote.classList.add("show");

  confetti(120);

  createFireflies();

  wishButton.textContent = "Wish made";
});

/* =========================================================
   FIREFLIES
========================================================= */

function createFireflies() {
  if (reduceMotion) return;

  for (let i = 0; i < 35; i++) {
    const firefly = document.createElement("span");

    firefly.style.position = "fixed";

    firefly.style.width = "4px";
    firefly.style.height = "4px";

    firefly.style.borderRadius = "50%";

    firefly.style.background = "#f2df9c";

    firefly.style.boxShadow = "0 0 15px rgba(242,223,156,.8)";

    firefly.style.left = `${Math.random() * 100}%`;

    firefly.style.top = `${Math.random() * 100}%`;

    firefly.style.zIndex = "6";

    document.body.appendChild(firefly);

    firefly.animate(
      [
        {
          transform: "translate(0,0)",
          opacity: 0,
        },
        {
          transform: `translate(
                            ${Math.random() * 150 - 75}px,
                            ${Math.random() * -180 - 30}px
                        )`,
          opacity: 1,
        },
        {
          transform: `translate(
                            ${Math.random() * 250 - 125}px,
                            ${Math.random() * -350 - 100}px
                        )`,
          opacity: 0,
        },
      ],
      {
        duration: Math.random() * 3000 + 2500,
        easing: "ease-out",
      },
    );

    setTimeout(() => firefly.remove(), 6000);
  }
}

/* =========================================================
   MUSIC
========================================================= */

const music = document.getElementById("music");

const musicButton = document.getElementById("musicButton");

function startMusic() {
  if (!music.paused) return;

  music
    .play()
    .then(() => {
      musicButton.classList.add("playing");
    })
    .catch(() => {
      console.log("Add music.mp3 to enable background music.");
    });
}

// The moment she taps/clicks anywhere on the page, music starts.
document.addEventListener("click", startMusic, { once: true });
document.addEventListener("touchstart", startMusic, { once: true });

musicButton.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();

      musicButton.classList.add("playing");
    } else {
      music.pause();

      musicButton.classList.remove("playing");
    }
  } catch (error) {
    console.log("Add music.mp3 to enable background music.");
  }
});

/* =========================================================
   CONFESSION NOTE INTERACTION
========================================================= */

const confessionNotes = document.querySelectorAll(".confession-note");

confessionNotes.forEach((note) => {
  note.addEventListener("click", () => {
    note.classList.toggle("opened");

    if (note.classList.contains("opened")) {
      note.style.transform = "rotate(0deg) translateY(-15px) scale(1.08)";

      note.style.zIndex = "20";
    } else {
      note.style.transform = "";

      note.style.zIndex = "";
    }
  });
});

/* =========================================================
   SCROLL PARALLAX FOR SECTION DECORATIONS
========================================================= */

if (!reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      const elements = document.querySelectorAll(
        ".floating-note, .flower, .scrap-flower, .section-decoration",
      );

      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();

        const speed = ((index % 3) + 1) * 0.08;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.style.translate = `0 ${
            (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed
          }px`;
        }
      });
    },
    {
      passive: true,
    },
  );
}

/* =========================================================
   REPLAY
========================================================= */

const replayButton = document.getElementById("replayButton");

replayButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  setTimeout(() => {
    envelope.classList.remove("open");

    wishNote.classList.remove("show");

    wishButton.textContent = "Make the wish";

    document
      .querySelectorAll(".reveal.visible, .reveal-3d.visible")
      .forEach((element) => {
        element.classList.remove("visible");
      });

    setTimeout(() => {
      document.querySelectorAll(".reveal, .reveal-3d").forEach((element) => {
        revealObserver.observe(element);
      });
    }, 100);
  }, 800);
});

/* =========================================================
   BALLOON CLICK POP
========================================================= */

if (!reduceMotion) {
  document
    .querySelectorAll(".hero-balloon, .footer-balloon")
    .forEach((balloon) => {
      balloon.style.pointerEvents = "auto";

      balloon.addEventListener("click", (event) => {
        event.stopPropagation();

        const rect = balloon.getBoundingClientRect();

        for (let i = 0; i < 15; i++) {
          const piece = document.createElement("span");

          piece.style.position = "fixed";

          piece.style.left = `${rect.left + rect.width / 2}px`;

          piece.style.top = `${rect.top + rect.height / 2}px`;

          piece.style.width = "5px";

          piece.style.height = "5px";

          piece.style.borderRadius = "50%";

          piece.style.background = getComputedStyle(balloon).backgroundColor;

          piece.style.zIndex = "90";

          const angle = Math.random() * Math.PI * 2;

          const distance = Math.random() * 100 + 40;

          piece.animate(
            [
              {
                transform: "translate(-50%,-50%) scale(1)",
                opacity: 1,
              },
              {
                transform: `translate(
                                                calc(-50% + ${Math.cos(angle) * distance}px),
                                                calc(-50% + ${Math.sin(angle) * distance}px)
                                            )
                                            scale(0)`,
                opacity: 0,
              },
            ],
            {
              duration: 700,
            },
          );

          document.body.appendChild(piece);

          setTimeout(() => piece.remove(), 800);
        }

        balloon.animate(
          [
            {
              transform: "scale(1)",
            },
            {
              transform: "scale(1.3)",
            },
            {
              transform: "scale(0)",
            },
          ],
          {
            duration: 300,
          },
        );
      });
    });
}

/* =========================================================
   MEMORY IMAGE FALLBACK (local photos not yet added)
========================================================= */

document
  .querySelectorAll(".memory-photo img, .tiny-photo img")
  .forEach((img) => {
    img.addEventListener("error", () => {
      img.style.background = "linear-gradient(135deg, #f4cbd2, #f5c7a8)";

      img.style.minHeight = "150px";

      img.removeAttribute("src");
    });
  });

/* =========================================================
   INITIAL INTRO PARTICLES
========================================================= */

setTimeout(() => {
  if (!reduceMotion) {
    confetti(30);
  }
}, 1800);
