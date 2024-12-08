import { Game } from "./core/Game";

export class App {
  private _game: Game;
  
  private _root: HTMLElement = document.getElementById('game') as HTMLElement;

  constructor() {
    this._game = new Game(this._root);
  }

  start() {
    this._game.start();
  }

  destroy() {
    this._game.destroy();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();

  app.start();
});
