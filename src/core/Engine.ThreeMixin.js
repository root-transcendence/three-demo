import { AmbientLight, Clock, WebGLRenderer } from "three";
import { CSS3DRenderer } from "three/examples/jsm/Addons.js";
import { CameraControls } from "../controls/CameraControls";
import { WrapperCamera } from "./Camera";
import { WrapperScene } from "./Scene";

export const ThreeMixin = {

  initThree() {
    this.three = {
      Clock: new Clock( true ),
      WebGLRenderer: null,
      CSS3DRenderer: null,
      Scene: null,
      Camera: null,
      CameraControls: null
    };
  },

  setupThree() {
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();

    window.addEventListener( "resize", this.updateSizes.bind( this ) );
    window.addEventListener( "DOMContentLoaded", this.updateSizes.bind( this ), { once: true } );
  },

  updateSizes() {
    const { width, height } = this.element.getBoundingClientRect();
    const { WebGLRenderer, CSS3DRenderer, Camera } = this.three;

    Camera.aspect = width / height;
    Camera.updateProjectionMatrix();

    WebGLRenderer.setSize( width, height );
    CSS3DRenderer.setSize( width, height );

    WebGLRenderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
  },

  setupRenderer() {
    const webglRenderer = new WebGLRenderer( { powerPreference: "high-performance" } );
    const cssRenderer = new CSS3DRenderer();

    this.three.WebGLRenderer = webglRenderer;
    this.three.CSS3DRenderer = cssRenderer;

    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.zIndex = 1;
    cssRenderer.domElement.style.pointerEvents = "none";

    webglRenderer.setClearColor( 0x000000 );

    this.element.appendChild( webglRenderer.domElement );
    this.element.appendChild( cssRenderer.domElement );
  },

  setupCamera() {
    const { WebGLRenderer } = this.three;
    const camera = new WrapperCamera();
    const cameraControls = new CameraControls( camera, WebGLRenderer.domElement );

    this.three.Camera = camera;
    this.three.CameraControls = cameraControls;


    cameraControls.enabled = true;
    cameraControls.autoForward = false;
    cameraControls.dragToLook = true;
    cameraControls.movementSpeed = 100;
    cameraControls.domElement = WebGLRenderer.domElement;
    cameraControls.rollSpeed = Math.PI / 6;
    camera.position.z = 500;
    camera.lookAt( 0, 0, 0 );
  },

  setupScene() {
    const { Camera } = this.three;
    const scene = new WrapperScene();

    this.three.Scene = scene;

    scene.add( Camera );

    const ambientLight = new AmbientLight( 0xffffff, 1 );

    scene.add( ambientLight );
  },
}
