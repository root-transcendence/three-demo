import { AudioLoader, ObjectLoader, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class AssetManager {

  /**
   * @property {Map<string, Map<string, any>>} cache
   * @property {{texture: TextureLoader, object: ObjectLoader, model: GLTFLoader, audio: AudioLoader}} loaders
   */
  constructor() {
    this.cache = new Map();

    this.loaders = {
      texture: new TextureLoader(),
      object: new ObjectLoader(),
      model: new GLTFLoader(),
      audio: new AudioLoader(),
    };

    for ( const type in this.loaders ) {
      this.cache.set( type, new Map() );
    }
  }

  /**
   * 
   * @param {string} key id of the asset to load
   * @param {"texture" | "object" | "model" | "audio"} type
   * @param {string} url location of the asset
   * @returns 
   */
  async load( key, type, url ) {
    const typeCache = this.getTypeCache( type );

    if ( typeCache.has( key ) ) return;

    const loader = this.getLoader( type );

    return new Promise( ( resolve, reject ) =>
      loader.load(
        url,
        ( resolve( typeCache.set( key, data ).get( key ) ) )( data ),
        this.logProgress( e, type, key )( e ),
        reject )
    );

  }

  get( key, type ) {
    const typeCache = this.cache.get( type );
    return typeCache ? typeCache.get( key ) : undefined;
  }

  getOrThrow( key, type ) {
    const asset = this.get( key, type );
    if ( !asset ) {
      throw new Error( `Asset "${key}" of type "${type}" is not loaded` );
    }
    return asset;
  }

  /**
   * 
   * @param {string} type of asset
   * @returns {Map<string, any>} cache of assets
   */
  getTypeCache( type ) {
    const typeCache = this.cache.get( type );
    if ( !typeCache ) {
      throw new Error( `Unsupported asset type: ${type}` );
    }
    return typeCache;
  }

  /**
   * 
   * @param {string} type 
   * @returns {TextureLoader | ObjectLoader | GLTFLoader | AudioLoader}
   */
  getLoader( type ) {
    const loader = this.loaders[type];
    if ( !loader ) {
      throw new Error( `Unsupported asset type: ${type}` );
    }
    return loader;
  }

  createLight( config ) {
    const { type, color, intensity } = config;
    const light = new type( color, intensity );
    return light;
  }

  logProgress( e, type, key ) {
    console.log( `Loading ${type} ${key}: ${( e.loaded / e.total ) * 100}%` );
  }
}

export { AssetManager };
