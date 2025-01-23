import Router from "./Router.js";
import { createLoginForm } from "./UIComponents/LoginComponent.js";
import { createRegisterForm } from "./UIComponents/RegisterComponent.js";
import { useApi } from "./api/Api.js";
import { gameConfig } from "./config/GameConfig.js";
import Engine from "./core/Engine.js";
import { EnvironmentManager } from "./core/managers/EnvironmentManager.js";
import { MenuManager } from "./core/managers/MenuManager.js";
import { Procedure, ProcedureManager } from "./core/managers/ProcedureManager.js";
import { EventSystem } from "./core/systems/EventSystem.js";
import { gameProcedure } from "./procedures/InitGame.js";
import { loginProcedureConfig, registerProcedureConfig } from "./procedures/TestProcedure.js";


export class App extends HTMLElement {
  #router;
  #engine;

  constructor() {
    super();
    this.#engine = new Engine( { element: this, config: gameConfig } );


    // this.#game = new Game( this );
    this.#router = new Router();

    this.start()
      .then( () => {
        this.#engine.setInteractionCanvas( "css3d" );
        this.#router.navigate( window.location.pathname );
      } );

  }

  async start() {
    this.#engine.setup();
    this.#engine.march();

    this.procedureManager = this.#engine.getManager( ProcedureManager );
    this.menuManager = this.#engine.getManager( MenuManager );

    const menus = this.#_createMenus();

    Object.keys( menus ).forEach( ( key ) => {

      this.addMenu( menus[key] );

      this.#router.addRoute( `/${key}`, () => this.menuManager.switchMenu( menus[key].id ) );

    } );


    this.#engine.getManager( EnvironmentManager ).setActiveScene( "Match" )

    const proc = new Procedure( gameProcedure );
    const procedure = new Procedure( registerProcedureConfig );
    const procedure2 = new Procedure( loginProcedureConfig );

    this.procedureManager.addProcedure( proc );
    this.procedureManager.addProcedure( procedure );
    this.procedureManager.addProcedure( procedure2 );
  }

  addMenu( menu ) {
    this.#engine.getManager( MenuManager )?.addMenu( menu );
  }

  #_createMenus() {

    EventSystem.on( "login-form-submit", async ( { username, password } ) => {
      const data = await useApi().login( username, password )
      console.log( "login response", data );
    } )

    EventSystem.on( "register-form-submit", async ( { username, email, password } ) => {
      const data = await useApi().register( username, email, password )
      console.log( "register response", data );
    } )

    return ( {
      login: createLoginForm(),
      register: createRegisterForm(),
    } )
  }
}

customElements.define( "ft-transcendence", App );
