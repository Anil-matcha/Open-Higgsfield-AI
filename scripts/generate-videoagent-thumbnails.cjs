const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'thumbnails', 'videoagent');
fs.mkdirSync(OUT_DIR, { recursive: true });

const FONT_DIR = path.join(__dirname, '..', '..', '.kilocode', 'skills', 'canvas-design', 'canvas-fonts');
const fontFiles = [
  { file: 'IBMPlexMono-Bold.ttf', family: 'IBM Plex Mono' },
  { file: 'IBMPlexMono-Regular.ttf', family: 'IBM Plex Mono' },
  { file: 'Outfit-Bold.ttf', family: 'Outfit' },
  { file: 'Outfit-Regular.ttf', family: 'Outfit' },
  { file: 'BigShoulders-Regular.ttf', family: 'Big Shoulders' },
  { file: 'NationalPark-Bold.ttf', family: 'National Park' },
  { file: 'Tektur-Medium.ttf', family: 'Tektur' },
  { file: 'GeistMono-Bold.ttf', family: 'Geist Mono' },
  { file: 'Silkscreen-Regular.ttf', family: 'Silkscreen' },
];
fontFiles.forEach(f => {
  const fp = path.join(FONT_DIR, f.file);
  if (fs.existsSync(fp)) registerFont(fp, { family: f.family });
});

const W = 400, H = 400;

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return {r,g,b};
}

function rgba(hex, a) {
  const {r,g,b} = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function drawBg(ctx, c1, c2, angle=135) {
  const rad = angle * Math.PI / 180;
  const g = ctx.createLinearGradient(W/2-Math.cos(rad)*W/2, H/2-Math.sin(rad)*W/2, W/2+Math.cos(rad)*W/2, H/2+Math.sin(rad)*W/2);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

function glow(ctx, cx, cy, r, color, a=0.3) {
  const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
  g.addColorStop(0, rgba(color,a)); g.addColorStop(1, rgba(color,0));
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

function vignette(ctx) {
  const g = ctx.createRadialGradient(W/2,H/2,W*0.3,W/2,H/2,W*0.7);
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.45)');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

function noise(ctx) {
  const img = ctx.getImageData(0,0,W,H);
  for (let i=0; i<img.data.length; i+=4) {
    const n = (Math.random()-0.5)*10;
    img.data[i]+=n; img.data[i+1]+=n; img.data[i+2]+=n;
  }
  ctx.putImageData(img,0,0);
}

function label(ctx, title, sub, accent, y) {
  const ly = y || H - 68;
  const g = ctx.createLinearGradient(0,ly-20,0,H);
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(0.3,'rgba(0,0,0,0.7)'); g.addColorStop(1,'rgba(0,0,0,0.9)');
  ctx.fillStyle = g; ctx.fillRect(0,ly-20,W,H-ly+20);
  ctx.fillStyle = accent;
  ctx.fillRect(20, ly+4, 20, 3);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px "Outfit", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 20, ly+26, W-40);
  if (sub) {
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillText(sub, 20, ly+44, W-40);
  }
}

// ═══════════════════════════════════════
// DESCRIPTIVE SCENE DRAWINGS
// ═══════════════════════════════════════

function drawFilmFrames(ctx, accent) {
  const fw = 100, fh = 65, gap = 12;
  const sx = (W - (fw*3 + gap*2)) / 2, sy = 90;
  const colors = ['#2a4a7f', '#4a2a7f', '#7f4a2a'];
  for (let i = 0; i < 3; i++) {
    const x = sx + i*(fw+gap);
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, sy, fw, fh);
    ctx.strokeStyle = i === 1 ? accent : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = i === 1 ? 2.5 : 1;
    ctx.strokeRect(x, sy, fw, fh);
    const sg = ctx.createLinearGradient(x, sy, x+fw, sy+fh);
    sg.addColorStop(0, rgba(colors[i], 0.5));
    sg.addColorStop(1, rgba(colors[i], 0.9));
    ctx.fillStyle = sg; ctx.fillRect(x+1, sy+1, fw-2, fh-2);
  }
  for (let i = 0; i < 2; i++) {
    const lx = sx + (i+1)*fw + i*gap + gap/2;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(lx, sy-15); ctx.lineTo(lx, sy+fh+15); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.moveTo(lx-5, sy-15); ctx.lineTo(lx+5, sy-15); ctx.lineTo(lx, sy-8); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(lx-5, sy+fh+15); ctx.lineTo(lx+5, sy+fh+15); ctx.lineTo(lx, sy+fh+8); ctx.closePath(); ctx.fill();
  }
  const ty = sy + fh + 30;
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(40, ty, W-80, 6);
  ctx.fillStyle = accent;
  ctx.fillRect(40, ty, (W-80)*0.33, 6);
  ctx.fillRect(40+(W-80)*0.33+gap, ty, (W-80)*0.25, 6);
  for (let i=0; i<10; i++) {
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(40 + i*((W-80)/9), ty+10, 1, 8);
  }
}

function drawScissorsCut(ctx, accent) {
  const ty = 140, tw = W-80, th = 50;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.roundRect(40, ty, tw, th, 8);
  ctx.fill();
  for (let i=0; i<8; i++) {
    const fx = 48 + i*(tw/8);
    const fw = tw/8 - 6;
    ctx.fillStyle = rgba('#4a6fa5', 0.3 + i*0.05);
    ctx.fillRect(fx, ty+6, fw, th-12);
  }
  const cx = 40 + tw*0.45;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6,4]);
  ctx.beginPath(); ctx.moveTo(cx, ty-20); ctx.lineTo(cx, ty+th+20); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(cx-10, ty-30, 10, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+10, ty-30, 10, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx-5, ty-22); ctx.lineTo(cx+15, ty-50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+5, ty-22); ctx.lineTo(cx-15, ty-50); ctx.stroke();
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.roundRect(40, ty+th+25, tw*0.45-10, 20, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(cx+10, ty+th+25, tw*0.55-20, 20, 4); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 1;
  ctx.strokeRect(40, ty+th+25, tw*0.45-10, 20);
  ctx.strokeRect(cx+10, ty+th+25, tw*0.55-20, 20);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SEGMENT A', 40 + (tw*0.45-10)/2, ty+th+39);
  ctx.fillText('SEGMENT B', cx+10 + (tw*0.55-20)/2, ty+th+39);
  ctx.textAlign = 'left';
}

function drawStarHighlight(ctx, accent) {
  const ty = 150, tw = W-80;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath(); ctx.roundRect(40, ty, tw, 8, 4); ctx.fill();
  const positions = [0.15, 0.35, 0.55, 0.75, 0.9];
  positions.forEach((p, i) => {
    const x = 40 + tw*p;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(x, ty+4, 3, 0, Math.PI*2); ctx.fill();
  });
  const hx = 40 + tw*0.55;
  glow(ctx, hx, ty, 80, accent, 0.25);
  ctx.fillStyle = accent;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2 - Math.PI/2;
    const r = i%2===0 ? 25 : 10;
    const px = hx + Math.cos(a)*r, py = ty + Math.sin(a)*r;
    i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(hx, ty, 5, 0, Math.PI*2); ctx.fill();
  const fy = ty + 50;
  for (let i = 0; i < 3; i++) {
    const fx = 80 + i*90;
    ctx.fillStyle = i===1 ? rgba(accent, 0.25) : 'rgba(255,255,255,0.05)';
    ctx.beginPath(); ctx.roundRect(fx, fy, 70, 50, 4); ctx.fill();
    ctx.strokeStyle = i===1 ? accent : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = i===1 ? 2 : 1;
    ctx.strokeRect(fx, fy, 70, 50);
    if (i===1) {
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(fx+35, fy+25, 12, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.moveTo(fx+30, fy+20); ctx.lineTo(fx+42, fy+25); ctx.lineTo(fx+30, fy+30); ctx.closePath(); ctx.fill();
    }
  }
  ctx.fillStyle = accent;
  ctx.font = 'bold 9px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KEY MOMENT', hx, ty - 35);
  ctx.textAlign = 'left';
}

function drawVoiceClone(ctx, accent) {
  const wy = 130, ww = W-80;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.fillText('SOURCE', 40, wy - 10);
  ctx.strokeStyle = rgba(accent, 0.4);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=0; x<ww; x++) {
    const y = wy + Math.sin(x*0.08)*15 + Math.sin(x*0.15)*8 + Math.sin(x*0.03)*5;
    x===0 ? ctx.moveTo(40+x,y) : ctx.lineTo(40+x,y);
  }
  ctx.stroke();
  const ax = W/2;
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(ax-20, wy+45); ctx.lineTo(ax+20, wy+45); ctx.lineTo(ax, wy+30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.roundRect(ax-30, wy+25, 60, 35, 8); ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = 'bold 8px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CLONE', ax, wy+48);
  ctx.textAlign = 'left';
  const cy = wy + 85;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('CLONED', 40, cy - 10);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x=0; x<ww; x++) {
    const y = cy + Math.sin(x*0.08)*15 + Math.sin(x*0.15)*8 + Math.sin(x*0.03)*5;
    x===0 ? ctx.moveTo(40+x,y) : ctx.lineTo(40+x,y);
  }
  ctx.stroke();
  const mx = W - 60, my = cy + 40;
  ctx.fillStyle = rgba(accent, 0.2);
  ctx.beginPath(); ctx.roundRect(mx-20, my-25, 40, 55, 10); ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.ellipse(mx, my-5, 8, 14, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(mx, my+5, 16, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(mx, my+21); ctx.lineTo(mx, my+28); ctx.stroke();
}

function drawSpeechWaves(ctx, accent) {
  const cx = W/2, cy = 160;
  for (let i=0; i<5; i++) {
    const r = 25 + i*22;
    ctx.strokeStyle = rgba(accent, 0.3 - i*0.05);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI*0.35, Math.PI*0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI*0.65, Math.PI*1.35);
    ctx.stroke();
  }
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.ellipse(cx, cy-3, 6, 10, 0, 0, Math.PI*2); ctx.fill();
  const ty = cy + 70;
  ctx.fillStyle = rgba(accent, 0.1);
  ctx.beginPath(); ctx.roundRect(60, ty, W-120, 50, 8); ctx.fill();
  ctx.strokeStyle = rgba(accent, 0.3); ctx.lineWidth = 1;
  ctx.strokeRect(60, ty, W-120, 50);
  for (let i=0; i<3; i++) {
    const lw = 60 + Math.random()*120;
    ctx.fillStyle = rgba(accent, 0.4 + i*0.1);
    ctx.fillRect(75, ty+12+i*14, lw, 4);
  }
}

function drawVoiceSwap(ctx, accent) {
  const lx = 100, rx = W-100, cy = 150;
  ctx.fillStyle = rgba(accent, 0.12);
  ctx.beginPath(); ctx.arc(lx, cy, 40, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(lx, cy, 40, 0, Math.PI*2); ctx.stroke();
  ctx.strokeStyle = rgba(accent, 0.6); ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=-25; x<25; x++) {
    const y = cy + Math.sin(x*0.3)*12;
    x===-25 ? ctx.moveTo(lx+x,y) : ctx.lineTo(lx+x,y);
  }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VOICE A', lx, cy+55);
  ctx.fillStyle = rgba('#4ecdc4', 0.12);
  ctx.beginPath(); ctx.arc(rx, cy, 40, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#4ecdc4'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(rx, cy, 40, 0, Math.PI*2); ctx.stroke();
  ctx.strokeStyle = rgba('#4ecdc4', 0.6); ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=-25; x<25; x++) {
    const y = cy + Math.sin(x*0.2+1)*10 + Math.cos(x*0.4)*5;
    x===-25 ? ctx.moveTo(rx+x,y) : ctx.lineTo(rx+x,y);
  }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('VOICE B', rx, cy+55);
  ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
  const mid = W/2;
  ctx.beginPath(); ctx.moveTo(lx+50, cy-15); ctx.quadraticCurveTo(mid, cy-50, rx-50, cy-15); ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(rx-50, cy-20); ctx.lineTo(rx-40, cy-15); ctx.lineTo(rx-50, cy-10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4ecdc4';
  ctx.beginPath(); ctx.moveTo(rx-50, cy+15); ctx.quadraticCurveTo(mid, cy+50, lx+50, cy+15); ctx.stroke();
  ctx.fillStyle = '#4ecdc4';
  ctx.beginPath(); ctx.moveTo(lx+50, cy+20); ctx.lineTo(lx+40, cy+15); ctx.lineTo(lx+50, cy+10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.arc(mid, cy, 20, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(mid, cy-5, 8, Math.PI*0.8, Math.PI*2.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(mid+4, cy-11); ctx.lineTo(mid+10, cy-5); ctx.lineTo(mid+4, cy+1); ctx.stroke();
  ctx.beginPath(); ctx.arc(mid, cy+5, 8, -Math.PI*0.2, Math.PI*1.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(mid-4, cy-1); ctx.lineTo(mid-10, cy+5); ctx.lineTo(mid-4, cy+11); ctx.stroke();
  ctx.textAlign = 'left';
}

function drawAudioToText(ctx, accent) {
  const wy = 120, ww = W-100;
  ctx.fillStyle = rgba(accent, 0.08);
  ctx.beginPath(); ctx.roundRect(50, wy-20, ww, 50, 8); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=0; x<ww; x++) {
    const amp = 15 + Math.sin(x*0.02)*5;
    const y = wy + 5 + Math.sin(x*0.1)*amp + Math.sin(x*0.22)*amp*0.5 + Math.sin(x*0.05)*amp*0.3;
    x===0 ? ctx.moveTo(50+x,y) : ctx.lineTo(50+x,y);
  }
  ctx.stroke();
  ctx.fillStyle = rgba(accent, 0.4);
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillText('AUDIO INPUT', 50, wy-28);
  const ax = W/2, ay = wy + 50;
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(ax, ay+20); ctx.lineTo(ax-12, ay); ctx.lineTo(ax+12, ay); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.1);
  ctx.beginPath(); ctx.roundRect(ax-25, ay+22, 50, 20, 4); ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = 'bold 7px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('WHISPER', ax, ay+36);
  ctx.textAlign = 'left';
  const ty = ay + 55;
  ctx.fillStyle = rgba(accent, 0.06);
  ctx.beginPath(); ctx.roundRect(50, ty, ww, 80, 8); ctx.fill();
  ctx.strokeStyle = rgba(accent, 0.2); ctx.lineWidth = 1;
  ctx.strokeRect(50, ty, ww, 80);
  const lines = [
    { t: '00:01', w: 180 },
    { t: '00:04', w: 140 },
    { t: '00:07', w: 200 },
    { t: '00:10', w: 100 },
  ];
  lines.forEach((l, i) => {
    ctx.fillStyle = rgba(accent, 0.5);
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.fillText(l.t, 60, ty+18+i*18);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(90, ty+12+i*18, l.w, 5);
  });
  ctx.fillStyle = rgba(accent, 0.4);
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillText('TRANSCRIPT OUTPUT', 50, ty-8);
}

function drawMultimodalBind(ctx, accent) {
  const cx = W/2, cy = 170;
  const modalities = [
    { label: 'IMAGE', x: 80, y: 90, color: '#f97316', icon: 'rect' },
    { label: 'AUDIO', x: W-80, y: 90, color: '#22c55e', icon: 'wave' },
    { label: 'VIDEO', x: 120, y: 270, color: '#3b82f6', icon: 'play' },
    { label: 'TEXT', x: W-120, y: 270, color: '#c084fc', icon: 'lines' },
  ];
  modalities.forEach(m => {
    ctx.strokeStyle = rgba(m.color, 0.3);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.setLineDash([]);
  });
  glow(ctx, cx, cy, 60, accent, 0.2);
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI*2); ctx.stroke();
  ctx.strokeStyle = accent; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(cx-7, cy-3, 10, -0.5, 2.2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx+7, cy+3, 10, 2.6, 5.8); ctx.stroke();
  modalities.forEach(m => {
    ctx.fillStyle = rgba(m.color, 0.1);
    ctx.beginPath(); ctx.roundRect(m.x-30, m.y-18, 60, 36, 8); ctx.fill();
    ctx.strokeStyle = m.color; ctx.lineWidth = 1.5;
    ctx.strokeRect(m.x-30, m.y-18, 60, 36);
    ctx.fillStyle = m.color;
    if (m.icon === 'rect') {
      ctx.fillRect(m.x-8, m.y-6, 16, 12);
    } else if (m.icon === 'wave') {
      ctx.beginPath();
      for (let x=-10; x<10; x++) {
        const y = m.y + Math.sin(x*0.5)*5;
        x===-10 ? ctx.moveTo(m.x+x,y) : ctx.lineTo(m.x+x,y);
      }
      ctx.stroke();
    } else if (m.icon === 'play') {
      ctx.beginPath(); ctx.moveTo(m.x-5, m.y-7); ctx.lineTo(m.x+7, m.y); ctx.lineTo(m.x-5, m.y+7); ctx.closePath(); ctx.fill();
    } else {
      ctx.fillRect(m.x-8, m.y-6, 16, 2);
      ctx.fillRect(m.x-8, m.y-1, 12, 2);
      ctx.fillRect(m.x-8, m.y+4, 16, 2);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '8px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(m.label, m.x, m.y+30);
  });
  ctx.textAlign = 'left';
}

function drawDubbing(ctx, accent) {
  const ly = 120;
  ctx.fillStyle = rgba(accent, 0.08);
  ctx.beginPath();
  ctx.roundRect(30, ly, 150, 60, 12);
  ctx.fill();
  ctx.strokeStyle = rgba(accent, 0.4); ctx.lineWidth = 1.5;
  ctx.strokeRect(30, ly, 150, 60);
  ctx.fillStyle = rgba(accent, 0.4);
  ctx.fillRect(45, ly+15, 80, 4);
  ctx.fillRect(45, ly+25, 100, 4);
  ctx.fillRect(45, ly+35, 60, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillText('ENGLISH', 45, ly+52);
  const gx = W/2, gy = ly+30;
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(gx, gy, 18, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(gx, gy, 7, 18, 0, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx-18, gy); ctx.lineTo(gx+18, gy); ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(gx-5, gy+25); ctx.lineTo(gx+5, gy+25); ctx.lineTo(gx, gy+35); ctx.closePath(); ctx.fill();
  const ry = ly + 70;
  ctx.fillStyle = rgba('#4ecdc4', 0.08);
  ctx.beginPath(); ctx.roundRect(W-180, ry, 150, 60, 12); ctx.fill();
  ctx.strokeStyle = rgba('#4ecdc4', 0.4); ctx.lineWidth = 1.5;
  ctx.strokeRect(W-180, ry, 150, 60);
  ctx.fillStyle = rgba('#4ecdc4', 0.4);
  ctx.fillRect(W-165, ry+15, 90, 4);
  ctx.fillRect(W-165, ry+25, 70, 4);
  ctx.fillRect(W-165, ry+35, 110, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('JAPANESE', W-165, ry+52);
  const wy = ry + 85;
  ctx.fillStyle = rgba(accent, 0.06);
  ctx.beginPath(); ctx.roundRect(40, wy, W-80, 40, 6); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=0; x<W-80; x++) {
    const y = wy+20 + Math.sin(x*0.08)*12 + Math.sin(x*0.2)*5;
    x===0 ? ctx.moveTo(40+x,y) : ctx.lineTo(40+x,y);
  }
  ctx.stroke();
  ctx.fillStyle = rgba('#4ecdc4', 0.5);
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DUBBED AUDIO OUTPUT', W/2, wy+52);
  ctx.textAlign = 'left';
}

function drawColorCorrection(ctx, accent) {
  const fw = 150, fh = 100, gap = 20;
  const sx = (W - fw*2 - gap) / 2, sy = 100;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath(); ctx.roundRect(sx, sy, fw, fh, 6); ctx.fill();
  const bg1 = ctx.createLinearGradient(sx, sy, sx+fw, sy+fh);
  bg1.addColorStop(0, '#3a3a3a'); bg1.addColorStop(0.5, '#555'); bg1.addColorStop(1, '#2a2a2a');
  ctx.fillStyle = bg1; ctx.fillRect(sx+1, sy+1, fw-2, fh-2);
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(sx+1, sy+1, fw-2, fh*0.5);
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath(); ctx.moveTo(sx, sy+fh*0.6);
  ctx.quadraticCurveTo(sx+fw*0.3, sy+fh*0.4, sx+fw*0.5, sy+fh*0.55);
  ctx.quadraticCurveTo(sx+fw*0.7, sy+fh*0.7, sx+fw, sy+fh*0.5);
  ctx.lineTo(sx+fw, sy+fh); ctx.lineTo(sx, sy+fh); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.strokeRect(sx, sy, fw, fh);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BEFORE', sx+fw/2, sy+fh+15);
  const ax = sx + fw + gap/2;
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(ax-15, sy+fh/2); ctx.lineTo(ax+15, sy+fh/2); ctx.lineTo(ax+5, sy+fh/2-5);
  ctx.lineTo(ax+5, sy+fh/2+5); ctx.closePath(); ctx.fill();
  const ax2 = sx + fw + gap;
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath(); ctx.roundRect(ax2, sy, fw, fh, 6); ctx.fill();
  const bg2 = ctx.createLinearGradient(ax2, sy, ax2+fw, sy+fh);
  bg2.addColorStop(0, '#1a2a5f'); bg2.addColorStop(0.4, '#2a4a8f'); bg2.addColorStop(1, '#0a1a3f');
  ctx.fillStyle = bg2; ctx.fillRect(ax2+1, sy+1, fw-2, fh*0.5);
  const sg = ctx.createLinearGradient(ax2, sy+fh*0.35, ax2, sy+fh*0.55);
  sg.addColorStop(0, '#ff6b35'); sg.addColorStop(1, '#ffaa00');
  ctx.fillStyle = sg; ctx.fillRect(ax2+1, sy+fh*0.35, fw-2, fh*0.15);
  ctx.fillStyle = '#1a3a2a';
  ctx.beginPath(); ctx.moveTo(ax2, sy+fh*0.6);
  ctx.quadraticCurveTo(ax2+fw*0.3, sy+fh*0.4, ax2+fw*0.5, sy+fh*0.55);
  ctx.quadraticCurveTo(ax2+fw*0.7, sy+fh*0.7, ax2+fw, sy+fh*0.5);
  ctx.lineTo(ax2+fw, sy+fh); ctx.lineTo(ax2, sy+fh); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
  ctx.strokeRect(ax2, sy, fw, fh);
  ctx.fillText('AFTER', ax2+fw/2, sy+fh+15);
  const wy = sy + fh + 35;
  const colors = ['#ff4444', '#44ff44', '#4444ff'];
  colors.forEach((c, i) => {
    const wx = W/2 - 60 + i*60;
    ctx.strokeStyle = rgba(c, 0.4); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(wx, wy+15, 15, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = c;
    const da = (i*1.2 + 0.5);
    ctx.beginPath(); ctx.arc(wx + Math.cos(da)*10, wy+15 + Math.sin(da)*10, 4, 0, Math.PI*2); ctx.fill();
  });
  ctx.textAlign = 'left';
}

function drawUpscale(ctx, accent) {
  const s = 80, gap = 30;
  const sx = W/2 - s - gap/2, sy = 110;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('480p', sx+s/2, sy-10);
  const ps = s/6;
  for (let r=0; r<6; r++) {
    for (let c=0; c<6; c++) {
      const px = sx + c*ps, py = sy + r*ps;
      const hue = 200 + r*10 + c*5;
      ctx.fillStyle = `hsl(${hue}, 40%, ${25+r*3}%)`;
      ctx.fillRect(px, py, ps-1, ps-1);
    }
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  ctx.strokeRect(sx, sy, s, s);
  const ax = W/2;
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(ax-15, sy+s/2); ctx.lineTo(ax+15, sy+s/2); ctx.lineTo(ax+5, sy+s/2-8);
  ctx.lineTo(ax+5, sy+s/2+8); ctx.closePath(); ctx.fill();
  const rx = W/2 + gap/2;
  ctx.fillText('4K', rx+s/2, sy-10);
  const hg = ctx.createLinearGradient(rx, sy, rx+s, sy+s);
  hg.addColorStop(0, '#1a4a8f'); hg.addColorStop(0.3, '#2a6abf'); hg.addColorStop(0.5, '#3a8adf');
  hg.addColorStop(0.7, '#2a6abf'); hg.addColorStop(1, '#1a3a6f');
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.roundRect(rx, sy, s, s, 4); ctx.fill();
  ctx.strokeStyle = rgba(accent, 0.3); ctx.lineWidth = 0.5;
  for (let i=0; i<8; i++) {
    const ly = sy + 10 + i*(s-20)/7;
    ctx.beginPath(); ctx.moveTo(rx+5, ly); ctx.quadraticCurveTo(rx+s/2, ly + (i%2?-5:5), rx+s-5, ly); ctx.stroke();
  }
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
  ctx.strokeRect(rx, sy, s, s);
  ctx.fillStyle = accent;
  ctx.font = 'bold 10px "IBM Plex Mono", monospace';
  ctx.fillText('4x UPSCALE', W/2, sy+s+30);
  const dy = sy + s + 50;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillText('PIXEL COUNT: 307,200', sx+s/2, dy);
  ctx.fillStyle = accent;
  ctx.fillText('PIXEL COUNT: 8,294,400', rx+s/2, dy);
  ctx.textAlign = 'left';
}

function drawStabilize(ctx, accent) {
  const cy = 150;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SHAKY FOOTAGE', W/2, cy-35);
  ctx.strokeStyle = rgba('#ff6b6b', 0.5);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x=40; x<W-40; x++) {
    const y = cy + Math.sin(x*0.15)*12 + Math.sin(x*0.35)*6 + (Math.sin(x*0.8))*4;
    x===40 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke();
  const fx = 160, fy = cy-5;
  ctx.strokeStyle = rgba('#ff6b6b', 0.6); ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(fx+40, fy+25);
  ctx.rotate(0.08);
  ctx.strokeRect(-40, -25, 80, 50);
  ctx.beginPath(); ctx.moveTo(-5,0); ctx.lineTo(5,0); ctx.moveTo(0,-5); ctx.lineTo(0,5); ctx.stroke();
  ctx.restore();
  const ay = cy + 30;
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(W/2, ay+25); ctx.lineTo(W/2-10, ay+5); ctx.lineTo(W/2+10, ay+5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.12);
  ctx.beginPath(); ctx.roundRect(W/2-35, ay+8, 70, 20, 4); ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = 'bold 8px "IBM Plex Mono", monospace';
  ctx.fillText('STABILIZE', W/2, ay+22);
  const sy2 = ay + 50;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px "IBM Plex Mono", monospace';
  ctx.fillText('STABILIZED', W/2, sy2-10);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(40, sy2+15); ctx.lineTo(W-40, sy2+15); ctx.stroke();
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.strokeRect(160, sy2-10, 80, 50);
  ctx.beginPath(); ctx.moveTo(195, sy2+15); ctx.lineTo(205, sy2+15); ctx.moveTo(200, sy2+10); ctx.lineTo(200, sy2+20); ctx.stroke();
  ctx.strokeStyle = rgba(accent, 0.3); ctx.lineWidth = 1;
  ctx.setLineDash([3,3]);
  for (let i=0; i<4; i++) {
    const vx = 80 + i*80;
    ctx.beginPath(); ctx.moveTo(vx, sy2+40); ctx.lineTo(vx, sy2+65); ctx.stroke();
    ctx.fillStyle = rgba(accent, 0.3);
    ctx.beginPath(); ctx.moveTo(vx-4, sy2+65); ctx.lineTo(vx+4, sy2+65); ctx.lineTo(vx, sy2+70); ctx.closePath(); ctx.fill();
  }
  ctx.setLineDash([]);
  ctx.textAlign = 'left';
}

function drawComedy(ctx, accent) {
  const stageY = 180;
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, stageY, W, H-stageY);
  const fg = ctx.createLinearGradient(0, stageY, 0, stageY+30);
  fg.addColorStop(0, '#2a2a3e'); fg.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = fg; ctx.fillRect(0, stageY, W, 30);
  ctx.fillStyle = rgba(accent, 0.08);
  ctx.beginPath();
  ctx.moveTo(W/2-10, 0); ctx.lineTo(W/2-80, stageY); ctx.lineTo(W/2+80, stageY); ctx.lineTo(W/2+10, 0);
  ctx.closePath(); ctx.fill();
  glow(ctx, W/2, stageY-20, 100, accent, 0.15);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W/2, stageY-60); ctx.lineTo(W/2, stageY); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.ellipse(W/2, stageY-65, 6, 10, 0, 0, Math.PI*2); ctx.fill();
  for (let i = 0; i < 12; i++) {
    const ax = 30 + i*30;
    const ah = 25 + (i%3)*10;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.arc(ax, stageY+40-ah, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillRect(ax-6, stageY+40-ah+6, 12, ah-6);
  }
  const laughs = ['HA!', 'LOL'];
  laughs.forEach((t, i) => {
    const lx = 80 + i*180, ly = 80 + i*20;
    ctx.fillStyle = rgba(accent, 0.6 + i*0.1);
    ctx.font = `bold ${18-i*4}px "Outfit", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(t, lx, ly);
  });
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.roundRect(30, stageY+60, W-60, 30, 6); ctx.fill();
  const beats = [0.2, 0.35, 0.5, 0.65, 0.8];
  beats.forEach((b, i) => {
    const bx = 30 + (W-60)*b;
    ctx.fillStyle = i === 2 ? accent : 'rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.arc(bx, stageY+75, i===2 ? 6 : 3, 0, Math.PI*2); ctx.fill();
  });
  ctx.fillStyle = accent;
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PUNCHLINE', 30+(W-60)*0.5, stageY+95);
  ctx.textAlign = 'left';
}

function drawCommentary(ctx, accent) {
  const fx = 50, fy = 80, fw = W-100, fh = 180;
  const vg = ctx.createLinearGradient(fx, fy, fx+fw, fy+fh);
  vg.addColorStop(0, '#1a2a3a'); vg.addColorStop(0.5, '#2a3a4a'); vg.addColorStop(1, '#1a2a3a');
  ctx.fillStyle = vg; ctx.fillRect(fx, fy, fw, fh);
  ctx.fillStyle = rgba('#4a6a8a', 0.3);
  ctx.fillRect(fx+20, fy+30, 100, 8);
  ctx.fillRect(fx+20, fy+45, 140, 6);
  ctx.fillRect(fx+20, fy+58, 80, 6);
  ctx.fillStyle = rgba('#fff', 0.15);
  ctx.beginPath(); ctx.arc(fx+fw/2, fy+fh/2-10, 25, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath(); ctx.moveTo(fx+fw/2-8, fy+fh/2-20); ctx.lineTo(fx+fw/2+12, fy+fh/2-10); ctx.lineTo(fx+fw/2-8, fy+fh/2); ctx.closePath(); ctx.fill();
  const ox = fx+fw-80, oy = fy+fh-70;
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.roundRect(ox, oy, 65, 55, 8); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.strokeRect(ox, oy, 65, 55);
  ctx.fillStyle = rgba(accent, 0.3);
  ctx.beginPath(); ctx.arc(ox+32, oy+22, 12, 0, Math.PI*2); ctx.fill();
  for (let i=0; i<3; i++) {
    ctx.strokeStyle = rgba(accent, 0.3-i*0.08);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(ox+65, oy+22, 8+i*8, -Math.PI*0.3, Math.PI*0.3); ctx.stroke();
  }
  const ty = fy + fh + 15;
  ctx.fillStyle = rgba(accent, 0.08);
  ctx.beginPath(); ctx.roundRect(fx, ty, fw, 60, 6); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.roundRect(fx+10, ty+8, fw*0.7, 20, 4); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.5);
  ctx.fillRect(fx+20, ty+16, 120, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(fx+20, ty+38, 180, 4);
  ctx.fillRect(fx+20, ty+48, 100, 4);
}

function drawOverview(ctx, accent) {
  const fx = 40, fy = 90, fw = W-80, fh = 120;
  ctx.fillStyle = '#0f1520';
  ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, 6); ctx.fill();
  for (let i=0; i<10; i++) {
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath(); ctx.roundRect(fx+5+i*(fw/10), fy+4, 12, 8, 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(fx+5+i*(fw/10), fy+fh-12, 12, 8, 2); ctx.fill();
  }
  const scenes = ['#2a3a5f', '#3f2a5f', '#5f3a2a', '#2a5f3f'];
  scenes.forEach((c, i) => {
    const sx = fx+8 + i*((fw-16)/4);
    const sw = (fw-16)/4 - 4;
    ctx.fillStyle = c;
    ctx.fillRect(sx, fy+16, sw, fh-32);
  });
  const chapters = [0, 0.25, 0.5, 0.75, 1];
  chapters.forEach((c, i) => {
    const cx = fx + fw*c;
    ctx.strokeStyle = i%2===0 ? accent : rgba(accent, 0.3);
    ctx.lineWidth = i%2===0 ? 2 : 1;
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(cx, fy); ctx.lineTo(cx, fy+fh); ctx.stroke();
    ctx.setLineDash([]);
  });
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.roundRect(fx, fy+fh+8, fw, 6, 3); ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.roundRect(fx, fy+fh+8, fw*0.7, 6, 3); ctx.fill();
  const sy = fy + fh + 25;
  ctx.fillStyle = rgba(accent, 0.06);
  ctx.beginPath(); ctx.roundRect(fx, sy, fw, 70, 8); ctx.fill();
  ctx.strokeStyle = rgba(accent, 0.15); ctx.lineWidth = 1;
  ctx.strokeRect(fx, sy, fw, 70);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '8px "IBM Plex Mono", monospace';
  ctx.fillText('CHAPTER SUMMARY', fx+10, sy+14);
  for (let i=0; i<4; i++) {
    ctx.fillStyle = i===0 ? accent : rgba(accent, 0.3);
    ctx.font = '7px "IBM Plex Mono", monospace';
    ctx.fillText('CH.' + (i+1), fx+10, sy+30+i*12);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(fx+40, sy+25+i*12, 80 + i*30, 4);
  }
}

function drawMeme(ctx, accent) {
  const fx = 60, fy = 80, fw = W-120, fh = 200;
  const mg = ctx.createLinearGradient(fx, fy, fx+fw, fy+fh);
  mg.addColorStop(0, '#2a2a4a'); mg.addColorStop(0.5, '#3a3a5a'); mg.addColorStop(1, '#2a2a4a');
  ctx.fillStyle = mg; ctx.fillRect(fx, fy, fw, fh);
  ctx.fillStyle = rgba('#fff', 0.08);
  ctx.beginPath(); ctx.arc(W/2, fy+fh/2-10, 50, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = rgba('#fff', 0.15);
  ctx.beginPath(); ctx.arc(W/2-15, fy+fh/2-20, 8, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W/2+15, fy+fh/2-20, 8, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = rgba('#fff', 0.15); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(W/2, fy+fh/2, 20, 0.1*Math.PI, 0.9*Math.PI); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
  ctx.strokeText('TOP TEXT', W/2, fy+30);
  ctx.fillText('TOP TEXT', W/2, fy+30);
  ctx.strokeText('BOTTOM TEXT', W/2, fy+fh-15);
  ctx.fillText('BOTTOM TEXT', W/2, fy+fh-15);
  ctx.strokeStyle = rgba(accent, 0.4); ctx.lineWidth = 2;
  ctx.strokeRect(fx, fy, fw, fh);
  ctx.setLineDash([4,4]);
  ctx.strokeStyle = rgba(accent, 0.3); ctx.lineWidth = 1;
  ctx.strokeRect(fx+10, fy+8, fw-20, 30);
  ctx.strokeRect(fx+10, fy+fh-40, fw-20, 30);
  ctx.setLineDash([]);
  ctx.fillStyle = accent;
  ctx.font = 'bold 8px "IBM Plex Mono", monospace';
  ctx.fillText('AI CAPTION', W/2, fy+fh+20);
  ctx.textAlign = 'left';
}

function drawMusicVideo(ctx, accent) {
  const wy = 100;
  ctx.strokeStyle = accent; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x=40; x<W-40; x++) {
    const beat = Math.sin((x-40)*0.04) > 0.7 ? 25 : 12;
    const y = wy + Math.sin(x*0.1)*beat + Math.sin(x*0.25)*5;
    x===40 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  }
  ctx.stroke();
  for (let i=0; i<5; i++) {
    const bx = 40 + i*((W-80)/4);
    ctx.fillStyle = rgba(accent, 0.15);
    ctx.beginPath(); ctx.roundRect(bx-8, wy-30, 16, 60, 3); ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(bx, wy, 4, 0, Math.PI*2); ctx.fill();
  }
  const fy = wy + 50;
  const frameColors = ['#3a1a5f', '#5f1a3a', '#1a3a5f', '#1a5f3a', '#5f3a1a'];
  for (let i=0; i<5; i++) {
    const fx = 30 + i*72;
    const fw = 62, fh = 45;
    ctx.fillStyle = frameColors[i];
    ctx.fillRect(fx, fy, fw, fh);
    const bx = 40 + i*((W-80)/4);
    ctx.strokeStyle = rgba(accent, 0.2); ctx.lineWidth = 1;
    ctx.setLineDash([2,2]);
    ctx.beginPath(); ctx.moveTo(bx, wy+30); ctx.lineTo(fx+fw/2, fy); ctx.stroke();
    ctx.setLineDash([]);
    if (i === 2) {
      ctx.strokeStyle = accent; ctx.lineWidth = 2;
      ctx.strokeRect(fx, fy, fw, fh);
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(fx+fw/2, fy+fh/2, 10, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.moveTo(fx+fw/2-4, fy+fh/2-6); ctx.lineTo(fx+fw/2+6, fy+fh/2); ctx.lineTo(fx+fw/2-4, fy+fh/2+6); ctx.closePath(); ctx.fill();
    }
  }
  const notes = ['\u266A', '\u266B', '\u266A'];
  notes.forEach((n, i) => {
    ctx.fillStyle = rgba(accent, 0.3);
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n, 100+i*100, fy+65);
  });
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.roundRect(30, fy+80, W-60, 8, 4); ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.roundRect(30, fy+80, (W-60)*0.5, 8, 4); ctx.fill();
  ctx.textAlign = 'left';
}

function drawQA(ctx, accent) {
  const fx = 50, fy = 80, fw = W-100, fh = 130;
  const vg = ctx.createLinearGradient(fx, fy, fx+fw, fy+fh);
  vg.addColorStop(0, '#1a2a3a'); vg.addColorStop(1, '#0a1a2a');
  ctx.fillStyle = vg; ctx.fillRect(fx, fy, fw, fh);
  ctx.fillStyle = rgba('#4a6a8a', 0.2);
  ctx.beginPath(); ctx.arc(fx+50, fy+fh/2, 25, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(fx+fw-50, fy+fh/2, 25, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = rgba(accent, 0.15);
  ctx.beginPath(); ctx.arc(W/2, fy+fh/2, 30, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = 'bold 32px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('?', W/2, fy+fh/2+12);
  const qy = fy + fh + 15;
  ctx.fillStyle = rgba(accent, 0.08);
  ctx.beginPath(); ctx.roundRect(fx, qy, fw*0.8, 35, 8); ctx.fill();
  ctx.strokeStyle = rgba(accent, 0.3); ctx.lineWidth = 1;
  ctx.strokeRect(fx, qy, fw*0.8, 35);
  ctx.fillStyle = accent;
  ctx.font = 'bold 8px "IBM Plex Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Q:', fx+10, qy+14);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(fx+30, qy+10, 140, 5);
  ctx.fillRect(fx+30, qy+22, 100, 5);
  const ax2 = W/2;
  ctx.fillStyle = rgba(accent, 0.5);
  ctx.beginPath(); ctx.moveTo(ax2, qy+42); ctx.lineTo(ax2-6, qy+36); ctx.lineTo(ax2+6, qy+36); ctx.closePath(); ctx.fill();
  const ay2 = qy + 50;
  ctx.fillStyle = rgba('#4ecdc4', 0.08);
  ctx.beginPath(); ctx.roundRect(fx+fw*0.2, ay2, fw*0.8, 35, 8); ctx.fill();
  ctx.strokeStyle = rgba('#4ecdc4', 0.3); ctx.lineWidth = 1;
  ctx.strokeRect(fx+fw*0.2, ay2, fw*0.8, 35);
  ctx.fillStyle = '#4ecdc4';
  ctx.fillText('A:', fx+fw*0.2+10, ay2+14);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(fx+fw*0.2+30, ay2+10, 160, 5);
  ctx.fillRect(fx+fw*0.2+30, ay2+22, 120, 5);
  ctx.textAlign = 'left';
}

// ═══════════════════════════════════════
// GENERATE ALL THUMBNAILS
// ═══════════════════════════════════════
console.log('\n━━━ VideoAgent Thumbnail Generator ━━━\n');

function gen(config) {
  const { filename, bg1, bg2, accent, draw, title, subtitle, angle } = config;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  drawBg(ctx, bg1, bg2, angle||135);
  glow(ctx, W*0.7, H*0.25, 200, accent, 0.08);
  if (draw) draw(ctx, accent);
  vignette(ctx);
  noise(ctx);
  label(ctx, title, subtitle, accent);
  const outPath = path.join(OUT_DIR, filename);
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('  ✓', filename);
}

console.log('▸ Use Cases:');
gen({ filename:'standup.png', bg1:'#0a0a14', bg2:'#1a0a28', accent:'#ff6b9d', draw:drawComedy, title:'Stand-up Comedy', subtitle:'AI COMEDY TIMING & PACING' });
gen({ filename:'commentary.png', bg1:'#0a0f14', bg2:'#0a1a2e', accent:'#4ecdc4', draw:drawCommentary, title:'Commentary', subtitle:'AI VOICE OVERLAY & ANALYSIS' });
gen({ filename:'overview.png', bg1:'#0a1210', bg2:'#0a2e1a', accent:'#95e67a', draw:drawOverview, title:'Video Overview', subtitle:'SUMMARY & CHAPTER GENERATION' });
gen({ filename:'meme.png', bg1:'#12100a', bg2:'#2e2a0a', accent:'#ffd93d', draw:drawMeme, title:'Meme Generator', subtitle:'VIRAL CONTENT CREATION' });
gen({ filename:'music-video.png', bg1:'#100a14', bg2:'#2e0a2e', accent:'#c084fc', draw:drawMusicVideo, title:'Music Video', subtitle:'BEAT-SYNCED VISUALS' });
gen({ filename:'qa.png', bg1:'#0a1014', bg2:'#0a1e2e', accent:'#60a5fa', draw:drawQA, title:'Video Q&A', subtitle:'INTERACTIVE AI ANALYSIS' });

console.log('\n▸ AI Tools:');
gen({ filename:'scene-detection.png', bg1:'#0a0e14', bg2:'#0a1e3e', accent:'#3b82f6', draw:drawFilmFrames, title:'Scene Detection', subtitle:'BOUNDARY IDENTIFICATION' });
gen({ filename:'clip-segmentation.png', bg1:'#100a14', bg2:'#2a0a3e', accent:'#a855f7', draw:drawScissorsCut, title:'Clip Segmentation', subtitle:'SMART SPLIT & SEGMENT' });
gen({ filename:'highlight-detection.png', bg1:'#140e0a', bg2:'#3e1e0a', accent:'#f97316', draw:drawStarHighlight, title:'Highlight Detection', subtitle:'KEY MOMENT FINDER' });
gen({ filename:'cosyvoice.png', bg1:'#140a10', bg2:'#3e0a2a', accent:'#ec4899', draw:drawVoiceClone, title:'CosyVoice', subtitle:'VOICE CLONING & TTS' });
gen({ filename:'fish-speech.png', bg1:'#0a1414', bg2:'#0a3e3e', accent:'#06b6d4', draw:drawSpeechWaves, title:'Fish Speech', subtitle:'VOICE SYNTHESIS ENGINE' });
gen({ filename:'seed-vc.png', bg1:'#0a1410', bg2:'#0a3e2a', accent:'#14b8a6', draw:drawVoiceSwap, title:'Seed-VC', subtitle:'VOICE CONVERSION' });
gen({ filename:'whisper.png', bg1:'#0e140a', bg2:'#1e3e0a', accent:'#22c55e', draw:drawAudioToText, title:'Whisper', subtitle:'AUDIO TRANSCRIPTION' });
gen({ filename:'imagebind.png', bg1:'#0e0a14', bg2:'#1e0a3e', accent:'#6366f1', draw:drawMultimodalBind, title:'ImageBind', subtitle:'MULTIMODAL BINDING' });
gen({ filename:'dubbing.png', bg1:'#14140a', bg2:'#3e3e0a', accent:'#eab308', draw:drawDubbing, title:'Cross-lingual Dub', subtitle:'TRANSLATE & DUB VIDEO' });
gen({ filename:'color-correct.png', bg1:'#140a0e', bg2:'#3e0a1e', accent:'#f43f5e', draw:drawColorCorrection, title:'Color Correction', subtitle:'TONE & BALANCE' });
gen({ filename:'upscale.png', bg1:'#0a140e', bg2:'#0a3e1e', accent:'#10b981', draw:drawUpscale, title:'Video Upscale', subtitle:'RESOLUTION ENHANCEMENT' });
gen({ filename:'stabilize.png', bg1:'#100e14', bg2:'#2a1e3e', accent:'#8b5cf6', draw:drawStabilize, title:'Stabilize', subtitle:'MOTION CORRECTION' });

console.log('\n▸ Section Headers:');
gen({ filename:'header-use-cases.png', bg1:'#08080c', bg2:'#101020', accent:'#d9ff00', draw:drawFilmFrames, title:'AI USE CASES', subtitle:'CREATIVE VIDEO INTELLIGENCE' });
gen({ filename:'header-tools.png', bg1:'#08080c', bg2:'#0c1018', accent:'#d9ff00', draw:drawFilmFrames, title:'AI PROCESSING TOOLS', subtitle:'PROFESSIONAL VIDEO PIPELINE' });

console.log('\n▸ Empty State:');
gen({ filename:'empty-video.png', bg1:'#0a0a0f', bg2:'#101018', accent:'#444444', draw:null, title:'No Video Loaded', subtitle:'GENERATE A VIDEO FIRST TO PROCESS' });

console.log('\n▸ Category Tabs:');
gen({ filename:'tab-understand.png', bg1:'#080c10', bg2:'#0c1828', accent:'#60a5fa', draw:drawFilmFrames, title:'UNDERSTAND', subtitle:'ANALYSIS & DETECTION' });
gen({ filename:'tab-edit.png', bg1:'#0c0810', bg2:'#180c28', accent:'#c084fc', draw:drawScissorsCut, title:'EDIT', subtitle:'SEGMENTATION & SPLITTING' });
gen({ filename:'tab-audio.png', bg1:'#0c1008', bg2:'#18280c', accent:'#4ade80', draw:drawVoiceClone, title:'AUDIO', subtitle:'VOICE & SPEECH TOOLS' });

const count = fs.readdirSync(OUT_DIR).filter(f=>f.endsWith('.png')).length;
console.log('\n━━━ Done! Generated', count, 'thumbnails ━━━\n');
