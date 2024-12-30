import SystemConfig from "../../config/SystemConfig";
import System from "../System";

export class UISystem extends System {
  constructor( menuManager ) {
    super( SystemConfig.UISystem );

    this.menuManager = menuManager;

    this.update = () => {
      const activeMenu = this.menuManager.getActiveMenu();
      if ( activeMenu ) {
        activeMenu.render();
      }
    }
  }
}
