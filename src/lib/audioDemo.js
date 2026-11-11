/**
 * CrossFade gain math + Web Audio API local synthesizer for the live interactive demo.
 */

export function computeGains(progress, curve) {
  const p = Math.max(0, Math.min(1, progress));
  if (curve === 'linear') {
    return { a: 1 - p, b: p };
  }
  const split = 0.82;
  if (p <= split) {
    const t = p / split;
    return {
      a: 1.0 - 0.40 * t,
      b: 0.48 * t,
    };
  }
  const ht = (p - split) / (1 - split);
  return {
    a: 0.60 * Math.cos(ht * Math.PI * 0.5),
    b: 0.48 + 0.52 * Math.sin(ht * Math.PI * 0.5),
  };
}

export function buildCurvePaths(curve, width = 360, height = 100, padY = 10) {
  const steps = 60;
  const ptsA = [];
  const ptsB = [];

  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const x = (p * width).toFixed(1);
    const { a, b } = computeGains(p, curve);
    const yA = (padY + (1 - a) * (height - padY * 2)).toFixed(1);
    const yB = (padY + (1 - b) * (height - padY * 2)).toFixed(1);
    ptsA.push(`${x},${yA}`);
    ptsB.push(`${x},${yB}`);
  }

  const lineA = `M ${ptsA.join(' L ')}`;
  const lineB = `M ${ptsB.join(' L ')}`;
  return {
    lineA,
    lineB,
    areaA: `${lineA} L ${width},${height} L 0,${height} Z`,
    areaB: `${lineB} L ${width},${height} L 0,${height} Z`,
  };
}

export function createSynthController() {
  let ctx = null;

  function getContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function spawnPad(audioCtx, freqs, type, targetGain) {
    return freqs.map((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(targetGain);
      osc.start();
      return osc;
    });
  }

  return {
    playCrossfade({ durationSec, curve, onFrame, onComplete }) {
      const audioCtx = getContext();
      if (!audioCtx) return () => {};

      const master = audioCtx.createGain();
      master.gain.value = 0.22;
      master.connect(audioCtx.destination);

      const gainA = audioCtx.createGain();
      const gainB = audioCtx.createGain();
      gainA.connect(master);
      gainB.connect(master);

      const oscA = spawnPad(audioCtx, [174.61, 220.0, 261.63, 329.63], 'triangle', gainA);
      const oscB = spawnPad(audioCtx, [196.0, 246.94, 293.66, 392.0], 'sine', gainB);

      const durationMs = durationSec * 1000;
      const startTs = performance.now();
      let rafId = 0;
      let doneTimer = 0;
      let stopped = false;

      function stop() {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(rafId);
        clearTimeout(doneTimer);
        [...oscA, ...oscB].forEach((o) => {
          try { o.stop(); o.disconnect(); } catch (_) {}
        });
        try {
          gainA.disconnect();
          gainB.disconnect();
          master.disconnect();
        } catch (_) {}
      }

      function tick(now) {
        if (stopped) return;
        const p = Math.min(1, (now - startTs) / durationMs);
        const { a, b } = computeGains(p, curve);
        gainA.gain.setTargetAtTime(a, audioCtx.currentTime, 0.015);
        gainB.gain.setTargetAtTime(b, audioCtx.currentTime, 0.015);
        onFrame({ p, a, b });

        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          doneTimer = setTimeout(() => {
            stop();
            onComplete?.();
          }, 360);
        }
      }

      rafId = requestAnimationFrame(tick);
      return stop;
    },

    playGapDemo({ onStep, onComplete }) {
      const audioCtx = getContext();
      if (!audioCtx) return () => {};

      const master = audioCtx.createGain();
      master.gain.value = 0.22;
      master.connect(audioCtx.destination);

      const gainA = audioCtx.createGain();
      const gainB = audioCtx.createGain();
      gainA.connect(master);
      gainB.connect(master);

      const oscA = spawnPad(audioCtx, [174.61, 220.0, 261.63, 329.63], 'triangle', gainA);
      const oscB = spawnPad(audioCtx, [196.0, 246.94, 293.66, 392.0], 'sine', gainB);

      gainA.gain.value = 1;
      gainB.gain.value = 0;
      onStep?.(1);

      const timers = [
        setTimeout(() => {
          gainA.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
          onStep?.(2);
        }, 900),
        setTimeout(() => {
          onStep?.(3);
        }, 1650),
        setTimeout(() => {
          gainB.gain.setTargetAtTime(1, audioCtx.currentTime, 0.01);
          onStep?.(4);
        }, 2500),
        setTimeout(() => {
          stop();
          onComplete?.();
        }, 3700),
      ];

      let stopped = false;
      function stop() {
        if (stopped) return;
        stopped = true;
        timers.forEach(clearTimeout);
        [...oscA, ...oscB].forEach((o) => {
          try { o.stop(); o.disconnect(); } catch (_) {}
        });
        try {
          gainA.disconnect();
          gainB.disconnect();
          master.disconnect();
        } catch (_) {}
      }

      return stop;
    },
  };
}
