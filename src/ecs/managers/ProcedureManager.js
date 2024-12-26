class ProcedureManager {
  constructor( engine ) {
    this.engine = engine;
    this.activeProcedures = new Map();
    this.procedureTimeouts = new Map();
  }

  addProcedure( procedure ) {
    const { require, start, update, end } = procedure;
    const requirements = this.collectRequirements( require );

    console.log( `Adding and starting procedure: ${procedure.name}` );

    try {
      start( requirements );
      this.activeProcedures.set( procedure.name, { procedure, requirements } );
    } catch ( error ) {
      console.error( `Error starting procedure: ${procedure.name}` );
      console.error( error );
    }

    if ( update ) {
      this.engine.updateTasks.push( () => {
        try {
          console.log( `Updating procedure: ${procedure.name}` );
          update( requirements );
        } catch ( error ) {
          console.error( `Error updating procedure: ${procedure.name}` );
          console.error( error );
        }
      } );
    }
  }

  endProcedure( procedure ) {
    const entry = this.activeProcedures.get( procedure.name );
    if ( entry ) {

      console.log( `Ending procedure: ${procedure.name}` );

      try {
        entry.procedure.end( entry.requirements );
      } catch ( error ) {
        console.error( `Error ending procedure: ${procedure.name}` );
        console.error( error );
      }

      this.activeProcedures.delete( entry );
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

export default ProcedureManager;