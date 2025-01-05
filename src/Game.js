import { gameConfig } from "./config/GameConfig";
import Engine from "./core/Engine";
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
   * @param {}
   * 
  * @property {HTMLElement} element
  * @property {Engine} engine
  * @property {ProcedureManager} procedureManager
  */
  constructor( element ) {
    this.engine = new Engine( { element } );
    this.procedureManager = new ProcedureManager( this.engine );
    this.loadConfig( gameConfig );
    document.addEventListener( "DOMContentLoaded", this.start.bind( this ) );
  }

  start() {
    this.engine.setup();
    this.engine.march();

    const procedure = new Procedure( testProcedure );
    this.procedureManager.addProcedure( procedure, true );
    document.addEventListener( "click", () => {
      this.procedureManager.endProcedure( procedure );
    } );
    // setTimeout( () => {
    //   this.procedureManager.endProcedure( procedure );
    // }, 5000 );
  }

  loadConfig( config ) {
    this.engine.managers.Env
  }
}
