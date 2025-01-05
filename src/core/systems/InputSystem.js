import System from "../System";

class InputSystem extends System {
  constructor( inputManager ) {
    super();
    this.inputManager = inputManager;
  }

  update() {
    const input = this.inputManager.getInput();
    if ( input ) {
      console.log( input );
    }
  }
}

export default InputSystem;