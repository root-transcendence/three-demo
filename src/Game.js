import { gameConfig } from "./config/GameConfig";
import Engine from "./core/Engine";
import { EnvironmentManager } from "./core/managers/EnvironmentManager";
import { Procedure, ProcedureManager } from "./core/managers/ProcedureManager";
import { testProcedure } from "./procedures/TestProcedure";

/**
 * @class Game
 * 
 * @typedef {Object} GameConfig
 * 
 */
export class Game {

  /**
   * @param {HtmlElement} element
   * 
  * @property {HTMLElement} element
  * @property {Engine} engine
  * @property {ProcedureManager} procedureManager
  */
  constructor( element ) {
    this.engine = new Engine( { element } );
    document.addEventListener( "DOMContentLoaded", this.start.bind( this ) );
  }

  start() {
    this.engine.setup();
    this.engine.march();

    const procedure = new Procedure( testProcedure );

    this.loadConfig( gameConfig );
    this.procedureManager = this.engine.getManager( ProcedureManager );
    this.procedureManager.addProcedure( procedure, true );
    document.addEventListener( "click", () => {
      this.procedureManager.endProcedure( procedure );
    } );
    // setTimeout( () => {
    //   this.procedureManager.endProcedure( procedure );
    // }, 5000 );
  }

  loadConfig( config ) {
    this.engine.getManager( EnvironmentManager ).loadConfig( config );
  }
}
