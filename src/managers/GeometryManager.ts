import { BufferGeometry, BufferGeometryLoader } from "three";

export default class GeometryManager {
  private static _instance: GeometryManager;

  private _geometriesPath: string = "assets/geometries/";

  private _geometryMap: Map<string, BufferGeometry> = new Map();

  private _geometryRefs: Map<string, number> = new Map();

  private constructor() {}

  static getInstance() {
    if (!GeometryManager._instance) {
      GeometryManager._instance = new GeometryManager();
    }
    return GeometryManager._instance;
  }

  async getGeometryWithRefAdd(id: string) {
    try {
      const geo = this.getGeometry(id);
      this.addReference(id);
      return await geo;
    } catch (e) {
      console.log(`Error getting geometry: ${id}`);
    }
  }

  async getGeometry(id: string) {
    return new Promise<BufferGeometry>((resolve, reject) => {
      if (!this._geometryMap.has(id)) {
        this._loadGeometry(id).then(resolve).catch(reject);
      } else {
        resolve(this._geometryMap.get(id)!);
      }
    });
  }

  addReference(id: string) {
    if (!this._geometryRefs.has(id)) {
      this._geometryRefs.set(id, 0);
    }
    this._geometryRefs.set(id, this._geometryRefs.get(id)! + 1);
  }

  removeReference(id: string) {
    if (!this._geometryRefs.has(id)) {
      return;
    }
    this._geometryRefs.set(id, this._geometryRefs.get(id)! - 1);
    if (this._geometryRefs.get(id) === 0) {
      this._geometryMap.get(id)?.dispose();
      this._geometryMap.delete(id);
      this._geometryRefs.delete(id);
    }
  }

  private async _loadGeometry(id: string) {
    return new Promise<BufferGeometry>((resolve, reject) => {
      const path = `${this._geometriesPath}${id}.json`;
      const loader = new BufferGeometryLoader();
      loader.load(
        path,
        (geometry) => {
          this._geometryMap.set(id, geometry);
          resolve(geometry);
        },
        undefined,
        reject
      );
    });
  }
}
