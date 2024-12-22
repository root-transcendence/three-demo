export class MenuSystem {
  constructor( menuComponent ) {
    this.menuComponent = menuComponent;
  }

  switchMenu( menu ) {
    this.menuComponent.activeMenu = menu;

    // Update DOM or visibility of menus
    document.getElementById( "main-menu" ).style.display = menu === "main" ? "block" : "none";
    document.getElementById( "pause-menu" ).style.display = menu === "pause" ? "block" : "none";
  }
}
