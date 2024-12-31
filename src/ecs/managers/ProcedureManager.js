/**
 * @class ProcedureManager
 * 
 * @typedef {import("../../core/Engine").default} Engine
 * 
 * @property {Engine} engine
 * @property {Map<number, {procedure: Procedure, collectedRequirements: any}>} procedures
 */
class ProcedureManager {
  #nextProcedureId = 0;
  procedures;

  /**
   * @param {Engine} engine
   * @param {Map<number, {procedure: Procedure, collectedRequirements: any}>} procedures
   */
  constructor( engine, procedures = new Map() ) {
    this.engine = engine;
    this.procedures = procedures;
  }

  /**
   * @param {Procedure} procedure to add
   * @param {boolean} startOnAdd should the procedure start immediately
   */
  addProcedure( procedure, startOnAdd = false ) {

    const { requirements, start, update } = procedure;

    const collectedRequirements = this.collectRequirements( requirements );

    console.log( `Adding procedure: ${procedure.name}` );

    this.procedures.set( this.#nextProcedureId++, { procedure, collectedRequirements } );

    if ( startOnAdd ) {
      try {
        start( collectedRequirements );
      } catch ( error ) {
        console.error( `Error starting procedure: ${procedure.name}` );
        console.error( error );
      }
    }

    if ( update ) {
      this.engine.updateTasks.set( "Procedure_" + procedure.name, () => {
        try {
          console.log( `Updating procedure: ${procedure.name}` );
          update( collectedRequirements );
        } catch ( error ) {
          console.error( `Error updating procedure: ${procedure.name}` );
          console.error( error );
        }
      } );
    }
  }

  startProcedure( procedureId ) { }

  endProcedure( procedureId ) {
    const entry = this.procedures.get( procedureId );
    if ( entry ) {

      console.log( `Ending procedure: ${procedureId} with name ${entry.procedure.name}` );

      try {
        entry.procedure.end( entry.requirements );
      } catch ( error ) {
        console.error( `Error ending procedure: ${procedureId} with name ${entry.procedure.name}` );
        console.error( error );
      }

      this.procedures.delete( entry );
    }
  }

  collectRequirements( requirements ) {
    return {
      managers: this.getRequiredItems( this.engine.managers, requirements.managers ),
      three: this.getRequiredItems( this.engine.three, requirements.three ),
      systems: this.getRequiredItems( this.engine.systems, requirements.systems ),
    };
  }

  getRequiredItems( collection, keys ) {
    if ( !keys ) return {};
    return keys.reduce( ( acc, key ) => {
      if ( collection[key] ) acc[key] = collection[key];
      return acc;
    }, {} );
  }
}

export class Procedure {
  /**
   * @type {"idle" | "loading" | "running" | "ended" | "error"}
   */
  #state;
  #name;
  #requirements;
  #start;
  #update;
  #end;
  #timeout;
  /**
   * @param {string} name
   * @param {{three: string[], managers: string[], systems: string[]}} requirements
   * @param {(requirements: any) => void} start
   * @param {(requirements: any) => void} update
   * @param {(requirements: any) => void} end
   * @param {number} timeout
   */
  constructor( { name, requirements, start, update, end, timeout } ) {
    this.#state = "idle";
    this.#name = name;
    this.#requirements = requirements;
    this.#start = start;
    this.#update = update;
    this.#end = end;
    this.#timeout = timeout;
  }

  get state() {
    return this.#state;
  }

  /**
   * @param {string} val
   * @throws {Error} if process have already been loaded
   */
  set name( val ) {
    if ( this.#state != "idle" ) throw new Error( "Procedure has already been loaded" );
    this.#name = val;
  }

  get name() {
    return this.#name;
  }

  /**
   * @param {{three: string[], managers: string[], systems: string[]}} val
   * @throws {Error} if process have already been loaded
   */
  set requirements( val ) {
    if ( this.#state != "idle" ) throw new Error( "Procedure has already been loaded" );
    this.#requirements = val;
  }

  get requirements() {
    return Object.freeze( this.#requirements );
  }

  /**
   * @param {(requirements: any) => void} val
   * @throws {Error} if process have already been loaded
   */
  set start( val ) {
    if ( this.#state != "idle" ) throw new Error( "Procedure has already been loaded" );
    this.#start = val;
  }

  get start() {
    return this.#start;
  }

  /**
   * @param {(requirements: any) => void} val
   * @throws {Error} if process have already been loaded
   */
  set update( val ) {
    if ( this.#state != "idle" ) throw new Error( "Procedure has already been loaded" );
    this.#update = val;
  }

  get update() {
    return this.#update;
  }

  /**
   * @param {(requirements: any) => void} val
   * @throws {Error} if process have already been loaded
   */
  set end( val ) {
    if ( this.#state != "idle" ) throw new Error( "Procedure has already been loaded" );
    this.#end = val;
  }

  get end() {
    return this.#end;
  }
}


export default ProcedureManager;