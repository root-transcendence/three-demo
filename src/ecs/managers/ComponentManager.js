export default class ComponentManager {
  constructor() {
    this.components = new Map();
  }

  addComponent( entityId, component ) {
    this.components.set( entityId, component );
  }

  getComponent( entityId ) {
    return this.components.get( entityId );
  }

  removeComponent( entityId ) {
    this.components.delete( entityId );
  }

  get entries() {
    return this.components.entries();
  }

  get size() {
    return this.components.size;
  }

  clear() {
    this.components.clear();
  }

  forEach( callback ) {
    this.components.forEach( callback );
  }
}
