export default class System {

  constructor( config ) {
    this.order = config.order;
    this.interval = config.interval;
    this.lastUpdate = 0;
    this.componentTypes = config.componentTypes;
  }

  set update( fn ) {
    this._update = fn;
  }

  get update() {
    return this.performUpdate.bind( this );
  }

  performUpdate() {
    const now = performance.now();
    if ( now - this.lastUpdate >= this.interval ) {
      this._update( this.interval );
      this.lastUpdate = now;
    }
  }
}

