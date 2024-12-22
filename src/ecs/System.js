export default class System {
  update( deltaTime ) {
    throw new Error( "System#update(deltaTime) must be implemented by a subclass" );
  };
}

export class ThrottledSystem extends System {

  constructor( interval ) {
    super();
    this.interval = interval;
    this.lastUpdate = 0;
  }

  update( deltaTime ) {
    const now = performance.now();
    if ( now - this.lastUpdate >= this.interval ) {
      this.performUpdate( deltaTime );
      this.lastUpdate = now;
    }
  }

  performUpdate() { }
}

