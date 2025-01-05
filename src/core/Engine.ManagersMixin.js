import { AssetManager } from "./managers/AssetManager";
import { ComponentManager } from "./managers/ComponentManager";
import { EntityManager } from "./managers/EntityManager";
import { EnvironmentManager } from "./managers/EnvironmentManager";
import { MenuManager } from "./managers/MenuManager";
import { ProcedureManager } from "./managers/ProcedureManager";
import { WebSocketManager } from "./managers/WebSocketManager";

export const ManagersMixin = {

  initManagers() {
    this.managers = {};
  },

  addManager( manager ) {
    const key = manager.componentType || manager.constructor.name;
    this.managers[key] = manager;
  },

  removeManager( manager ) {
    delete this.managers[manager.constructor.name];
  },

  getManager( name ) {
    return this.managers[name instanceof Function ? name.name : name];
  },

  setupManagers() {
    this.addManager( new EntityManager() );
    this.addManager( new MenuManager( this.three.Camera ) );
    this.addManager( new ProcedureManager( this ) );
    this.addManager( new AssetManager() );
    this.addManager( new EnvironmentManager( this.three.Camera ) );
    this.addManager( new WebSocketManager( "/asd" ) );
    this.addManager( new ComponentManager( "AssetComponent" ) );
    this.addManager( new ComponentManager( "PositionComponent" ) );
    this.addManager( new ComponentManager( "VelocityComponent" ) );
  },
}
