import { Game } from "./core/Game";

export class App {


  constructor() {
    this._game = new Game( this._root );
    this._root = document.getElementById( 'game' );
  }

  start() {
    this._game.start();
  }

  destroy() {
    this._game.destroy();
  }
}

document.addEventListener( "DOMContentLoaded", () => {
  const app = new App();

  app.start();
  // const sphere = new SphereGeometry(1, 32, 32);
  // const mat = new MeshPhysicalMaterial({ color: 0xff0000 });

  // console.log(sphere.toJSON());
  // console.log(mat.toJSON());
} );
