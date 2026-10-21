// Ambient interface sound, synthesised with Web Audio — no audio files.
// Off by default; the drone, purr, sistrum-like chimes and whoosh all route
// through one master gain so muting is instant.

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export class Sound {
  on = false;
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private send!: GainNode;
  private lp!: BiquadFilterNode;
  private purrG!: GainNode;
  private noise!: AudioBuffer;
  private nodes: AudioScheduledSourceNode[] = [];

  private init() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    const c = (this.ctx = new AC());
    const comp = c.createDynamicsCompressor();
    comp.connect(c.destination);
    this.master = c.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);

    const len = c.sampleRate * 2.2;
    const ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    const verb = c.createConvolver();
    verb.buffer = ir;
    this.send = c.createGain();
    this.send.gain.value = 0.32;
    this.send.connect(verb);
    verb.connect(this.master);

    this.lp = c.createBiquadFilter();
    this.lp.type = "lowpass";
    this.lp.frequency.value = 170;
    this.lp.Q.value = 0.8;
    const dg = c.createGain();
    dg.gain.value = 0.045;
    this.lp.connect(dg);
    dg.connect(this.master);
    dg.connect(this.send);
    [55, 55.35, 82.6].forEach((f, i) => {
      const o = c.createOscillator();
      o.type = i === 2 ? "triangle" : "sawtooth";
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.value = i === 2 ? 0.5 : 0.32;
      o.connect(g);
      g.connect(this.lp);
      o.start();
      this.nodes.push(o);
    });

    const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noise = nb;
    const ns = c.createBufferSource();
    ns.buffer = nb;
    ns.loop = true;
    const plp = c.createBiquadFilter();
    plp.type = "lowpass";
    plp.frequency.value = 110;
    const am = c.createGain();
    am.gain.value = 0.5;
    const lfo = c.createOscillator();
    lfo.frequency.value = 24;
    const lg = c.createGain();
    lg.gain.value = 0.5;
    lfo.connect(lg);
    lg.connect(am.gain);
    lfo.start();
    this.purrG = c.createGain();
    this.purrG.gain.value = 0;
    ns.connect(plp);
    plp.connect(am);
    am.connect(this.purrG);
    this.purrG.connect(this.master);
    ns.start();
    this.nodes.push(ns, lfo);
    return true;
  }

  async toggle() {
    if (!this.ctx && !this.init()) return false;
    const c = this.ctx!;
    if (c.state === "suspended") await c.resume();
    this.on = !this.on;
    this.master.gain.setTargetAtTime(this.on ? 0.9 : 0, c.currentTime, 0.25);
    return this.on;
  }

  purr(v: number) {
    if (this.ctx) this.purrG.gain.setTargetAtTime(v * 0.4, this.ctx.currentTime, 0.35);
  }

  scroll(v: number) {
    if (this.ctx) this.lp.frequency.setTargetAtTime(150 + Math.min(900, v * 0.35), this.ctx.currentTime, 0.2);
  }

  chime(x = 0.5, pitch = 1, vol = 1) {
    if (!this.on || !this.ctx) return;
    const c = this.ctx;
    const t = c.currentTime;
    const f = 1750 * pitch * (0.97 + Math.random() * 0.06);
    const out = c.createGain();
    out.gain.value = vol;
    const pan = c.createStereoPanner();
    pan.pan.value = clamp((x - 0.5) * 1.4, -1, 1);
    out.connect(pan);
    pan.connect(this.master);
    pan.connect(this.send);
    [1, 2.76, 5.4, 8.93].forEach((r, i) => {
      const o = c.createOscillator();
      o.frequency.value = f * r;
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.045 / (i + 1), t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55 / (i * 0.7 + 1));
      o.connect(g);
      g.connect(out);
      o.start(t);
      o.stop(t + 0.7);
    });
  }

  tick() {
    this.chime(0.5, 1.5, 0.35);
  }

  whoosh() {
    if (!this.on || !this.ctx) return;
    const c = this.ctx;
    const t = c.currentTime;
    const s = c.createBufferSource();
    s.buffer = this.noise;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(260, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.9);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.35);
    g.gain.linearRampToValueAtTime(0, t + 1.05);
    s.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    g.connect(this.send);
    s.start(t);
    s.stop(t + 1.1);
  }

  dispose() {
    this.nodes.forEach((n) => {
      try {
        n.stop();
      } catch {}
    });
    this.ctx?.close();
    this.ctx = null;
  }
}
