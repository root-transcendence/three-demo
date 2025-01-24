import { gamePage } from "../pages/game.js";
import { homePage } from "../pages/home.js";
import { loginPage } from "../pages/login.js";
import { profilePage } from "../pages/profile.js";
import { useApi } from "./api/Api.js";
import { EventSystem } from "./core/systems/EventSystem.js";
import { requireAuth, requireNonAuth } from "./routing/authUtils.js";
import Router from "./routing/Router.js";

export class App extends HTMLElement {
  #router;

  constructor() {
    super();
    this.#router = new Router();
    this.#initialize().then( () => {
      this.#router.navigate( window.location.pathname );
    } );
  }

  async #initialize() {
    this.#setupRoutes();

    this.#setupEvents();
  }

  #setupRoutes() {
    this.#router.addRoute( "/login", requireNonAuth( this.#router, async () => {
      this.innerHTML = "";
      this.appendChild( await loginPage() );
    } ) );

    this.#router.addRoute( "/game", async () => {
      this.innerHTML = "";
      this.appendChild( await gamePage() );
    } );

    this.#router.addRoute( "/", requireAuth( this.#router, async () => {
      this.innerHTML = "";
      this.appendChild( await homePage() );
    } ) );

    this.#router.addRoute( "/profile", requireAuth( this.#router, async () => {
      this.innerHTML = "";
      this.appendChild( await profilePage() );
    } ) );
  }

  #setupEvents() {
    EventSystem.on( "login-form-submit", async ( { username, password } ) => {
      try {
        const response = await useApi().login( username, password );
        this.#router.navigate( "/" );
      } catch ( err ) {
        console.error( "Login failed:", err );
      }
    } );

    EventSystem.on( "register-form-submit", async ( { username, email, password } ) => {
      try {
        const response = await useApi().register( username, email, password );

        this.#router.navigate( "/login" );
      } catch ( err ) {
        console.error( "Login failed:", err );
      }
    } );
  }
}

customElements.define( "ft-transcendence", App );
