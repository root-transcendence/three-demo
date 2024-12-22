import { BufferGeometry, BufferGeometryLoader } from "three";

export default class GeometryManager {

  constructor() {
    this._geometryMap = new Map();
    this._geometryRefs = new Map();

    this._geometriesPath = "assets/geometries/";

  }
  static getInstance() {
    if ( !GeometryManager._instance ) {
      GeometryManager._instance = new GeometryManager();
    }
    return GeometryManager._instance;
  }

  async getGeometryWithRefAdd( id ) {
    try {
      const geo = this.getGeometry( id );
      this.addReference( id );
      return await geo;
    } catch ( e ) {
      console.log( `Error getting geometry: ${id}` );
    }
  }

  async getGeometry( id ) {
    return new Promise < BufferGeometry > ( ( resolve, reject ) => {
      if ( !this._geometryMap.has( id ) ) {
        this._loadGeometry( id ).then( resolve ).catch( reject );
      } else {
        resolve( this._geometryMap.get( id ) );
      }
    } );
  }

  addReference( id ) {
    if ( !this._geometryRefs.has( id ) ) {
      this._geometryRefs.set( id, 0 );
    }
    this._geometryRefs.set( id, this._geometryRefs.get( id ) + 1 );
  }

  removeReference( id ) {
    if ( !this._geometryRefs.has( id ) ) {
      return;
    }
    this._geometryRefs.set( id, this._geometryRefs.get( id ) - 1 );
    if ( this._geometryRefs.get( id ) === 0 ) {
      this._geometryMap.get( id )?.dispose();
      this._geometryMap.delete( id );
      this._geometryRefs.delete( id );
    }
  }

  async _loadGeometry( id ) {
    return new Promise < BufferGeometry > ( ( resolve, reject ) => {
      const path = `${this._geometriesPath}${id}.json`;
      const loader = new BufferGeometryLoader();
      loader.load(
        path,
        ( geometry ) => {
          this._geometryMap.set( id, geometry );
          resolve( geometry );
        },
        undefined,
        reject
      );
    } );
  }
}
