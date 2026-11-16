// gato da barra superior: anda, senta nas pontas e reage ao mouse.
(() => {
  const CFG = Object.assign({
    speed: 90,        // velocidade de caminhada, em pixels por segundo
    sitMin: 3000,     // tempo mínimo sentado nas pontas
    sitMax: 6000,     // tempo máximo sentado nas pontas
    touchReact: 2500  // duração da reação ao toque (celular)
  }, window.CAT_CONFIG);

  const ANIM = {
    walk:  { row: 4, frames: 8, fps: 10 },
    sit:   { row: 0, frames: 4, fps: 3 },
    react: { row: 2, frames: 4, fps: 5 }
  };

  const bar = document.querySelector(".topbar");
  const track = document.querySelector(".cat-track");
  const cat = document.querySelector(".cat");
  if (!bar || !track || !cat) return;

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let state = "sit", frame = 0, frameClock = 0, stateClock = 0;
  let x = 0, dir = 1, sitFor = 1500, last = 0;
  let hovering = false, reactUntil = 0;

  const setState = (s) => { state = s; frame = 0; frameClock = 0; stateClock = 0; cat.dataset.state = s; };
  const rand = (a, b) => a + Math.random() * (b - a);

  function frameOfCat(e) {
    const r = cat.getBoundingClientRect();
    return e.clientX > r.left + r.width * 0.2 && e.clientX < r.right - r.width * 0.2 &&
           e.clientY > r.top + r.height * 0.45 && e.clientY < r.bottom;
  }
  const setHover = (on) => { hovering = on; bar.classList.toggle("is-petting", on); };
  bar.addEventListener("mousemove", (e) => setHover(frameOfCat(e)));
  bar.addEventListener("mouseleave", () => setHover(false));
  bar.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" && frameOfCat(e)) reactUntil = performance.now() + CFG.touchReact;
  });

  function tick(now) {
    const dt = Math.min((now - (last || now)) / 1000, 0.1);
    last = now;
    const maxX = Math.max(0, track.clientWidth - cat.offsetWidth);
    const reacting = hovering || now < reactUntil;

    if (reacting && state !== "react") setState("react");
    else if (!reacting && state === "react") setState("walk");

    stateClock += dt;
    if (state === "walk") {
      x += dir * CFG.speed * dt;
      if ((dir > 0 && x >= maxX) || (dir < 0 && x <= 0)) {
        x = Math.min(Math.max(x, 0), maxX);
        dir *= -1;                        // vira para olhar para dentro da barra
        sitFor = rand(CFG.sitMin, CFG.sitMax);
        setState("sit");
      }
    } else if (state === "sit" && stateClock * 1000 >= sitFor) {
      setState("walk");
    }
    x = Math.min(x, maxX);                // caso a janela diminua

    const a = ANIM[state];
    frameClock += dt;
    while (frameClock >= 1 / a.fps) { frameClock -= 1 / a.fps; frame = (frame + 1) % a.frames; }

    const W = cat.offsetWidth, H = cat.offsetHeight;
    cat.style.backgroundPosition = `${-frame * W}px ${-a.row * H}px`;
    cat.style.transform = `translateX(${x.toFixed(1)}px) scaleX(${dir})`;
    requestAnimationFrame(tick);
  }

  setState("sit");
  requestAnimationFrame(tick);
})();