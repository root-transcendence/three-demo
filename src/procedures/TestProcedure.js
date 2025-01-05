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

    console.log( "Creating Login Form" );
    const menu = createLoginForm();

    console.log( "Adding Menu to MenuManager" );
    MenuManager.addMenu( menu );
    console.log( "Setting Active Menu" );
    MenuManager.setActiveMenu( menu.id );
    console.log( "Setting Interaction Canvas" );
    setInteractionCanvas( "css3d" );
  },
  end: ( { managers, engine } ) => {
    console.log( "Ending Test Procedure" );
    const { MenuManager } = managers;
    const { setInteractionCanvas } = engine;

    MenuManager.setActiveMenu( null );
    setInteractionCanvas( "webgl" );
  }
} 