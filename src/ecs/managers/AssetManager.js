import { AudioLoader, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class AssetManager {
  constructor() {
    this.cache = new Map();
    this.textureLoader = new TextureLoader();
    this.gltfLoader = new GLTFLoader();
    this.audioLoader = new AudioLoader();

    this.loaders = {
      texture: this.textureLoader,
      model: this.gltfLoader,
      audio: this.audioLoader,
    };

    for (const type in this.loaders) {
      this.cache.set(type, new Map());
    }
  }

  async load(key, type, url) {
    const typeCache = this.getTypeCache(type);

    if (typeCache.has(key)) return;

    const loader = this.getLoader(type);

    const asset = await new Promise((resolve, reject) => 
      loader.load(url, resolve, (e) => this.logProgress(e, type, key), reject)
    );

    typeCache.set(key, asset);
  }

  get(key, type) {
    const typeCache = this.cache.get(type);
    return typeCache ? typeCache.get(key) : undefined;
  }

  getOrThrow(key, type) {
    const asset = this.get(key, type);
    if (!asset) {
      throw new Error(`Asset "${key}" of type "${type}" is not loaded`);
    }
    return asset;
  }

  getTypeCache(type) {
    const typeCache = this.cache.get(type);
    if (!typeCache) {
      throw new Error(`Unsupported asset type: ${type}`);
    }
    return typeCache;
  }

  getLoader(type) {
    const loader = this.loaders[type];
    if (!loader) {
      throw new Error(`Unsupported asset type: ${type}`);
    }
    return loader;
  }

  logProgress(e, type, key) {
    console.log(`Loading ${type} ${key}: ${(e.loaded / e.total) * 100}%`);
  }
}

export { AssetManager };
