import { AmbientLight, AudioLoader, BufferGeometryLoader, DirectionalLight, HemisphereLight, MathUtils, Object3D, ObjectLoader, PointLight, SpotLight, TextureLoader } from "three";
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
      geometry: new BufferGeometryLoader(),
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

  async parse( data ) {
    const typeCache = this.getTypeCache( "object" );
    if ( data.uuid && typeCache.has( data.uuid ) ) return typeCache.get( data.uuid );
    else if ( data.uuid === undefined ) data.uuid = MathUtils.generateUUID();

    return new Promise( ( resolve, reject ) => {
      this.loaders.object.parse( data, ( object ) => {
        typeCache.set( object.uuid, object ).get( object.uuid )
        resolve( object );
      } );
    }
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
    let light;

    switch ( config.type ) {
      case "AmbientLight":
        light = new AmbientLight( config.color || 0xffffff, config.intensity || 1 );
        break;
      case "DirectionalLight":
        light = new DirectionalLight( config.color || 0xffffff, config.intensity || 1 );
        if ( config.position ) light.position.set( ...config.position );
        break;
      case "PointLight":
        light = new PointLight( config.color || 0xffffff, config.intensity || 1, config.distance || 0, config.decay || 1 );
        if ( config.position ) light.position.set( ...config.position );
        break;
      case "SpotLight":
        light = new SpotLight( config.color || 0xffffff, config.intensity || 1, config.distance || 0, config.angle || Math.PI / 3, config.penumbra || 0, config.decay || 1 );
        if ( config.position ) light.position.set( ...config.position );
        if ( config.target ) {
          const target = new Object3D();
          target.position.set( ...config.target );
          light.target = target;
        }
        break;
      case "HemisphereLight":
        light = new HemisphereLight( config.skyColor || 0xffffff, config.groundColor || 0x000000, config.intensity || 1 );
        break;
      default:
        console.warn( `Unknown light type: ${config.type}` );
        return null;
    }

    return light;
  }


  logProgress( e, type, key ) {
    console.log( `Loading ${type} ${key}: ${( e.loaded / e.total ) * 100}%` );
  }
}

export { AssetManager };
