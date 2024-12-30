export class MenuManager {
  constructor( scene ) {
    this.menus = new Map();
    this.previousMenu = null;
    this.activeMenu = null;
    this.scene = scene;
  }

  addMenu( menu ) {
    this.menus.set( menu.id, menu );
  }

  getActiveMenu() {
    return this.menus.get( this.activeMenu );
  }

  setActiveMenu( menuId ) {
    this.activeMenu = menuId;

    this.menus.forEach( ( menu, id ) => {
      if ( id === menuId ) {
        menu.active = true;
        this.scene.add( menu.object );
      } else {
        menu.active = false;
        this.scene.remove( menu.object );
      }
    } );
  }

  previous() {
    if ( this.previousMenu ) {
      this.switchMenu( this.previousMenu );
    }
  }

  switchMenu( menuId ) {
    if ( this.activeMenu ) {
      const currentMenu = this.menus.get( this.activeMenu );

      if ( currentMenu.transitionOut ) {
        currentMenu.transitionOut();
      }

      currentMenu.active = false;

      this.scene.remove( currentMenu.object );
      this.previousMenu = this.activeMenu;
    }

    const newMenu = this.menus.get( menuId );
    if ( newMenu ) {

      this.activeMenu = menuId;
      newMenu.active = true;

      if ( newMenu.transitionIn ) {
        newMenu.transitionIn();
      }

      this.scene.add( newMenu.object );

    }
  }

  removeMenu( menuId ) {
    const menu = this.menus.get( menuId );

    if ( menu ) {
      this.menus.delete( menuId );
      this.scene.remove( menu.object );
    }
  }

  clearMenus() {
    this.menus.forEach( menu => {
      this.scene.remove( menu.object );
    } );
    this.menus.clear();
  }
}
