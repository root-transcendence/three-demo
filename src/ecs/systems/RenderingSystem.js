import SystemConfig from "../../config/SystemConfig";
import System from "../System";

export class RenderingSystem extends System {

  constructor( { WebGLRenderer, CSS3DRenderer, Scene, Camera } ) {
    super( SystemConfig.RenderingSystem );

    this.webGLRenderer = WebGLRenderer;
    this.cssRenderer = CSS3DRenderer;

    this.scene = Scene;
    this.camera = Camera;

    this.update = () => {
      this.webGLRenderer.render( this.scene, this.camera );
      this.cssRenderer.render( this.scene, this.camera );
    }
  }
}
