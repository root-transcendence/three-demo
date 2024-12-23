import System from "../System";

export default class MovementSystem extends System {
  constructor( positions, velocities ) {
    super();
    this.positions = positions;
    this.velocities = velocities;
  }

  update( deltaTime ) {
    for ( const [entityId, position] of this.positions.entries ) {
      const velocity = this.velocities.getComponent( entityId );
      if ( velocity ) {
        position.x += velocity.vx * deltaTime;
        position.y += velocity.vy * deltaTime;
      }
    }
  }
}