import { AmbientLight, Mesh, SpotLight } from "three";
import GeometryManager from "./GeometryManager";
import MaterialManager from "./MaterialManager";

export default class EntityManager {
  private static _instance: EntityManager;

  private _materialManager: MaterialManager = MaterialManager.getInstance();
  private _geometryManager: GeometryManager = GeometryManager.getInstance();

  private constructor() {}

  static getInstance() {
    if (!EntityManager._instance) {
      EntityManager._instance = new EntityManager();
    }
    return EntityManager._instance;
  }

  getSphere() {
    const geo = this._geometryManager.getSphere();
    const mat = this._materialManager.getPhysicalMaterial({ color: 0xff0000 });
    return new Mesh(geo, mat);
  }

  getLight() {
    return new SpotLight(0xffffff, 1);
  }

  getAmbientLight() {
    return new AmbientLight(0xffffff, .1);
  }
}
