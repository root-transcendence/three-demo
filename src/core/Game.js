import { AmbientLight, AxesHelper, Mesh, MeshBasicMaterial, PointLight, SphereGeometry, WebGLRenderer } from "three";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/Addons.js";
import CameraControls from "../controls/CameraControls";
import { ButtonComponent, TextComponent } from "../ecs/components/Type.Component";
import ComponentManager from "../ecs/managers/ComponentManager";
import { EntityManager } from "../ecs/managers/EntityManager";
import { MenuManager } from "../ecs/managers/MenuManager";
import MovementSystem from "../ecs/systems/MovementSystem";
import { SynchronizationSystem } from "../ecs/systems/SyncronizationSystem";
import { UISystem } from "../ecs/systems/UISystem";
import { WrapperCamera } from "./Camera";
import { WrapperScene } from "./Scene";

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

  deneme() {
    const buttonProps = {
      label: "Edit Profile",
      styles: {
        color: "red",
        backgroundColor: "yellow",
        padding: "10px",
        margin: "5px",
        cursor: "pointer",
      },
    };

    const textProps = {
      text: "John Doe",
      styles: {
        color: "blue",
        backgroundColor: "green",
        padding: "10px",
        margin: "5px",
      },
    };

    const btn1 = new ButtonComponent( "Edit Profile", buttonProps );
    const text1 = new TextComponent( "Profile Name", textProps );
    const btn2 = new ButtonComponent( "Log Out", buttonProps );

    // Create a menu container for CSS3DObject
    const menuContainer = document.createElement( "div" );
    menuContainer.style.display = "flex";
    menuContainer.style.flexDirection = "column";
    menuContainer.style.alignItems = "center";
    menuContainer.style.justifyContent = "center";
    menuContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    menuContainer.style.padding = "20px";
    menuContainer.style.borderRadius = "10px";
    menuContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

    // Add button and text elements
    [btn1, text1, btn2].forEach( ( component ) => {
      const element = document.createElement( "div" );
      Object.assign( element.style, component.styles );
      element.textContent = component.text || component.label;
      menuContainer.appendChild( element );

      // Add event listeners if defined
      if ( component.expectedListeners?.click ) {
        element.addEventListener( "click", component.expectedListeners.click );
      }
    } );
    const axesHelper = new AxesHelper( 5 );
    this._scene.add( axesHelper );

    // Create CSS3DObject and add to scene
    const menuObject = new CSS3DObject( menuContainer );
    menuObject.position.set( 0, 0, -2 ); // Place it slightly in front of the camera
    this._scene.add( menuObject );
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
    this._camera.position.z = 5;
    this._camera.lookAt( 0, 0, 0 );
  }

  async setupScene() {
    this.deneme();

    const light = new PointLight( 0xffffff, 1 );
    light.position.set( 10, 10, 10 );
    this._scene.add( light );

    const ambientLight = new AmbientLight( 0xffffff, 1 );
    this._scene.add( ambientLight );

    const sphere = new Mesh(
      new SphereGeometry( 1, 16, 16 ),
      new MeshBasicMaterial( { color: 0xff0000 } )
    );
    sphere.position.set( 0, 0, 0 );
    this._scene.add( sphere );
  }

  setupRenderer() {
    const { width, height } = this._root.getBoundingClientRect();

    this._webglRenderer = new WebGLRenderer();
    this._cssRenderer = new CSS3DRenderer();

    this._cssRenderer.domElement.style.position = "absolute";
    this._cssRenderer.domElement.style.top = 0;
    this._cssRenderer.domElement.style.pointerEvents = "none";

    this._cssRenderer.setSize( width, height );
    this._webglRenderer.setSize( width, height );

    this._webglRenderer.setSize( window.innerWidth, window.innerHeight );
    this._webglRenderer.setClearColor( 0x000000 );

    this._root.appendChild( this._cssRenderer.domElement );
    this._root.appendChild( this._webglRenderer.domElement );

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
    this._cssRenderer.render( this._scene, this._camera );
    this._webglRenderer.render( this._scene, this._camera );
  }
}
