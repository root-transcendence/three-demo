import System from "../System";

export class UISystem extends System {
  constructor( config, menuManager ) {
    super( config );

    this.menuManager = menuManager;

    this.update = () => {
      const activeMenu = this.menuManager.getActiveMenu();
      if ( activeMenu ) {
        activeMenu.render();
      }
    }
  }
}
