import ProcedureManager, { Procedure } from "../ecs/managers/ProcedureManager";
import { createLoginForm } from "../UIComponents/LoginRegisterComponent";
import Engine from "./Engine";

/**
 * @class Game
 * 
 * @typedef {Object} GameConfig
 * 
 */
export class Game {

  /**
  * @property {HTMLElement} element
  * @property {Engine} engine
  * @property {ProcedureManager} procedureManager
  */
  constructor( element ) {
    this.engine = new Engine( { element } );
    this.procedureManager = new ProcedureManager( this.engine );
    document.addEventListener( "DOMContentLoaded", this.start.bind( this ) );
  }

  start() {
    this.engine.setup();
    this.engine.march();

    const testProcedure = new Procedure( {
      name: "Test Procedure",
      requirements: {
        managers: ["MenuManager"]
      },
      start: ( { managers } ) => {
        const { MenuManager } = managers;

        const menu = createLoginForm();

        MenuManager.addMenu( menu );
        MenuManager.setActiveMenu( menu.id );
        this.engine.setInteractionCanvas( "css3d" ); // Ha buriyadur
      },
      end: ( { managers } ) => {
        console.log( "Ending Test Procedure" );
        const { MenuManager } = managers;

        MenuManager.setActiveMenu( null );
        this.engine.setInteractionCanvas( "webgl" );
      }
    } );
    this.procedureManager.addProcedure( testProcedure, true );
    document.addEventListener( "click", () => {
      this.procedureManager.endProcedure( testProcedure );
    } );
    // setTimeout( () => {
    //   this.procedureManager.endProcedure( testProcedure );
    // }, 5000 );
  }
}
