import SystemConfig from "../../config/SystemConfig";
import System from "../System";

export class RenderingSystem extends System {

  constructor( { Clock, WebGLRenderer, CSS3DRenderer, Scene, Camera, CameraControls } ) {
    super( SystemConfig.RenderingSystem );

    this.webGLRenderer = WebGLRenderer;
    this.cssRenderer = CSS3DRenderer;
    this.cameraControls = CameraControls;

    this.scene = Scene;
    this.camera = Camera;

    this.update = () => {
      this.cameraControls.update( Clock.getDelta() );
      this.webGLRenderer.render( this.scene, this.camera );
      this.cssRenderer.render( this.scene, this.camera );
    }
  }
}
