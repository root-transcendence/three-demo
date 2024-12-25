import { AmbientLight, Mesh, MeshBasicMaterial, PointLight, SphereGeometry, WebGLRenderer } from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/Addons.js";
import CameraControls from "../controls/CameraControls";
import ComponentManager from "../ecs/managers/ComponentManager";
import { EntityManager } from "../ecs/managers/EntityManager";
import { MenuManager } from "../ecs/managers/MenuManager";
import MovementSystem from "../ecs/systems/MovementSystem";
import { SynchronizationSystem } from "../ecs/systems/SyncronizationSystem";
import { UISystem } from "../ecs/systems/UISystem";
import { WrapperCamera } from "./Camera";
import { WrapperScene } from "./Scene";

//UI Components
import LoginRegisterComponent from "../UIComponents/LoginRegisterComponent";

export class Game {

  constructor( root ) {

    this._root = root;

    this.entityManager = new EntityManager();

    this.positions = new ComponentManager();
    this.velocities = new ComponentManager();
    this.uiComponents = new ComponentManager();
    this.assetComponents = new ComponentManager();

    this.menuManager = new MenuManager();

    this.systems = new Map();

    this.systems.set( "UISystem", new UISystem( this.menuManager ) );
    this.systems.set( "MovementSystem", new MovementSystem( this.positions, this.velocities ) );
    this.systems.set( "SynchronizationSystem", new SynchronizationSystem( this.positions, this.velocities, this.assetComponents ) );
  }

  start() {
    const animate = () => {
      requestAnimationFrame( animate );
      this.update();
      this.render();
    };

    this.init();
    animate();
  }

  init() {
    this._camera = new WrapperCamera();
    this._scene = new WrapperScene();

    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
  }

  destroy() {
    this._scene.traverse( ( child ) => {
      this._scene.remove( child );
    } );
  }

  setupCamera() {
    const { width, height } = this._root.getBoundingClientRect();
    this._cameraControls = new CameraControls( this._camera, this._webglRenderer.domElement );
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._cameraControls.update();
    this._camera.position.z = 500;
    this._camera.lookAt( 0, 0, 0 );
  }

  async setupScene() {
    this._scene.add(new CSS3DObject(LoginRegisterComponent().render()));

    const light = new PointLight( 0xffffff, 1 );
    light.position.set( 10, 10, 10 );
    this._scene.add( light );

    const ambientLight = new AmbientLight( 0xffffff, 1 );
    this._scene.add( ambientLight );

    //const sphere = new Mesh(
    //  new SphereGeometry( 8, 16, 16 ),
    //  new MeshBasicMaterial( { color: 0xff0000 } )
    //);
    //sphere.position.set( 0, 0, 0 );
    //this._scene.add( sphere );
  }

  setupRenderer() {
    const { width, height } = this._root.getBoundingClientRect();

    this._webglRenderer = new WebGLRenderer();
    this._cssRenderer = new CSS3DRenderer();

    this._cssRenderer.domElement.style.position = "absolute";
    this._cssRenderer.domElement.style.zIndex = 1;
    this._cssRenderer.domElement.style.pointerEvents = "none";

    this._webglRenderer.setSize( width, height );
    this._cssRenderer.setSize( width, height );

    this._webglRenderer.setSize( window.innerWidth, window.innerHeight );
    this._webglRenderer.setClearColor( 0x000000 );

    this._root.appendChild( this._webglRenderer.domElement );
    this._root.appendChild( this._cssRenderer.domElement );

    window.addEventListener( "resize", this.updateSizes.bind( this ) );
  }

  update() {
    this._cameraControls?.update();
    this.systems.forEach( ( system ) => system.update() );
  }

  updateSizes() {
    const { width, height } = this._root.getBoundingClientRect();
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();

    this._webglRenderer.setSize( width, height );
    this._webglRenderer.setPixelRatio( Math.min( this._root.devicePixelRatio, 2 ) );

    this._cssRenderer.setSize( width, height );
  }

  render() {
    this._webglRenderer.render( this._scene, this._camera );
    this._cssRenderer.render( this._scene, this._camera );
  }
}
