// Perlin Noise implementation
// Based on the work of Stefan Gustavson and Peter Eastman

class Noise {
    constructor(seed) {
      this.seed(seed || Math.random());
    }
  
    seed(seed = Math.random()) {
      // Linear congruential generator for seeded randomness
      const lcg = (() => {
        const m = 4294967296;
        const a = 1664525;
        const c = 1013904223;
        let s = Math.floor(seed * m);
        return () => {
          s = (a * s + c) % m;
          return s / m;
        };
      })();
  
      this.p = new Uint8Array(512);
      this.perm = new Uint8Array(512);
      this.permMod12 = new Uint8Array(512);
  
      const permutation = new Uint8Array(256);
      for (let i = 0; i < 256; i++) {
        permutation[i] = i;
      }
  
      // Shuffle using the seeded RNG
      for (let i = 255; i > 0; i--) {
        const r = Math.floor(lcg() * (i + 1));
        [permutation[i], permutation[r]] = [permutation[r], permutation[i]];
      }
  
      for (let i = 0; i < 512; i++) {
        this.p[i] = permutation[i & 255];
        this.perm[i] = this.p[i];
        this.permMod12[i] = this.p[i] % 12;
      }
    }
  
    // 2D Perlin Noise
    perlin2(x, y) {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
  
      x -= Math.floor(x);
      y -= Math.floor(y);
  
      const u = this.fade(x);
      const v = this.fade(y);
  
      const A = this.perm[X] + Y;
      const AA = this.perm[A];
      const AB = this.perm[A + 1];
      const B = this.perm[X + 1] + Y;
      const BA = this.perm[B];
      const BB = this.perm[B + 1];
  
      return this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.perm[AA], x, y, 0),
          this.grad(this.perm[BA], x - 1, y, 0)
        ),
        this.lerp(
          u,
          this.grad(this.perm[AB], x, y - 1, 0),
          this.grad(this.perm[BB], x - 1, y - 1, 0)
        )
      );
    }
  
    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
  
    lerp(t, a, b) {
      return a + t * (b - a);
    }
  
    grad(hash, x, y, z) {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
  }
  
  export default Noise;