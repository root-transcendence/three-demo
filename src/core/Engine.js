import { AmbientLight, WebGLRenderer } from "three";
import { CSS3DRenderer } from "three/examples/jsm/Addons.js";
import CameraControls from "../controls/CameraControls";
import ComponentManager from "../ecs/managers/ComponentManager";
import { EntityManager } from "../ecs/managers/EntityManager";
import { MenuManager } from "../ecs/managers/MenuManager";
import MovementSystem from "../ecs/systems/MovementSystem";
import { RenderingSystem } from "../ecs/systems/RenderingSystem";
import { SynchronizationSystem } from "../ecs/systems/SyncronizationSystem";
import { UISystem } from "../ecs/systems/UISystem";
import { WrapperCamera } from "./Camera";
import { WrapperScene } from "./Scene";

export default class Engine {

  constructor( engineConfig ) {
    this.element = engineConfig.element;
  }

  march() {
    const animate = () => {
      requestAnimationFrame( animate );
      this.update();
    };

    animate();
  }

  update() {
    Object.values( this.systems )
      .sort( ( a, b ) => a.order - b.order )
      .forEach( ( system ) => system.update() );
  }


  setup() {
    this.three = {};
    this.setupRenderer();
    this.setupCamera();
    this.setupScene();
    this.setupManagers();
    this.setupSystems();
  }

  setupRenderer() {
    const { width, height } = this.element.getBoundingClientRect();

    const webglRenderer = new WebGLRenderer( { powerPreference: "high-performance" } );
    const cssRenderer = new CSS3DRenderer();

    this.three.WebGLRenderer = webglRenderer;
    this.three.CSS3DRenderer = cssRenderer;

    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.zIndex = 1;
    cssRenderer.domElement.style.pointerEvents = "none";

    webglRenderer.setSize( width, height );
    cssRenderer.setSize( width, height );

    webglRenderer.setSize( width, height );
    webglRenderer.setClearColor( 0x000000 );

    this.element.appendChild( webglRenderer.domElement );
    this.element.appendChild( cssRenderer.domElement );

    window.addEventListener( "resize", this._updateSizes.bind( this ) );
  }

  setupCamera() {
    const { WebGLRenderer } = this.three;
    const camera = new WrapperCamera();
    const cameraControls = new CameraControls( camera, WebGLRenderer.domElement );

    this.three.Camera = camera;
    this.three.CameraControls = cameraControls;

    const { width, height } = this.element.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cameraControls.update();
    camera.position.z = 500;
    camera.lookAt( 0, 0, 0 );
  }

  setupScene() {
    const { Camera } = this.three;
    const scene = new WrapperScene();

    this.three.Scene = scene;

    scene.add( Camera );

    const ambientLight = new AmbientLight( 0xffffff, 1 );

    scene.add( ambientLight );
  }

  setupManagers() {
    this.managers = {
      EntityManager: new EntityManager(),
      MenuManager: new MenuManager( this.three.Scene ),
      PositionManager: new ComponentManager( "PositionComponent" ),
      VelocityManager: new ComponentManager( "VelocityComponent" ),
      AssetManager: new ComponentManager( "AssetComponent" ),
    };
    // Object.values( this.managers )
    //   .filter( manager => manager instanceof ComponentManager )
    //   .forEach( QuerySystem.registerComponentManager );
  }

  setupSystems() {
    this.systems = {
      // QuerySystem: new QuerySystem( this.managers );
      UISystem: new UISystem( this.managers.MenuManager ),
      MovementSystem: new MovementSystem( this.managers.PositionManager, this.managers.VelocityManager ),
      RenderingSystem: new RenderingSystem( this.three ),
      SynchronizationSystem: new SynchronizationSystem( this.managers.PositionManager, this.managers.VelocityManager, this.managers.AssetManager ),
    }
  }

  _updateSizes() {
    const { width, height } = this.element.getBoundingClientRect();
    const { WebGLRenderer, CSS3DRenderer, Camera } = this.three;

    Camera.aspect = width / height;
    Camera.updateProjectionMatrix();

    WebGLRenderer.setSize( width, height );
    WebGLRenderer.setPixelRatio( Math.min( this.element.devicePixelRatio, 2 ) );

    CSS3DRenderer.setSize( width, height );
  }
}