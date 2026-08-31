// ============================================================================
// SUPERSEDED. THIS SCRIPT DOES NOT PRODUCE THE SHIPPED ARTWORK.
// ============================================================================
// It generated the W4 artwork (1024x1024, "v11", approved 2026-08-30 and
// REPLACED the same day). The shipped `assets/artwork/a16-summarizer.png` is
// now Omar's chosen image: an A16 die with a chat bubble, glowing on black,
// extracted to straight alpha at 1254x1254. This script cannot reproduce it.
//
// Kept, not deleted, because it is the worked example of STYLE.md's technique 7
// (full-procedural rendering) and the only one in the catalog. It is retained as
// a method reference only.
//
// It can no longer clobber the shipped artwork: OUT is a superseded-only
// filename and a guard below hard-fails if that ever changes.
//
// What it drew: per-pixel conic aurora ON the die face (angle->color,
// edge-distance->brightness), SVG overlay for slab/sheen/text/bubble.
// Deterministic: same output every run.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHIPPED = path.join(HERE, 'a16-summarizer.png');
const OUT = path.join(HERE, 'a16-summarizer-SUPERSEDED-w4.png');

// Guard: `assets/artwork/` is committed and precious, one human-approved PNG per
// project. This script's output is not that PNG and must never take its path.
if (path.resolve(OUT) === path.resolve(SHIPPED)) {
  throw new Error(
    'REFUSING TO RUN: this superseded script would overwrite the shipped artwork ' +
      'assets/artwork/a16-summarizer.png. Restore OUT to the -SUPERSEDED- filename.'
  );
}
console.warn(
  '[superseded] This is the W4 generator. Its output is NOT the shipped artwork.\n' +
    `[superseded] Writing ${path.basename(OUT)} (git-ignored scratch), leaving a16-summarizer.png untouched.`
);
const W = 1024, DIE = { x: 212, y: 200, w: 600, h: 600, r: 30 };
const stops = [
  [90,[63,210,255]],[35,[87,180,255]],[345,[160,107,255]],[300,[236,72,153]],
  [250,[255,95,109]],[205,[255,159,10]],[150,[255,179,71]],[120,[168,85,247]],
].sort((a,b)=>a[0]-b[0]);
function colorAt(deg){const d=((deg%360)+360)%360;let i=stops.findIndex(s=>s[0]>d);
  const [a,b]=i===-1?[stops[stops.length-1],[stops[0][0]+360,stops[0][1]]]:i===0?[[stops[stops.length-1][0]-360,stops[stops.length-1][1]],stops[0]]:[stops[i-1],stops[i]];
  const t=(d-a[0])/(b[0]-a[0]);return a[1].map((c,k)=>c+(b[1][k]-c)*t);}
const smooth=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
function sd(px,py){const cx=DIE.x+DIE.w/2,cy=DIE.y+DIE.h/2;
  const qx=Math.abs(px-cx)-(DIE.w/2-DIE.r),qy=Math.abs(py-cy)-(DIE.h/2-DIE.r);
  const ax=Math.max(qx,0),ay=Math.max(qy,0);
  return Math.hypot(ax,ay)+Math.min(Math.max(qx,qy),0)-DIE.r;}
const buf=Buffer.alloc(W*W*3);const cx=W/2,cy=DIE.y+DIE.h/2;
for(let y=0;y<W;y++)for(let x=0;x<W;x++){
  const deg=Math.atan2(cy-y,x-cx)*180/Math.PI;const col=colorAt(deg);const s=sd(x,y);
  let r,g,b;
  if(s<=0){const rad=Math.hypot(x-cx,y-cy);
    const dMix=(-s)*0.72+Math.max(0,(400-rad))*0.28;
    const t=Math.pow(smooth(1-dMix/280),2.5)*0.88;
    r=8+(col[0]-8)*t;g=8+(col[1]-8)*t;b=10+(col[2]-10)*t;
  } else {const glow=Math.exp(-s/44)*0.55;const bg=[242,242,244];
    r=bg[0]+(col[0]-bg[0])*glow;g=bg[1]+(col[1]-bg[1])*glow;b=bg[2]+(col[2]-bg[2])*glow;}
  const i=(y*W+x)*3;buf[i]=r;buf[i+1]=g;buf[i+2]=b;
}
const BUB = `M 762 92 L 858 92 Q 908 92 908 142 L 908 180 Q 908 230 858 230 L 786 230
  Q 762 274 716 288 Q 744 262 750 230 Q 712 226 712 180 L 712 142 Q 712 92 762 92 Z`;
const overlay=`<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="silver" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f4f4f8"/><stop offset="45%" stop-color="#cfcfd6"/>
      <stop offset="60%" stop-color="#9d9da6"/><stop offset="100%" stop-color="#ebebef"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="slab" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#26262b"/><stop offset="100%" stop-color="#101013"/>
    </linearGradient>
    <linearGradient id="bubw" gradientUnits="userSpaceOnUse" x1="0" y1="92" x2="0" y2="288">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#f0f0f3"/><stop offset="100%" stop-color="#dcdce1"/>
    </linearGradient>
    <filter id="sh" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="bsh" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <rect x="252" y="822" width="520" height="30" rx="15" fill="#0a0a0c" opacity="0.35" filter="url(#sh)"/>
  <path d="M 212 770 L 212 786 Q 212 816 242 816 L 782 816 Q 812 816 812 786 L 812 770 Q 812 800 782 800 L 242 800 Q 212 800 212 770 Z" fill="url(#slab)"/>
  <rect x="224" y="212" width="576" height="70" rx="22" fill="url(#sheen)"/>
  <text x="512" y="560" font-family="Helvetica, Arial" font-size="170" font-weight="700" letter-spacing="4" fill="url(#silver)" text-anchor="middle">A16</text>
  <g>
    <path d="${BUB}" fill="#0a1a2f" opacity="0.30" filter="url(#bsh)" transform="translate(5,11)"/>
    <path d="${BUB}" fill="url(#bubw)"/>
    <ellipse cx="810" cy="110" rx="80" ry="16" fill="#ffffff" opacity="0.6"/>
    <text x="806" y="248" font-family="Georgia, 'Times New Roman', serif" font-size="150" font-weight="700" fill="#0a84ff" text-anchor="middle">&#8220;</text>
  </g>
</svg>`;
sharp(buf,{raw:{width:W,height:W,channels:3}}).blur(1.2)
  .composite([{input:Buffer.from(overlay)}])
  .png().toFile(OUT).then(()=>console.log('rendered', OUT));
