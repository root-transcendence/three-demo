import { Object3D } from "three";

export default class Ball {
  private _mesh: Object3D;

  constructor(mesh: Object3D) {
    this._mesh = mesh;
  }

  get mesh() {
    return this._mesh;
  }
}
