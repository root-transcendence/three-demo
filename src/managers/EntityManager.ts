import { AmbientLight, Mesh, Object3D, ObjectLoader, SpotLight } from "three";
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

  async isThatASupra() {
    return new Promise<Object3D>((resolve, reject) => {
      new ObjectLoader().load("assets/objects/model.obj", resolve, undefined, reject);
    });
  }

  async getEntity(geomertyId: string, materialId: string) {
    const geo = await this._geometryManager.getGeometryWithRefAdd(geomertyId);
    const mat = await this._materialManager.getMaterialWithRefAdd(materialId);
    return new Mesh(geo, mat);
  }

  getLight() {
    return new SpotLight(0xffffff, 1);
  }

  getAmbientLight() {
    return new AmbientLight(0xffffff, 0.1);
  }
}
