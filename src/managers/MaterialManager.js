import { Material, MaterialLoader } from "three";

export default class MaterialManager {
  static _instance;



  constructor() {
    this._materialsPath = "assets/materials/";
    this._materialMap = new Map();
    this._materialRefs = new Map();
    this._materialMeshRefs = new Map();
  }

  static getInstance() {
    if ( !MaterialManager._instance ) {
      MaterialManager._instance = new MaterialManager();
    }
    return MaterialManager._instance;
  }

  async getMaterialWithRefAdd( id ) {
    try {
      const prom = this.getMaterial( id );
      this.addReference( id );
      return await prom;
    } catch ( e ) {
      console.error( e );
    }
  }

  async getMaterial( id ) {
    return new Promise < Material > ( ( resolve, reject ) => {
      if ( !this._materialMap.has( id ) ) {
        this._loadMaterial( id ).then( resolve ).catch( reject );
      } else {
        resolve( this._materialMap.get( id ) );
      }
    } );
  }

  addReference( id ) {
    if ( !this._materialRefs.has( id ) ) {
      this._materialRefs.set( id, 0 );
    }
    this._materialRefs.set( id, this._materialRefs.get( id ) + 1 );
  }

  removeReference( id ) {
    if ( !this._materialRefs.has( id ) ) {
      return;
    }
    this._materialRefs.set( id, this._materialRefs.get( id ) - 1 );
    if ( this._materialRefs.get( id ) === 0 ) {
      this._materialMap.get( id )?.dispose();
      this._materialMap.delete( id );
      this._materialRefs.delete( id );
    }
  }

  async _loadMaterial( id ) {
    return new Promise < Material > ( ( resolve, reject ) => {
      const path = `${this._materialsPath}${id}.json`;
      const loader = new MaterialLoader();
      loader.load(
        path,
        ( material ) => {
          this._materialMap.set( id, material );
          resolve( material );
        },
        undefined,
        reject
      );
    } );
  }
}
