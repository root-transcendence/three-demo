import { Game } from "./Game";

export class App extends HTMLElement {
  constructor() {
    super();
    this._game = new Game( this );
  }
}

customElements.define( "ft-transcendence", App );
