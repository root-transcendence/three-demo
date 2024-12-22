import { AmbientLight, Mesh, SpotLight } from "three";
import GeometryManager from "./GeometryManager";
import MaterialManager from "./MaterialManager";

export default class EntityManager {
  constructor() {
    this._materialManager = MaterialManager.getInstance();
    this._geometryManager = GeometryManager.getInstance();
  }

  static getInstance() {
    if ( !EntityManager._instance ) {
      EntityManager._instance = new EntityManager();
    }
    return EntityManager._instance;
  }

  async getEntity( geomertyId, materialId ) {
    const geo = await this._geometryManager.getGeometryWithRefAdd( geomertyId );
    const mat = await this._materialManager.getMaterialWithRefAdd( materialId );
    return new Mesh( geo, mat );
  }

  getLight() {
    return new SpotLight( 0xffffff, 1 );
  }

  getAmbientLight() {
    return new AmbientLight( 0xffffff, 0.1 );
  }
}
