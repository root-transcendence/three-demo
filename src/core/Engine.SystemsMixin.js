import { MenuManager } from "./managers/MenuManager";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderingSystem } from "./systems/RenderingSystem";
import { SynchronizationSystem } from "./systems/SyncronizationSystem";
import { UISystem } from "./systems/UISystem";


export const SystemsMixin = {

  initSystems() {
    this.systems = {};
  },

  activateAllSystems() {
    Object.values( this.systems ).forEach( system => system.activate() );
  },

  addSystem( system ) {
    this.systems[system.constructor.name] = system;
  },

  removeSystem( system ) {
    delete this.systems[system.constructor.name];
  },

  getSystem( name ) {
    return this.systems[name instanceof Function ? name.name : name];
  },

  setupSystems() {
    this.addSystem( new UISystem( this.getManager( MenuManager ) ) );
    this.addSystem( new MovementSystem( this.getManager( "AssetComponent" ), this.getManager( "VelocityComponent" ) ) );
    this.addSystem( new RenderingSystem( this.three ) );
    this.addSystem( new SynchronizationSystem( this ) );
  }
}