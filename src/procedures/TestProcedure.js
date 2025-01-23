/**
 * @member {import("../core/managers/ProcedureManager.js").ProcedureConfig}
 */
export const registerProcedureConfig = {
  name: "p_register",
  requirements: {
    managers: ["MenuManager"],
  },
  start: ( { managers } ) => {
    const { MenuManager } = managers;

    MenuManager.switchMenu( "registerMenu" );
  },
  end: ( { managers } ) => {
    const { MenuManager } = managers;

    MenuManager.setActiveMenu( null );
  }
}

/**
 * @member {import("../core/managers/ProcedureManager.js").ProcedureConfig}
 */
export const loginProcedureConfig = {
  name: "p_login",
  requirements: {
    managers: ["MenuManager"],
  },
  start: ( { managers } ) => {
    const { MenuManager } = managers;

    MenuManager.switchMenu( "loginMenu" );
  },
  end: ( { managers } ) => {
    const { MenuManager } = managers;

    MenuManager.setActiveMenu( null );
  }
}