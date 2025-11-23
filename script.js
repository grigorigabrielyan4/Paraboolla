/* ----------------- Read More ----------------- */
document.getElementById('readMore').addEventListener('click', () => {
  window.open('https://hy.wikipedia.org/wiki/%D5%8A%D5%A1%D6%80%D5%A1%D5%A2%D5%B8%D5%AC%D5%A1%D5%B5%D5%AB%D5%B6_%D5%A1%D5%B6%D5%BF%D5%A5%D5%B6%D5%A1', '_blank', 'noopener');
});

/* ----------------- Quiz Buttons ----------------- */
document.getElementById('ansCorrect').addEventListener('click', () => {
  const result = document.getElementById('quizResult');
  result.textContent = 'Ճիշտ է';
  result.style.color = '#4ade80';
});

document.getElementById('ansWrong').addEventListener('click', () => {
  const result = document.getElementById('quizResult');
  result.textContent = ' Սխալ է  ';
  result.style.color = '#fb7185';
});

/* ----------------- Feedback ----------------- */
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('fbName').value || 'Anonymous';
  const msg  = document.getElementById('fbMessage').value.trim();
  const status = document.getElementById('fbStatus');

  if (!msg) {
    alert('Խնդրում ենք գրել հաղորդագրություն։');
    return;
  }

  // GitHub Pages safe version
  status.textContent = "Ուղարկված է հաջողությամբ (տեղային ռեժիմով) ✅";
  document.getElementById('feedbackForm').reset();
});

document.getElementById('clearForm').addEventListener('click', () => {
  document.getElementById('feedbackForm').reset();
  document.getElementById('fbStatus').textContent = '';
});

/* ----------------- Canvas Parabola Animation ----------------- */
(function () {
  const canvas = document.getElementById('parabolaCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  const vertex = { x: W * 0.5, y: H };
  const focus = { x: vertex.x, y: vertex.y - 90 };
  const rays = [];
  let raysOn = true;

  function parabolaY(x) {
    const f = vertex.y - focus.y;
    const a = -1 / (4 * f);
    return a * (x - vertex.x) ** 2 + vertex.y;
  }

  function spawnRay() {
    rays.push({ x: Math.random() * W * 0.6, y: -1, vx: 1.5, vy: 1.6 + Math.random(), reflected: false });
  }

  for (let i = 0; i < 10; i++) spawnRay();

  document.getElementById('toggleRays').addEventListener('click', () => raysOn = !raysOn);

  function update() {
    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#60a5fa';
    for (let x = 0; x <= W; x++) {
      const y = parabolaY(x);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#facc15';
    ctx.arc(focus.x, focus.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '13px Inter';
    ctx.fillStyle = '#fff';
    ctx.fillText('Ֆոկուս (F)', focus.x + 9, focus.y + 5);

    for (let i = rays.length - 5; i >= 0; i--) {
      const r = rays[i];
      r.x += r.vx;
      r.y += r.vy;

      const py = parabolaY(r.x);

      if (!r.reflected && r.y >= py) {
        r.reflected = true;
        const dx = focus.x - r.x;
        const dy = focus.y - r.y;
        const len = Math.hypot(dx, dy) || 1;
        r.vx = dx / len * 2;
        r.vy = dy / len * 2;
      }

      ctx.beginPath();
      ctx.strokeStyle = r.reflected ? 'rgba(250,204,21,0.9)' : 'rgba(96,165,250,0.9)';
      ctx.lineWidth = r.reflected ? 3 : 3;
      ctx.moveTo(r.x - r.vx * 3, r.y - r.vy * 4);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();

      if (Math.hypot(r.x - focus.x, r.y - focus.y) < 6) rays.splice(i, 1);
    }

    if (raysOn && rays.length < 30 && Math.random() < 0.04) spawnRay();
    requestAnimationFrame(update);
  }

  update();
})();
