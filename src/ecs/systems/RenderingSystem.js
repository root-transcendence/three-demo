export class RenderingSystem extends System {
  constructor( webGLRenderer, cssRenderer, scene, camera ) {
    super();
    this.webGLRenderer = webGLRenderer;
    this.cssRenderer = cssRenderer;
    this.scene = scene;
    this.camera = camera;
  }

  update() {
    this.webGLRenderer.render( this.scene, this.camera );
    this.cssRenderer.render( this.scene, this.camera );
  }
}
