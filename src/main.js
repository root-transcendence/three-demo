import { gamePage } from "../pages/game/game.js";
import { gamePageOffline } from "../pages/game/gameOffline.js";
import { tournamentPage } from "../pages/game/tournament.js";
import { tournamentPlayPage } from "../pages/game/tournamentManager.js";
import { homePage } from "../pages/home.js";
import { loginPage } from "../pages/login.js";
import { profilePage } from "../pages/profile.js";
import { useApi } from "./api/Api.js";
import { EventSystem } from "./core/systems/EventSystem.js";
import { requireAuth, requireNonAuth } from "./routing/authUtils.js";
import router from "./routing/Router.js";

export class App extends HTMLElement {
  #router;

  constructor() {
    super();
    this.#router = router;
    this.#initialize().then( () => {
      this.#router.navigate( window.location.pathname );
    } );
  }

  async #initialize() {
    this.#setupRoutes();

    this.#setupEvents();
  }

  #setupRoutes() {

    this.#router.addRoute( "/", requireAuth( this.#router, async () => {
      this.innerHTML = "";
      this.appendChild( await homePage() );
    } ) );

    this.#router.addRoute( "/login", requireNonAuth( this.#router, async () => {
      this.innerHTML = "";
      this.appendChild( await loginPage() );
    } ) );

    this.#router.addRoute( "/game", async () => {
      this.innerHTML = "";
      this.appendChild( await gamePage() );
    } );

    this.#router.addRoute( "/game-offline", () => {
      this.innerHTML = "";
      this.appendChild( gamePageOffline( true ) );
    } );

    this.#router.addRoute( "/tournament", async () => {
      this.innerHTML = "";
      this.appendChild( tournamentPage() );
    } );

    this.#router.addRoute( "/tournament-play", async () => {
      this.innerHTML = "";
      this.appendChild( tournamentPlayPage() );
    } );

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

    EventSystem.on( "ecole42-auth-click", () => {
      useApi().ecole42Auth();
    } );
  }
}

customElements.define( "ft-transcendence", App );
