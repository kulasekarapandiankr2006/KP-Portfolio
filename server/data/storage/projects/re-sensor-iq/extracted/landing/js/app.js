document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('waveform-canvas');
  const ctx = canvas.getContext('2d');
  const logBox = document.getElementById('log-box');
  const vibVal = document.getElementById('vib-val');
  const tempVal = document.getElementById('temp-val');

  let points = [];
  const maxPoints = 120;
  for (let i = 0; i < maxPoints; i++) points.push(90);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid lines
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(canvas.width, x);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Waveform line
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const sliceWidth = canvas.width / (maxPoints - 1);
    for (let i = 0; i < points.length; i++) {
      const x = i * sliceWidth;
      const y = points[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function updateTelemetry() {
    const noise = (Math.random() - 0.5) * 20;
    const sinWave = Math.sin(Date.now() / 150) * 35;
    const nextY = 90 + sinWave + noise;

    points.shift();
    points.push(nextY);
    draw();

    // Metric Jitter
    const currentVib = (1.2 + (Math.random() * 0.1 - 0.05)).toFixed(2);
    const currentTemp = (41.5 + (Math.random() * 0.6 - 0.3)).toFixed(1);
    if (vibVal) vibVal.innerHTML = currentVib + ' <small>g</small>';
    if (tempVal) tempVal.innerHTML = currentTemp + ' <small>°C</small>';

    // Add CAN packet log occasionally
    if (logBox && Math.random() > 0.7) {
      const time = new Date().toISOString().substring(11, 23);
      const hex1 = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
      const hex2 = Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0');
      const line = document.createElement('div');
      line.className = 'log-line';
      line.textContent = `[${time}] CAN_ID=0x140 PKT: ${hex1} ${hex2} 88 FF 00 12 C4`;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
      if (logBox.children.length > 20) {
        logBox.removeChild(logBox.children[0]);
      }
    }
  }

  setInterval(updateTelemetry, 40);

  document.getElementById('clear-btn')?.addEventListener('click', () => {
    if (logBox) logBox.innerHTML = '';
  });
});