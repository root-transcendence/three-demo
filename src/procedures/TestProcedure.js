import { createLoginForm } from "../UIComponents/LoginRegisterComponent";

export const testProcedure = {
  name: "Test Procedure",
  requirements: {
    managers: ["MenuManager"],
    engine: ["setInteractionCanvas"]
  },
  start: ( { managers, engine } ) => {
    const { MenuManager } = managers;
    const { setInteractionCanvas } = engine;

    const menu = createLoginForm();

    MenuManager.addMenu( menu );
    MenuManager.setActiveMenu( menu.id );
    setInteractionCanvas( "css3d" );
  },
  end: ( { managers, engine } ) => {
    const { MenuManager } = managers;
    const { setInteractionCanvas } = engine;

    MenuManager.setActiveMenu( null );
    setInteractionCanvas( "webgl" );
  }
} 