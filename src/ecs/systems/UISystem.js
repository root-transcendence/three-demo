import { ThrottledSystem } from "../System";

export class UISystem extends ThrottledSystem {
  constructor( uiManager ) {
    super();
    this.uiManager = uiManager;
  }

  update( serverState ) {
    this.uiManager.forEach( ( uiComponent, entityId ) => {
      console.log( `Entity ${entityId} has a UI component with text: ${uiComponent.element.element.textContent}` );
    } );
  }
}
