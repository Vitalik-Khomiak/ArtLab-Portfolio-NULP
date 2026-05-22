(function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const canvas = document.getElementById("derivative-canvas");
  const slider = document.getElementById("point-slider");
  const xValue = document.getElementById("x-value");
  const dValue = document.getElementById("d-value");
  const trendValue = document.getElementById("trend-value");

  if (!canvas || !slider) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const xMin = -1;
  const xMax = 4;
  const yMin = -4;
  const yMax = 8;

  function f(x) {
    return x * x * x - 3 * x * x + 2;
  }

  function df(x) {
    return 3 * x * x - 6 * x;
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(320, Math.floor(rect.width * ratio));
    canvas.height = Math.max(260, Math.floor(rect.height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function px(x) {
    const w = canvas.getBoundingClientRect().width;
    return ((x - xMin) / (xMax - xMin)) * w;
  }

  function py(y) {
    const h = canvas.getBoundingClientRect().height;
    return h - ((y - yMin) / (yMax - yMin)) * h;
  }

  function drawGrid(width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#dfe8ee";
    ctx.lineWidth = 1;

    for (let x = Math.ceil(xMin); x <= xMax; x += 1) {
      ctx.beginPath();
      ctx.moveTo(px(x), 0);
      ctx.lineTo(px(x), height);
      ctx.stroke();
    }

    for (let y = yMin; y <= yMax; y += 2) {
      ctx.beginPath();
      ctx.moveTo(0, py(y));
      ctx.lineTo(width, py(y));
      ctx.stroke();
    }

    ctx.strokeStyle = "#73808c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px(0), 0);
    ctx.lineTo(px(0), height);
    ctx.moveTo(0, py(0));
    ctx.lineTo(width, py(0));
    ctx.stroke();
  }

  function drawFunction() {
    ctx.strokeStyle = "#e4572e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i <= 320; i += 1) {
      const x = xMin + (i / 320) * (xMax - xMin);
      const y = f(x);
      if (i === 0) {
        ctx.moveTo(px(x), py(y));
      } else {
        ctx.lineTo(px(x), py(y));
      }
    }
    ctx.stroke();
  }

  function drawTangent(x0) {
    const y0 = f(x0);
    const slope = df(x0);
    const xA = xMin;
    const xB = xMax;
    const yA = y0 + slope * (xA - x0);
    const yB = y0 + slope * (xB - x0);

    ctx.strokeStyle = "#006d77";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(px(xA), py(yA));
    ctx.lineTo(px(xB), py(yB));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#1b998b";
    ctx.beginPath();
    ctx.arc(px(x0), py(y0), 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
  }

  function drawCriticalPoints() {
    const points = [0, 2];
    for (const x of points) {
      ctx.fillStyle = "#f2c14e";
      ctx.beginPath();
      ctx.arc(px(x), py(f(x)), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#202326";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function updateStats(x0) {
    const derivative = df(x0);
    if (xValue) {
      xValue.textContent = x0.toFixed(2);
    }
    if (dValue) {
      dValue.textContent = derivative.toFixed(2);
    }
    if (trendValue) {
      if (Math.abs(derivative) < 0.12) {
        trendValue.textContent = "нахил ≈ 0";
      } else {
        trendValue.textContent = derivative > 0 ? "функція зростає" : "функція спадає";
      }
    }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x0 = Number(slider.value);

    drawGrid(width, height);
    drawFunction();
    drawTangent(x0);
    drawCriticalPoints();
    updateStats(x0);
  }

  slider.addEventListener("input", draw);
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
})();
