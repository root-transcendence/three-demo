import { MenuManager } from "./managers/MenuManager";
import InputSystem from "./systems/InputSystem";
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

  setupSystems( configs ) {
    this.addSystem( new UISystem( configs[UISystem.name], this.getManager( MenuManager ) ) );
    this.addSystem( new MovementSystem( configs[MovementSystem.name], this.getManager( "AssetComponent" ), this.getManager( "VelocityComponent" ) ) );
    this.addSystem( new RenderingSystem( configs[RenderingSystem.name], this ) );
    this.addSystem( new SynchronizationSystem( configs[SynchronizationSystem.name], this ) );
    this.addSystem( new InputSystem( configs[InputSystem.name], this ) )
  },
}