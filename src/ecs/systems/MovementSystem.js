import SystemConfig from "../../config/SystemConfig";
import System from "../System";

export default class MovementSystem extends System {
  constructor( positions, velocities ) {
    super( SystemConfig.MovementSystem );
    this.positions = positions;
    this.velocities = velocities;

    this.update = ( deltaTime ) => {
      for ( const [entityId, position] of this.positions.entries ) {
        const velocity = this.velocities.getComponent( entityId );
        if ( velocity ) {
          position.x += velocity.vx * deltaTime;
          position.y += velocity.vy * deltaTime;
        }
      }
    }
  }
}
// export default class MovementSystem extends System {
//   constructor( ) {
//     super( SystemConfig.MovementSystem );

//     this.update = ( deltaTime ) => {
//       for (const [position, velocitiy] of QuerySystem.getComponentsByTypes( this.componentTypes )) {
//         position.x += velocitiy.x * deltaTime;
//         position.y += velocitiy.y * deltaTime;
//         position.z += velocitiy.z * deltaTime;
//       }
//     }
//   }
// }