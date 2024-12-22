import CameraControls from "../controls/CameraControls";
import EntityManager from "../managers/EntityManager";
import { WrapperCamera } from "./Camera";
import { WrapperRenderer } from "./Renderer";
import { WrapperScene } from "./Scene";

export class Game {

  constructor( root ) {

    this._camera = new WrapperCamera();
    this._scene = new WrapperScene();
    this._renderer = new WrapperRenderer();
    this._entityManager = EntityManager.getInstance();

    root.appendChild( this._renderer.domElement );
  }

  start() {
    const animate = () => {
      requestAnimationFrame( animate );
      this.update();
      this.render();
    };
    this.init();
    animate();
    this.setupScene();
  }

  init() {
    this.setupCamera();
    this.setupRenderer();
  }

  destroy() {
    this._scene.traverse( ( child ) => {
      this._scene.remove( child );
    } );
  }

  setupCamera() {
    this._cameraControls = new CameraControls( this._camera, this._renderer.domElement );
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._cameraControls.update();
    this._camera.position.z = 5;
    this._camera.lookAt( 0, 0, 0 );
  }

  async setupScene() {

  }

  setupRenderer() {
    this._renderer.setClearColor( 0x000000 );
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    window.addEventListener( "resize", () => {
      this.updateSizes();
    } );
  }

  update() {
    this._cameraControls?.update();
  }

  updateSizes() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
  }

  render() {
    this._renderer.render( this._scene, this._camera );
  }
}
