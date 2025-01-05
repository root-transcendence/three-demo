import SystemConfig from "../../config/SystemConfig";
import System from "../System";

export class RenderingSystem extends System {

  constructor( engine ) {
    super( SystemConfig.RenderingSystem );

    this.engine = engine;
    this.three = engine.three;

    this.update = () => {
      this.three.CameraControls.update( this.three.Clock.getDelta() );
      this.three.WebGLRenderer.render( this.three.Scene, this.three.Camera );
      this.three.CSS3DRenderer.render( this.three.Scene, this.three.Camera );
    }
  }
}
