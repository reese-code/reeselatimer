// Perlin Noise implementation
// Based on the work of Stefan Gustavson and Peter Eastman

class Noise {
  constructor(seed) {
    this.seed(seed || 0);
  }

  seed(seed) {
    // Establish the permutation array
    this.p = new Uint8Array(512);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);

    const permutation = new Uint8Array(256);
    
    // Initialize with values 0-255
    for (let i = 0; i < 256; i++) {
      permutation[i] = i;
    }

    // Shuffle the array
    let random;
    if (seed === undefined) seed = Math.random();
    for (let i = 0; i < 255; i++) {
      random = (seed * 256) % (256 - i);
      const k = permutation[i + random];
      permutation[i + random] = permutation[i];
      permutation[i] = k;
    }

    // Copy to p, doubling the array
    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
      this.perm[i] = this.p[i];
      this.permMod12[i] = this.p[i] % 12;
    }
  }

  // 2D Perlin Noise
  perlin2(x, y) {
    // Find unit grid cell containing point
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    // Get relative xy coordinates of point within that cell
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    // Compute fade curves for each of x, y
    const u = this.fade(x);
    const v = this.fade(y);
    
    // Hash coordinates of the 4 square corners
    const A = this.perm[X] + Y;
    const AA = this.perm[A];
    const AB = this.perm[A + 1];
    const B = this.perm[X + 1] + Y;
    const BA = this.perm[B];
    const BB = this.perm[B + 1];
    
    // Add blended results from 4 corners of square
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

  // Fade function as defined by Ken Perlin
  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  // Linear interpolation
  lerp(t, a, b) {
    return a + t * (b - a);
  }

  // Gradient function
  grad(hash, x, y, z) {
    // Convert low 4 bits of hash code into 12 gradient directions
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
}

export default Noise;
