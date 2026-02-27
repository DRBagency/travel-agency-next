'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

/**
 * Animated background for dashboard main area.
 * Layers: radial gradient → color orbs → twinkling stars → aurora waves → noise → canvas particles (mouse magnetism).
 * Adapts to light/dark mode via next-themes.
 */
export default function DashboardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  // Canvas particles with mouse magnetism
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, mx = -999, my = -999;
    let animId: number;

    const darkColors = ['rgba(28,171,176,', 'rgba(212,242,77,', 'rgba(167,139,250,', 'rgba(244,114,182,', 'rgba(255,255,255,'];
    const lightColors = ['rgba(28,171,176,', 'rgba(120,160,20,', 'rgba(120,80,200,', 'rgba(200,60,140,', 'rgba(0,0,0,'];
    const N = 120;

    class Particle {
      x = 0; y = 0; sz = 0; vx = 0; vy = 0; ci = 0;
      alpha = 0; targetAlpha = 0; mag = 0; ease = 0;

      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.sz = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.ci = Math.floor(Math.random() * 5);
        this.alpha = Math.random() * 0.5 + 0.1;
        this.targetAlpha = this.alpha;
        this.mag = Math.random() * 0.8 + 0.2;
        this.ease = Math.random() * 0.02 + 0.01;
      }

      get col() {
        return isLight ? lightColors[this.ci] : darkColors[this.ci];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        const dx = mx - this.x, dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const f = this.mag * (200 - dist) / 200 * 0.015;
          this.x += dx * f;
          this.y += dy * f;
        }
        const edge = 40;
        let ea = 1;
        if (this.x < edge) ea = Math.min(ea, this.x / edge);
        if (this.x > W - edge) ea = Math.min(ea, (W - this.x) / edge);
        if (this.y < edge) ea = Math.min(ea, this.y / edge);
        if (this.y > H - edge) ea = Math.min(ea, (H - this.y) / edge);
        const mAlpha = isLight ? this.targetAlpha * 0.6 : this.targetAlpha;
        this.alpha += (mAlpha * ea - this.alpha) * this.ease * 3;
        if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
        if (Math.random() < 0.005) this.targetAlpha = Math.random() * 0.5 + 0.1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
        ctx.fillStyle = this.col + this.alpha + ')';
        ctx.fill();
        if (this.sz > 1.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.sz * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = this.col + (this.alpha * 0.15) + ')';
          ctx.fill();
        }
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < N; i++) {
      const p = new Particle();
      p.reset();
      particles.push(p);
    }

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();

    const onResize = () => resize();
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -999; my = -999; };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    function loop() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(ctx!); });
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [isLight]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? 'radial-gradient(ellipse 120% 80% at 50% 100%, #D8CFC4, #E5DDD3 70%)'
            : 'radial-gradient(ellipse 120% 80% at 50% 100%, #10303a, #0B1825 70%)',
        }}
      />

      {/* Animated orbs */}
      <div
        className={`absolute rounded-full will-change-transform animate-orbFloat1`}
        style={{
          width: 750, height: 750, top: '-12%', left: '5%',
          background: `radial-gradient(circle, rgba(28,171,176,${isLight ? 0.15 : 0.40}), transparent 70%)`,
          filter: 'blur(120px)', opacity: isLight ? 0.15 : 0.40,
        }}
      />
      <div
        className="absolute rounded-full will-change-transform animate-orbFloat2"
        style={{
          width: 550, height: 550, bottom: '-5%', right: '-5%',
          background: `radial-gradient(circle, rgba(212,242,77,${isLight ? 0.12 : 0.25}), transparent 70%)`,
          filter: 'blur(110px)', opacity: isLight ? 0.12 : 0.25,
        }}
      />
      <div
        className="absolute rounded-full will-change-transform animate-orbFloat3"
        style={{
          width: 600, height: 600, bottom: '10%', left: '30%',
          background: `radial-gradient(circle, rgba(28,171,176,${isLight ? 0.12 : 0.30}), transparent 70%)`,
          filter: 'blur(120px)', opacity: isLight ? 0.12 : 0.30,
        }}
      />
      <div
        className="absolute rounded-full will-change-transform animate-orbFloat4"
        style={{
          width: 400, height: 400, top: '20%', right: '20%',
          background: `radial-gradient(circle, rgba(167,139,250,${isLight ? 0.08 : 0.15}), transparent 70%)`,
          filter: 'blur(100px)', opacity: isLight ? 0.08 : 0.15,
        }}
      />
      <div
        className="absolute rounded-full will-change-transform animate-orbFloat5"
        style={{
          width: 350, height: 350, top: '40%', left: '50%',
          background: `radial-gradient(circle, rgba(244,114,182,${isLight ? 0.06 : 0.12}), transparent 70%)`,
          filter: 'blur(100px)', opacity: isLight ? 0.06 : 0.12,
        }}
      />

      {/* Stars — 18 twinkling dots */}
      {[
        { t: '5%', l: '15%', s: 'small' as const, o: 0.3, d: 3.5 },
        { t: '8%', l: '35%', s: 'medium' as const, o: 0.45, d: 4 },
        { t: '3%', l: '55%', s: 'small' as const, o: 0.25, d: 5 },
        { t: '12%', l: '72%', s: 'large' as const, o: 0.55, d: 3 },
        { t: '6%', l: '88%', s: 'small' as const, o: 0.2, d: 4.5 },
        { t: '15%', l: '22%', s: 'medium' as const, o: 0.35, d: 5.5 },
        { t: '10%', l: '48%', s: 'small' as const, o: 0.4, d: 3.2 },
        { t: '2%', l: '65%', s: 'medium' as const, o: 0.3, d: 4.8 },
        { t: '18%', l: '8%', s: 'small' as const, o: 0.2, d: 3.8 },
        { t: '4%', l: '42%', s: 'large' as const, o: 0.45, d: 4.2 },
        { t: '20%', l: '58%', s: 'small' as const, o: 0.3, d: 5.2 },
        { t: '7%', l: '80%', s: 'medium' as const, o: 0.35, d: 3.6 },
        { t: '14%', l: '92%', s: 'small' as const, o: 0.25, d: 4.6 },
        { t: '9%', l: '5%', s: 'medium' as const, o: 0.4, d: 3.4 },
        { t: '22%', l: '30%', s: 'small' as const, o: 0.2, d: 5 },
        { t: '11%', l: '62%', s: 'large' as const, o: 0.5, d: 3.8 },
        { t: '16%', l: '45%', s: 'small' as const, o: 0.3, d: 4.4 },
        { t: '1%', l: '78%', s: 'medium' as const, o: 0.35, d: 5.5 },
      ].map((star, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${isLight ? 'bg-black/15' : 'bg-white'}`}
          style={{
            top: star.t,
            left: star.l,
            width: star.s === 'small' ? 1 : star.s === 'medium' ? 1.5 : 2,
            height: star.s === 'small' ? 1 : star.s === 'medium' ? 1.5 : 2,
            animation: `twinkle ${star.d}s ease-in-out infinite alternate`,
            '--twinkle-opacity': star.o,
          } as React.CSSProperties}
        />
      ))}

      {/* Aurora waves — SVG curved glowing lines */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave 1 */}
        <div className={`absolute w-[120%] -left-[10%] top-[4%] animate-waveD1 ${isLight ? 'opacity-30' : 'opacity-60'}`} style={{ height: 200 }}>
          <svg viewBox="0 0 1400 200" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="dbaw1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="20%" stopColor="rgba(28,171,176,0.15)" />
                <stop offset="45%" stopColor="rgba(212,242,77,0.12)" />
                <stop offset="70%" stopColor="rgba(167,139,250,0.10)" />
                <stop offset="90%" stopColor="rgba(28,171,176,0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M0,100 C200,40 350,160 550,90 C750,20 900,150 1100,80 C1250,30 1350,110 1400,100" stroke="url(#dbaw1)" strokeWidth="3" fill="none" filter="blur(2px)" />
            <path d="M0,110 C180,50 380,170 560,95 C740,25 920,155 1120,85 C1260,40 1360,115 1400,105" stroke="url(#dbaw1)" strokeWidth="1.5" fill="none" opacity="0.5" filter="blur(1px)" />
          </svg>
        </div>
        {/* Wave 2 */}
        <div className={`absolute w-[120%] -left-[10%] top-[12%] animate-waveD2 ${isLight ? 'opacity-25' : 'opacity-60'}`} style={{ height: 180 }}>
          <svg viewBox="0 0 1400 180" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="dbaw2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="15%" stopColor="rgba(212,242,77,0.10)" />
                <stop offset="40%" stopColor="rgba(244,114,182,0.08)" />
                <stop offset="65%" stopColor="rgba(28,171,176,0.12)" />
                <stop offset="85%" stopColor="rgba(212,242,77,0.06)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M0,90 C250,140 400,30 650,100 C850,160 1000,50 1200,110 C1320,140 1380,80 1400,90" stroke="url(#dbaw2)" strokeWidth="2.5" fill="none" filter="blur(2px)" />
            <path d="M0,95 C230,145 420,35 660,105 C870,165 1010,55 1210,115 C1330,145 1385,85 1400,95" stroke="url(#dbaw2)" strokeWidth="1" fill="none" opacity="0.4" filter="blur(1px)" />
          </svg>
        </div>
        {/* Wave 3 */}
        <div className={`absolute w-[120%] -left-[10%] top-[22%] animate-waveD3 ${isLight ? 'opacity-20' : 'opacity-60'}`} style={{ height: 160 }}>
          <svg viewBox="0 0 1400 160" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="dbaw3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="25%" stopColor="rgba(167,139,250,0.08)" />
                <stop offset="50%" stopColor="rgba(28,171,176,0.10)" />
                <stop offset="75%" stopColor="rgba(244,114,182,0.06)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path d="M0,80 C180,120 350,40 580,95 C780,140 950,50 1150,85 C1300,110 1370,60 1400,80" stroke="url(#dbaw3)" strokeWidth="2" fill="none" filter="blur(2.5px)" />
          </svg>
        </div>
      </div>

      {/* Noise texture overlay */}
      <div
        className={`absolute inset-0 ${isLight ? 'opacity-[0.015]' : 'opacity-[0.022]'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Canvas particles layer */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ pointerEvents: 'auto' }} />
    </div>
  );
}
