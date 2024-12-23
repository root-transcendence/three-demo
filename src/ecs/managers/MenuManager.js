export class MenuManager {
  constructor() {
    this.menus = new Map();
    this.activeMenu = null;
  }

  addMenu( menu ) {
    this.menus.set( menu.id, menu );
  }

  switchMenu( menuId ) {
    if ( this.activeMenu ) {
      const currentMenu = this.menus.get( this.activeMenu );

      if ( currentMenu.transitionOut ) {
        currentMenu.transitionOut();
      }

      currentMenu.active = false;
    }

    const newMenu = this.menus.get( menuId );
    if ( newMenu ) {

      this.activeMenu = menuId;
      newMenu.active = true;

      if ( newMenu.transitionIn ) {
        newMenu.transitionIn();
      }

    }
  }

  getActiveMenu() {
    return this.menus.get( this.activeMenu );
  }
}
