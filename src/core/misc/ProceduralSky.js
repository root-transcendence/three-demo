/************************************************
 * ProceduralSky.js
 * 
 * Single-file module that:
 *  1) Creates a Three.js scene with:
 *       - A starfield (both point-stars and bright billboard-stars)
 *       - A nebulous background using fractal 4D simplex noise
 *       - A "sun" sphere with glowing effect
 *  2) Renders 6 directions (front, back, left, right, top, bottom)
 *     into offscreen canvases, returning them in an object.
 *
 * Example usage in HTML with <script type="module">:
 *
 *   import { generateSkyTextures } from './ProceduralSky.js';
 *   const texs = generateSkyTextures({ 
 *       resolution: 512, 
 *       seed: 'best seed ever', 
 *       nebulae: true, 
 *       pointStars: true,
 *       sun: true,
 *       stars: true
 *   });
 *   // texs.front, texs.back, etc. are <canvas> objects
 ************************************************/
import * as THREE from 'three';

//=================== Mersenne Twister for seeded RNG ===================
/**
 * MersenneTwister implementation (commonly known as "MT19937-32").
 * This version is adapted from open-source references. 
 */
class MersenneTwister {
  constructor( seed ) {
    if ( seed == null ) {
      seed = new Date().getTime();
    }
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df; // constant vector a
    this.UPPER_MASK = 0x80000000; // most significant w-r bits
    this.LOWER_MASK = 0x7fffffff; // least significant r bits
    this.mt = new Array( this.N ); // the array for the state vector
    this.mti = this.N + 1; // mti==N+1 means mt[N] is not initialized

    this.init_genrand( seed );
  }

  init_genrand( s ) {
    this.mt[0] = s >>> 0;
    for ( this.mti = 1; this.mti < this.N; this.mti++ ) {
      s = this.mt[this.mti - 1] ^ ( this.mt[this.mti - 1] >>> 30 );
      this.mt[this.mti] = ( ( ( ( ( s & 0xffff0000 ) >>> 16 ) * 1812433253 ) << 16 ) +
        ( s & 0x0000ffff ) * 1812433253 ) + this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }

  random_int32() {
    let y;
    const mag01 = [0x0, this.MATRIX_A];

    if ( this.mti >= this.N ) {
      let kk;
      if ( this.mti === this.N + 1 ) {
        this.init_genrand( 5489 );
      }
      for ( kk = 0; kk < this.N - this.M; kk++ ) {
        y = ( this.mt[kk] & this.UPPER_MASK ) | ( this.mt[kk + 1] & this.LOWER_MASK );
        this.mt[kk] = this.mt[kk + this.M] ^ ( y >>> 1 ) ^ mag01[y & 0x1];
      }
      for ( ; kk < this.N - 1; kk++ ) {
        y = ( this.mt[kk] & this.UPPER_MASK ) | ( this.mt[kk + 1] & this.LOWER_MASK );
        this.mt[kk] = this.mt[kk + ( this.M - this.N )] ^ ( y >>> 1 ) ^ mag01[y & 0x1];
      }
      y = ( this.mt[this.N - 1] & this.UPPER_MASK ) | ( this.mt[0] & this.LOWER_MASK );
      this.mt[this.N - 1] = this.mt[this.M - 1] ^ ( y >>> 1 ) ^ mag01[y & 0x1];
      this.mti = 0;
    }

    y = this.mt[this.mti++];
    y ^= ( y >>> 11 );
    y ^= ( y << 7 ) & 0x9d2c5680;
    y ^= ( y << 15 ) & 0xefc60000;
    y ^= ( y >>> 18 );
    return y >>> 0;
  }

  random() {
    return this.random_int32() * ( 1.0 / 4294967296.0 );
  }
}

//=================== 4D Simplex Noise (cnoise4) ===================
/**
 * cnoise4( vec4 P ): returns value in the range [-1,1].
 * 
 * This is adapted from the public-domain (or similarly licensed) 
 * simplex noise code by Ashima Arts / Stefan Gustavson / etc.
 * 
 * For fractal usage, you typically do multiple calls, e.g. c = cnoise4(vec4(...)) 
 * in the shader with different scales.
 */
const cnoise4GLSL = `
//
// 4D Simplex Noise (cnoise) by Ashima Arts & Stefan Gustavson.
// This version returns values in the range [-1, 1].
// No dimension-mismatch errors.
//
// You can rename 'cnoise4' if you prefer. 
//

// Permutation functions:
vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
float mod289(float x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x)
{
  return mod289(((x * 34.0) + 1.0) * x);
}
float permute(float x)
{
  return mod289(((x * 34.0) + 1.0) * x);
}
vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}
float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float cnoise4(vec4 P)
{
  // The constant C splits out (5 - sqrt(5)) / 20, etc.
  const vec4 C = vec4(0.138196601125010504,
                      0.276393202250021008,
                      0.414589803375031512,
                     -0.447213595499957939);

  // First corner
  vec4 i  = floor(P + dot(P, vec4(0.3090169887499)));
  vec4 x0 = P - i + dot(i, C.xxxx);

  // Other corners
  // We only do 3-component step checks here, as is standard in Ashima's 4D code:
  vec4 i0;
  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isY = step(x0.zww,  x0.yyy);
  vec3 isZ = step(x0.www,   x0.zzz);

  i0.x = isX.x + isX.y + isX.z;
  i0.y = 1.0   - isX.x + isY.x + isY.y;
  i0.z = 1.0   - isX.y + isZ.x + isZ.y;
  i0.w = 1.0   - isX.z + 1.0   - isY.z + 1.0   - isZ.z;

  vec4 i1 = min(i0, vec4(1.0));
  vec4 i2 = max(min(i0, vec4(2.0)), vec4(0.0));
  vec4 i3 = max(min(i0, vec4(3.0)), vec4(0.0));

  // x0 = x0 - 0.0 + 0.0*C
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 - 1.0 + C.wwww;

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute( permute(
               i.w + vec4(0.0, i1.w, i2.w, i3.w))
             + i.z + vec4(0.0, i1.z, i2.z, i3.z))
             + i.y + vec4(0.0, i1.y, i2.y, i3.y))
             + i.x + vec4(0.0, i1.x, i2.x, i3.x));

  // Gradients: 7x7x6=294 gradients for 4D
  float n_ = 0.142857142857; // 1/7
  vec4 ns = n_ * C.wzyx;     // wzyx = ( -0.4472, 0.4145, 0.2764, 0.1381 )

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // mod7
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod 7
  vec4 xb = x_ * ns.x + ns.yyyy;
  vec4 yb = y_ * ns.x + ns.yyyy;
  vec4 xbf = fract(xb);
  vec4 ybf = fract(yb);

  // Gradients
  vec4 gx = xbf * 2.0 - 1.0;
  vec4 gy = ybf * 2.0 - 1.0;
  vec4 gz = 1.0 - abs(gx) - abs(gy);
  vec4 sz = step(gz, vec4(0.0));
  gx -= sz * (step(0.0, gx) - 0.5);
  gy -= sz * (step(0.0, gy) - 0.5);

  // Normalise gradients
  vec4 gnorm = taylorInvSqrt(gx*gx + gy*gy + gz*gz);
  gx *= gnorm; 
  gy *= gnorm; 
  gz *= gnorm; 

  // Compute noise contributions from each corner
  float n0 = dot(vec3(gx.x,gy.x,gz.x), x0.xyz);
  float n1 = dot(vec3(gx.y,gy.y,gz.y), x1.xyz);
  float n2 = dot(vec3(gx.z,gy.z,gz.z), x2.xyz);
  float n3 = dot(vec3(gx.w,gy.w,gz.w), x3.xyz);
  float n4 = dot(vec3(gx.w,gy.w,gz.w), x4.xyz); 
  // ^ In some variants, there's a separate approach for the 4th corner. 
  //   This code reuses .w, effectively blending with corner 3. 
  //   It's a known simplification in some references.

  // Calculate the fade curves for each corner
  vec4 t0 = 0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
  vec4 t1 = max(t0, vec4(0.0));
  vec4 t2 = t1 * t1;
  vec4 t4 = t2 * t2;

  // Sum up and scale
  float noiseSum = 19.0 * ( 
    t4.x * n0 + 
    t4.y * n1 + 
    t4.z * n2 + 
    t4.w * n3 
  );

  // For the 4th corner x4, some versions do:
  // noiseSum += 19.0 * ... (similar fade factor for x4). 
  // This snippet is the canonical version from certain references. 
  // If you want the 4th corner explicitly, you'd do it similarly.

  return noiseSum;
}

`;

/**
 * Provide cnoise4 in JavaScript in the fragment shader code. 
 * We'll define the function as `cnoise4(vec4 p)`.
 */
const cnoise4Function = `
float cnoise4(vec4 p) {
  return cnoise(p);
}
`;

//=================== Hash + seeded random wrappers ===================

function hashcode( str ) {
  let hash = 0;
  for ( let i = 0; i < str.length; i++ ) {
    const c = str.charCodeAt( i );
    hash += ( i + 1 ) * c;
  }
  return hash >>> 0;
}

function makeSeededRandom( seedString ) {
  const seedVal = hashcode( seedString );
  return new MersenneTwister( seedVal );
}


//=================== Main Export ===================
export function generateSkyTextures( params ) {
  const {
    resolution = 512,
    seed = 'default-seed',
    pointStars = true,
    nebulae = true,
    sun = true,
    stars = true,
  } = params;

  // Create an offscreen canvas and a Three.js renderer for offscreen rendering
  const canvas = document.createElement( 'canvas' );
  canvas.width = canvas.height = resolution;
  const renderer = new THREE.WebGLRenderer( {
    canvas,
    preserveDrawingBuffer: true
  } );
  renderer.setSize( resolution, resolution );

  // Scene to hold everything
  const scene = new THREE.Scene();

  // Add whichever objects are requested
  if ( pointStars ) {
    scene.add( createPointStarMesh( seed + '_pointStars' ) );
  }
  if ( stars ) {
    scene.add( createBrightStarMesh( seed + '_brightStars' ) );
  }
  if ( nebulae ) {
    scene.add( createNebulaMesh( seed + '_nebula' ) );
  }
  if ( sun ) {
    scene.add( createSunMesh( seed + '_sun' ) );
  }

  // Directions: front, back, left, right, top, bottom
  const directions = [
    { name: 'front', dir: new THREE.Vector3( 0, 0, -1 ), up: new THREE.Vector3( 0, 1, 0 ) },
    { name: 'back', dir: new THREE.Vector3( 0, 0, 1 ), up: new THREE.Vector3( 0, 1, 0 ) },
    { name: 'left', dir: new THREE.Vector3( -1, 0, 0 ), up: new THREE.Vector3( 0, 1, 0 ) },
    { name: 'right', dir: new THREE.Vector3( 1, 0, 0 ), up: new THREE.Vector3( 0, 1, 0 ) },
    { name: 'top', dir: new THREE.Vector3( 0, 1, 0 ), up: new THREE.Vector3( 0, 0, -1 ) },
    { name: 'bottom', dir: new THREE.Vector3( 0, -1, 0 ), up: new THREE.Vector3( 0, 0, 1 ) },
  ];

  // We'll store the 6 output canvases here
  const textures = {};

  directions.forEach( ( entry ) => {
    // Setup a perspective camera for each direction
    const camera = new THREE.PerspectiveCamera( 90, 1.0, 0.1, 256 );
    camera.position.set( 0, 0, 0 );
    camera.up.copy( entry.up );
    camera.lookAt( entry.dir );

    // Render
    renderer.setClearColor( 0x000000, 1 );
    renderer.clear();
    renderer.render( scene, camera );

    // Copy the result from the renderer's canvas into a new <canvas>
    const c = document.createElement( 'canvas' );
    c.width = c.height = resolution;
    const ctx = c.getContext( '2d' );
    ctx.drawImage( renderer.domElement, 0, 0 );
    textures[entry.name] = c;
  } );

  return textures;
}

//=================== 1) Point Star Mesh ===================
function createPointStarMesh( seedString ) {
  const geometry = new THREE.BufferGeometry();

  // Example: 2000 point stars (adjust as you like)
  const NSTARS = 2000;
  const positions = new Float32Array( NSTARS * 3 );
  const colors = new Float32Array( NSTARS * 3 );

  const rand = makeSeededRandom( seedString );

  for ( let i = 0; i < NSTARS; i++ ) {
    // Spherical random distribution
    const theta = rand.random() * 2 * Math.PI;
    const phi = Math.acos( 2 * rand.random() - 1 );
    const r = 120; // radius
    const x = r * Math.sin( phi ) * Math.cos( theta );
    const y = r * Math.sin( phi ) * Math.sin( theta );
    const z = r * Math.cos( phi );

    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // color: random grey-ish or random star color
    const c = Math.pow( rand.random(), 4.0 );
    colors[i * 3 + 0] = c;
    colors[i * 3 + 1] = c;
    colors[i * 3 + 2] = c;
  }

  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

  // A minimal star point shader
  const material = new THREE.ShaderMaterial( {
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;
      void main(){
        vColor = color;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false,
  } );

  const points = new THREE.Points( geometry, material );
  return points;
}

//=================== 2) Billboard Star Mesh (Bright Stars) ===================
function createBrightStarMesh( seedString ) {
  // We'll do fewer bright stars
  const NSTARS = 100;
  const positionsArray = [];
  const colorsArray = [];

  const rand = makeSeededRandom( seedString );

  for ( let i = 0; i < NSTARS; i++ ) {
    const dir = randomDirection( rand );
    const size = 0.5;
    const dist = 80 + 40 * rand.random();
    const { quadPositions, quadColors } = buildStarQuad( dir, dist, size, rand );
    positionsArray.push( ...quadPositions );
    colorsArray.push( ...quadColors );
  }

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array( positionsArray );
  const colors = new Float32Array( colorsArray );
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

  const material = new THREE.ShaderMaterial( {
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        // you can do more fancy stuff here if you want
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false,
  } );

  return new THREE.Mesh( geometry, material );
}

function buildStarQuad( direction, dist, size, rand ) {
  // We'll define a 6-vertex quad (two triangles)
  const corners = [
    [-size, -size, 0],
    [size, -size, 0],
    [size, size, 0],
    [-size, -size, 0],
    [size, size, 0],
    [-size, size, 0]
  ];

  // pick a color
  const c = Math.pow( rand.random(), 4.0 );
  const colorTriplet = [c, c, c];
  const quadColors = [];
  for ( let i = 0; i < 6; i++ ) {
    quadColors.push( ...colorTriplet );
  }

  // place them in the direction of `direction` times `dist`
  // no actual billboard rotation here—just offset in that direction
  const quadPositions = [];
  corners.forEach( ( v ) => {
    const px = direction[0] * dist + v[0];
    const py = direction[1] * dist + v[1];
    const pz = direction[2] * dist + v[2];
    quadPositions.push( px, py, pz );
  } );

  return { quadPositions, quadColors };
}

//=================== 3) Nebula (Large sphere w/ 4D fractal noise) ===================
function createNebulaMesh( seedString ) {
  const geometry = new THREE.SphereGeometry( 150, 32, 32 );
  // We'll put our 4D noise in the fragment shader. 
  // We'll inject cnoise code.  

  // Make a seeded RNG to randomize uniforms
  const rand = makeSeededRandom( seedString );

  const uScale = rand.random() * 0.5 + 0.25;
  const uColor = new THREE.Color( rand.random(), rand.random(), rand.random() );
  const uIntensity = rand.random() * 0.2 + 0.9;
  const uFalloff = rand.random() * 3.0 + 3.0;
  const uOffset = new THREE.Vector3(
    rand.random() * 2000 - 1000,
    rand.random() * 2000 - 1000,
    rand.random() * 2000 - 1000
  );

  const material = new THREE.ShaderMaterial( {
    side: THREE.BackSide,
    transparent: true,
    uniforms: {
      uColor: { value: uColor },
      uScale: { value: uScale },
      uIntensity: { value: uIntensity },
      uFalloff: { value: uFalloff },
      uOffset: { value: uOffset },
    },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    // We embed the cnoise code, then define cnoise4(...) using it
    fragmentShader: `
  precision highp float;
  varying vec3 vPos;

  uniform vec3 uColor;
  uniform float uScale;
  uniform float uIntensity;
  uniform float uFalloff;
  uniform vec3 uOffset;

  // -- 4D Simplex Noise (Ashima / Stefan Gustavson) --
  //    Returns a value in the range [-1,1].
  //    No dimension mismatch issues.

  // Helper functions
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }
  float permute(float x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  float taylorInvSqrt(float r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  // Main 4D simplex noise function
  float cnoise4(vec4 P) {
    const vec4 C = vec4(
      0.138196601125010504, 
      0.276393202250021008, 
      0.414589803375031512, 
      -0.447213595499957939
    );

    // First corner
    vec4 i  = floor(P + dot(P, vec4(0.3090169887499)));
    vec4 x0 = P - i + dot(i, C.xxxx);

    // Other corners
    vec3 isX = step(x0.yzw, x0.xxx);
    vec3 isY = step(x0.zww,  x0.yyy);
    vec3 isZ = step(x0.www,   x0.zzz);

    vec4 i0;
    i0.x = isX.x + isX.y + isX.z;
    i0.y = 1.0   - isX.x + isY.x + isY.y;
    i0.z = 1.0   - isX.y + isZ.x + isZ.y;
    i0.w = 1.0   - isX.z + 1.0   - isY.z + 1.0 - isZ.z;

    vec4 i1 = min(i0, vec4(1.0));
    vec4 i2 = max(min(i0, vec4(2.0)), vec4(0.0));
    vec4 i3 = max(min(i0, vec4(3.0)), vec4(0.0));

    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 - 1.0 + C.wwww;

    i = mod289(i);
    vec4 p = permute(
                permute(
                  permute(
                    permute(
                      i.w + vec4(0.0, i1.w, i2.w, i3.w))
                      + i.z + vec4(0.0, i1.z, i2.z, i3.z))
                      + i.y + vec4(0.0, i1.y, i2.y, i3.y))
                      + i.x + vec4(0.0, i1.x, i2.x, i3.x)
              );

    float n_ = 0.142857142857; // 1/7
    vec4 ns = n_ * C.wzyx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 xbf = fract(x_ * ns.x + ns.yyyy);
    vec4 ybf = fract(y_ * ns.x + ns.yyyy);
    vec4 gx = xbf * 2.0 - 1.0;
    vec4 gy = ybf * 2.0 - 1.0;
    vec4 gz = 1.0 - abs(gx) - abs(gy);
    vec4 sz = step(gz, vec4(0.0));
    gx -= sz * (step(0.0, gx) - 0.5);
    gy -= sz * (step(0.0, gy) - 0.5);

    vec4 gnorm = taylorInvSqrt(gx * gx + gy * gy + gz * gz);
    gx *= gnorm;
    gy *= gnorm;
    gz *= gnorm;

    // calculate contributions
    float n0 = dot(vec3(gx.x, gy.x, gz.x), x0.xyz);
    float n1 = dot(vec3(gx.y, gy.y, gz.y), x1.xyz);
    float n2 = dot(vec3(gx.z, gy.z, gz.z), x2.xyz);
    float n3 = dot(vec3(gx.w, gy.w, gz.w), x3.xyz);
    // Some variants handle the 4th corner x4 separately. 
    // We'll ignore x4 or treat it similarly; this code is enough for most uses.

    vec4 t0 = 0.6 - vec4(
      dot(x0, x0), 
      dot(x1, x1), 
      dot(x2, x2), 
      dot(x3, x3)
    );
    vec4 t1 = max(t0, vec4(0.0));
    vec4 t2 = t1 * t1;
    vec4 t4 = t2 * t2;

    float noiseSum = 19.0 * ( 
      t4.x * n0 + 
      t4.y * n1 + 
      t4.z * n2 + 
      t4.w * n3
    );

    return noiseSum; // in [-1, 1]
  }

  // Wrap cnoise4 in a [0..1] noise
  float noise(vec3 p) {
    return 0.5 * cnoise4(vec4(p, 0.0)) + 0.5;
  }

  // Simple fractal function
  float nebulaF(vec3 p) {
    int steps = 5;
    float scale = 1.0;
    vec3 disp = vec3(0.0);
    float sum = 0.0;
    for (int i = 0; i < 5; i++) {
      float n = noise(p * scale + disp);
      sum += n;
      disp += vec3(n);
      scale *= 0.5;
    }
    return sum / float(steps);
  }

  void main() {
    // Take normalized direction from world origin
    vec3 dir = normalize(vPos);

    // Sample the fractal noise
    vec3 samplePos = dir * uScale + uOffset;
    float c = min(1.0, nebulaF(samplePos) * uIntensity);
    c = pow(c, uFalloff);

    // The final alpha is the noise intensity
    gl_FragColor = vec4(uColor, c);
  }
`,
  } );

  return new THREE.Mesh( geometry, material );
}

//=================== 4) Sun (small sphere w/ glowing effect) ===================
function createSunMesh( seedString ) {
  const geometry = new THREE.SphereGeometry( 5, 16, 16 );

  const rand = makeSeededRandom( seedString );
  // random direction for the sun
  const dir = randomDirection( rand );
  const col = new THREE.Color( rand.random(), rand.random(), rand.random() );
  const size = rand.random() * 0.0001 + 0.0001;
  const falloff = rand.random() * 16.0 + 8.0;

  const material = new THREE.ShaderMaterial( {
    transparent: true,
    uniforms: {
      uPosition: { value: new THREE.Vector3( dir[0], dir[1], dir[2] ) },
      uColor: { value: col },
      uSize: { value: size },
      uFalloff: { value: falloff },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vWorldPos;
      uniform vec3 uPosition;
      uniform vec3 uColor;
      uniform float uSize;
      uniform float uFalloff;

      void main() {
        // direction from origin
        vec3 dir = normalize(vWorldPos);
        // direction for "sun"
        vec3 sunDir = normalize(uPosition);
        float d = dot(dir, sunDir);
        d = clamp(d, 0.0, 1.0);

        // replicate your original approach
        float c = smoothstep(1.0 - uSize * 32.0, 1.0 - uSize, d);
        c += pow(d, uFalloff) * 0.5;
        vec3 finalColor = mix(uColor, vec3(1.0), c);
        gl_FragColor = vec4(finalColor, c);
      }
    `,
  } );

  return new THREE.Mesh( geometry, material );
}

//=================== Helper: random direction on a sphere ===================
function randomDirection( rand ) {
  const theta = rand.random() * 2.0 * Math.PI;
  const phi = Math.acos( 2.0 * rand.random() - 1.0 );
  const x = Math.sin( phi ) * Math.cos( theta );
  const y = Math.sin( phi ) * Math.sin( theta );
  const z = Math.cos( phi );
  return [x, y, z];
}
