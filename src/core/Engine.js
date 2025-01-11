import { ManagersMixin } from "./Engine.ManagersMixin";
import { SystemsMixin } from "./Engine.SystemsMixin";
import { ThreeMixin } from "./Engine.ThreeMixin";
import { AssetManager } from "./managers/AssetManager";
import { EnvironmentManager } from "./managers/EnvironmentManager";

/**
 * @class Engine
 * @classdesc The core engine of the game.
 * 
 * @mixes ThreeMixin
 * @mixes ManagersMixin
 * @mixes SystemsMixin
 */
export default class Engine {
  /**
   * 
   * @param {object} engineConfig - The configuration for the engine.
   * @param {string} engineConfig.socket - WebSocket connection string.
   * @param {object} engineConfig.systems - The HTML element to render the engine.
   * @param {HTMLElement} engineConfig.element - The HTML element to render the engine.
   * 
   * @property {HTMLElement} element
   * @property {Map<string, Function>} updateTasks
   * 
   */
  constructor( engineConfig ) {
    this.config = engineConfig
    this.element = engineConfig.element;
    this.updateTasks = new Map();
    this.initThree();
    this.initManagers();
    this.initSystems();
    window.engine = this;
  }

  march() {
    const animate = () => {
      requestAnimationFrame( animate );
      this.#update();
    };

    this.activateAllSystems();
    animate();
  }

  /**
   * Updates active systems in order of priority.
   * @private
   */
  #update() {
    Object.values( this.systems )
      .filter( s => s.state === "active" )
      .sort( ( a, b ) => a.order - b.order )
      .forEach( ( system ) => system.update() );

    this.updateTasks.forEach( ( task ) => task() );
  }

  setup() {
    this.setupThree();
    this.setupManagers();
    this.setupSystems( this.config.systems );
  }

  loadConfig( config ) {

    if ( !config ) {
      throw Error( `Engine: The config is ${config}. You joking?` );
    }

    const envmgr = this.getManager( EnvironmentManager );
    envmgr.loadScenes( config.scenes );

    const assetmgr = this.getManager( AssetManager );
    assetmgr.parse( config.ships[0] )
      .then( ( ship ) => {
        const scene = this.getThree( "Scene" );
        const cameraPivot = this.getThree( "CameraPivot" );
        scene.add( ship );
        this._ship = ship;
        

        this.getThree( "CustomFlyControls" ).control( this._ship );


        this.updateTasks.set( "lerpCamera", () => {

          const interpFactor = 0.1;

          cameraPivot.position.lerp( this._ship.position, interpFactor );

          const desiredQuat = this._ship.quaternion.clone();
          cameraPivot.quaternion.slerp( desiredQuat, interpFactor );
        } );
      } );
  }
}

Object.assign( Engine.prototype, ThreeMixin, ManagersMixin, SystemsMixin );
