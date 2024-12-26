import ProcedureManager from "../ecs/managers/ProcedureManager";
import { createLoginForm } from "../UIComponents/LoginRegisterComponent";
import Engine from "./Engine";

export class Game {

  constructor( element ) {
    this._engine = new Engine( { element } );
    this._procedureManager = new ProcedureManager( this._engine );
    document.addEventListener( "DOMContentLoaded", this.start.bind( this ) );
  }

  start() {
    this._engine.setup();
    this._engine.march();

    const testProcedure = {
      name: "Test Procedure",
      require: {
        managers: ["MenuManager"],
        three: ["CameraControls"]
      },
      start: ( { managers, three } ) => {
        const { MenuManager } = managers;
        const { CameraControls } = three;
        const menu = createLoginForm( MenuManager );

        MenuManager.addMenu( menu );
        MenuManager.setActiveMenu( menu.id );
        CameraControls.enabled = false;
      },
      end: ( { managers, three } ) => {
        console.log( "Ending Test Procedure" );
        const { MenuManager } = managers;
        const { CameraControls } = three;

        MenuManager.setActiveMenu( null );
        CameraControls.enabled = true;
      }
    }
    this._procedureManager.addProcedure( testProcedure );
    setTimeout( () => {
      this._procedureManager.endProcedure( testProcedure );
    }, 5000 );
  }

}
