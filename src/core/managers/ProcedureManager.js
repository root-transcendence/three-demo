/**
 * @class ProcedureManager
 * 
 * @typedef {import("../Engine").default} Engine
 * 
 * @property {Engine} engine
 * @property {Map<number, {procedure: Procedure, collectedRequirements: any}>} procedures
 */
export class ProcedureManager {
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

    let collectedRequirements;

    try {
      console.log( `Collecting requirements for procedure: ${procedure.name}` );
      collectedRequirements = this.collectRequirements( requirements );
    } catch ( error ) {
      procedure.state = "error";
      console.error( `Error collecting requirements for procedure: ${procedure.name}` );
      console.error( error );

      return null;
    }

    try {
      procedure.id = this.#nextProcedureId++;
    } catch ( error ) {
      procedure.state = "error";
      console.error( `Error setting id for procedure: ${procedure.name}` );
      console.error( error );

      return null;
    }

    console.log( `Adding procedure: ${procedure.name}` );

    this.procedures.set( procedure.id, { procedure, collectedRequirements } );

    if ( startOnAdd ) {
      try {
        console.log( `Starting procedure: ${procedure.name}` );
        start( collectedRequirements );
      } catch ( error ) {
        procedure.state = "error";
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
          procedure.state = "error";
          console.error( `Error updating procedure: ${procedure.name}` );
          console.error( error );
        }
      } );
    }
  }

  startProcedure( procedureId ) {

    const entry = this.procedures.get( procedureId );

    if ( entry ) {

      console.log( `Starting procedure: ${procedureId} with name ${entry.procedure.name}` );

      try {
        entry.procedure.start( entry.requirements );
      } catch ( error ) {
        entry.procedure.state = "error";
        console.error( `Error starting procedure: ${procedureId} with name ${entry.procedure.name}` );
        console.error( error );
      }
    }
  }

  endProcedure( procedureId ) {
    const entry = this.procedures.get( procedureId );
    if ( entry ) {

      console.log( `Ending procedure: ${procedureId} with name ${entry.procedure.name}` );

      try {
        entry.procedure.end( entry.requirements );
      } catch ( error ) {
        entry.procedure.state = "error";
        console.error( `Error ending procedure: ${procedureId} with name ${entry.procedure.name}` );
        console.error( error );
      }

      this.procedures.delete( entry );
    }
  }

  collectRequirements( requirements ) {
    if ( !requirements ) return {};
    return {
      managers: this.getRequiredItems( this.engine.managers, requirements.managers ),
      three: this.getRequiredItems( this.engine.three, requirements.three ),
      systems: this.getRequiredItems( this.engine.systems, requirements.systems ),
      engine: this.getRequiredItems( this.engine, requirements.engine )
    };
  }

  getRequiredItems( collection, keys ) {
    if ( !keys ) return {};
    return keys.reduce( ( acc, key ) => {
      if ( collection[key] ) {
        acc[key] = collection[key];
        if (acc[key] instanceof Function ) {
          acc[key] = acc[key].bind( collection );
        }
      }
      return acc;
    }, {} );
  }
}

export class Procedure {
  #id = undefined;
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

  set state( val ) {
    this.#state = val;
  }

  get id() {
    return this.#id;
  }

  set id( val ) {
    if ( this.#id != undefined ) throw new Error( "Procedure id has already been set" );
    this.#id = val;
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
