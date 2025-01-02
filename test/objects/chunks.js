import { BoxGeometry, BoxHelper, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { applyOrbitalMechanics, createBlendedBlackHole } from "./blackhole";
import { createStarfield } from "./stars";

const chunkHelpers = {};
export const visibleChunks = {};
export const blackHoles = [];
const CHUNK_SIZE = 1000;
const RENDER_DISTANCE = 5;
const BLACKHOLE_DISTRIBUTION = 50;

const chunkHelperProperties = {
  geometry: new BoxGeometry( CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE ),
  material: new MeshBasicMaterial( { color: 0xff0000, wireframe: true } ),
}

function createChunkHelper( chunkX, chunkY, chunkZ, chunkSize ) {
  const mesh = new Mesh( chunkHelperProperties.geometry, chunkHelperProperties.material );

  mesh.position.set(
    chunkX * chunkSize + chunkSize / 2,
    chunkY * chunkSize + chunkSize / 2,
    chunkZ * chunkSize + chunkSize / 2
  );

  return new BoxHelper( mesh, 0x00ff00 );
}

// function createGalaxy(position) {
//   const blackHole = createMassiveBlackHole(position);

//   const galaxy = generateGalaxyStars(blackHole);

//   const galaxyGroup = new THREE.Group();
//   galaxyGroup.add(blackHole);
//   galaxyGroup.add(galaxy);

//   return galaxyGroup;
// }


function generateBlackHolesForChunks( chunkX, chunkY, chunkZ, scene ) {
  const ownerChunkX = Math.floor( chunkX / BLACKHOLE_DISTRIBUTION ) * BLACKHOLE_DISTRIBUTION;
  const ownerChunkY = Math.floor( chunkY / BLACKHOLE_DISTRIBUTION ) * BLACKHOLE_DISTRIBUTION;
  const ownerChunkZ = Math.floor( chunkZ / BLACKHOLE_DISTRIBUTION ) * BLACKHOLE_DISTRIBUTION;

  const key = `${ownerChunkX},${ownerChunkY},${ownerChunkZ}`;

  if ( !blackHoles[key] ) {
    const position = new Vector3(
      ownerChunkX * CHUNK_SIZE + Math.random() * CHUNK_SIZE * BLACKHOLE_DISTRIBUTION,
      ownerChunkY * CHUNK_SIZE + Math.random() * CHUNK_SIZE * BLACKHOLE_DISTRIBUTION,
      ownerChunkZ * CHUNK_SIZE + Math.random() * CHUNK_SIZE * BLACKHOLE_DISTRIBUTION
    );
    const blackHole = createBlendedBlackHole( position, 200 );
    blackHoles[key] = blackHole;
    scene.add( blackHole );
  }
}

function getChunksAffectedByBlackHole( blackHole ) {
  return Object.values( visibleChunks ).filter( ( chunk ) => {
    const chunkCenter = new Vector3(
      chunk.x * CHUNK_SIZE + CHUNK_SIZE / 2,
      chunk.y * CHUNK_SIZE + CHUNK_SIZE / 2,
      chunk.z * CHUNK_SIZE + CHUNK_SIZE / 2
    );

    const distance = chunkCenter.distanceTo( blackHole.position );
    return distance < blackHole.influenceRadius;
  } );
}


export function updateVisibleChunks( camera, renderer, scene, clock, composer ) {
  const cameraPosition = camera.position;
  const chunkX = Math.floor( cameraPosition.x / CHUNK_SIZE );
  const chunkY = Math.floor( cameraPosition.y / CHUNK_SIZE );
  const chunkZ = Math.floor( cameraPosition.z / CHUNK_SIZE );

  for ( let cx = chunkX - RENDER_DISTANCE; cx <= chunkX + RENDER_DISTANCE; cx++ ) {
    for ( let cy = chunkY - RENDER_DISTANCE; cy <= chunkY + RENDER_DISTANCE; cy++ ) {
      for ( let cz = chunkZ - RENDER_DISTANCE; cz <= chunkZ + RENDER_DISTANCE; cz++ ) {
        const chunkKey = `${cx},${cy},${cz}`;
        if ( !visibleChunks[chunkKey] ) {

          const starfield = createStarfield( cx, cy, cz );
          visibleChunks[chunkKey] = { starfield, x: cx, y: cy, z: cz };
          scene.add( starfield );

          generateBlackHolesForChunks( cx, cy, cz, scene );

          // const helper = createChunkHelper( cx, cy, cz, CHUNK_SIZE );
          // chunkHelpers[chunkKey] = helper;
          // scene.add( helper );
        }
      }
    }
  }

  Object.values( blackHoles ).forEach( ( blackHole ) => {
    const affectedChunks = getChunksAffectedByBlackHole( blackHole );
    affectedChunks.forEach( ( chunk ) => {
      const delta = clock.getDelta();

      blackHole.accretionDiskMaterial.uniforms.time.value += delta;

      applyOrbitalMechanics( blackHole, chunk.starfield.geometry.attributes.position.array, delta );

      chunk.starfield.geometry.attributes.position.needsUpdate = true;

      // const lensPass = composer.passes[1];

      // updateBlackHoleCenter( blackHole, camera, renderer, lensPass );
    } );
  } );

  for ( const key in visibleChunks ) {
    const [x, y, z] = key.split( ',' ).map( Number );
    if (
      Math.abs( x - chunkX ) > RENDER_DISTANCE ||
      Math.abs( y - chunkY ) > RENDER_DISTANCE ||
      Math.abs( z - chunkZ ) > RENDER_DISTANCE
    ) {

      // Remove starfield
      scene.remove( visibleChunks[key].starfield );
      delete visibleChunks[key].starfield;

      // Remove chunk
      delete visibleChunks[key];

      // Remove chunk helper (optional for debugging)
      scene.remove( chunkHelpers[key] );
      delete chunkHelpers[key];
    }
  }
}
