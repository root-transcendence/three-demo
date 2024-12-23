import System from "../System";

export class UISystem extends System {
  constructor( menuManager ) {
    super();
    this.menuManager = menuManager;
  }

  update() {
    const activeMenu = this.menuManager.getActiveMenu();
    if ( activeMenu ) {
      activeMenu.render();
    }
  }
}


/*
// Example usage

const buttonProps = {
  label: "Edit Profile",
  styles: { color: "red" },
}
const textProps = {
  text: "John Doe",
  styles: { color: "blue" },
}

const menu = new MenuComponent( "profileMenu", {
  elements: [
    new ButtonComponent( "Edit Profile", buttonProps ),
    new TextComponent( "Profile Name", textProps ),
    new ButtonComponent( "Log Out", buttonProps ),
  ]
} );

// Add transitions, giriş ve çıkış durumlarında çalışacak fonksiyonlar efektler vs.
withTransitions(menu, {
  in: (menu) => console.log(`${menu.id} fades in`),
  out: (menu) => console.log(`${menu.id} fades out`),
});

// Add event handling for menu elements
menu.elements.forEach((element) =>
  withEventHandlers(element, {
    onClick: () => console.log(`${element.label} clicked`),
  })
);
 */