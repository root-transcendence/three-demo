import { MeshPhysicalMaterial, MeshPhysicalMaterialParameters } from "three";

export default class MaterialManager {
  private static _instance: MaterialManager;

  private constructor() {}

  static getInstance() {
    if (!MaterialManager._instance) {
      MaterialManager._instance = new MaterialManager();
    }
    return MaterialManager._instance;
  }

  getPhysicalMaterial(params?: MeshPhysicalMaterialParameters) {
    return new MeshPhysicalMaterial(params);
  }
}
