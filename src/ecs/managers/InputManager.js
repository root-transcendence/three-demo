export class InputManager {
  constructor() {
    this.callbacks = new Map();
  }

  on( event, callback ) {
    this.callbacks.set( event, callback );
  }

  trigger( event ) {
    const callback = this.callbacks.get( event );
    if ( callback ) callback();
  }
}