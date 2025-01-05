import SystemConfig from "../../config/SystemConfig";
import Engine from "../../core/Engine";
import System from "../System";

export class SynchronizationSystem extends System {
  /**
   * 
   * @param {Engine} engine 
   */
  constructor( engine ) {
    super( SystemConfig.SynchronizationSystem );
    this.engine = engine;
    this.update = ( serverState ) => {
      if ( !serverState ) {
        return;
      }

      for ( const entity of Object.keys( serverState ) ) {
        const state = serverState[entity];
        const position = this.positionManager.getComponent( parseInt( entity ) );
        const velocity = this.velocityManager.getComponent( parseInt( entity ) );

        if ( position ) {
          position.x = state.position.x;
          position.y = state.position.y;
          position.z = state.position.z;
        }

        if ( velocity ) {
          velocity.vx = state.velocity.vx;
          velocity.vy = state.velocity.vy;
          velocity.vz = state.velocity.vz;
        }
      }
    }
  }
}