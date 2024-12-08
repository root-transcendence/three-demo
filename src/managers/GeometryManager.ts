import { SphereGeometry } from "three";

export default class GeometryManager {
  private static _instance: GeometryManager;

  private constructor() {}

  static getInstance() {
    if (!GeometryManager._instance) {
      GeometryManager._instance = new GeometryManager();
    }
    return GeometryManager._instance;
  }

  getSphere() {
    return new SphereGeometry(1, 32, 32);
  }
}
