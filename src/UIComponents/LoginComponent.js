import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { ButtonComponent, DivComponent, FormComponent, InputComponent, LabelComponent, TextComponent } from '../core/components/Type.Component.js';
import { withEventHandlers } from '../core/components/UIComponent.Util.js';
import { EventSystem } from "../core/systems/EventSystem.js";

function loginFormComponent() {
  const loginForm = new FormComponent( "loginForm", { class: "active" } );

  const header = new TextComponent( "loginHeader", { text: "Login", class: "loginRegisterHeader" } );

  const usernameGroup = new DivComponent( "emailGroup", { class: "input-group" } );
  const usernameInput = new InputComponent( "usernameInput", { type: "text", class: "input-field", required: true, placeholder: " " } );
  const usernameLabel = new LabelComponent( "usernameLabel", { text: "Username", for: "usernameInput" } );
  usernameGroup.elements = [
    usernameInput,
    usernameLabel
  ]

  const passwordGroup = new DivComponent( "passwordGroup", { class: "input-group" } );
  const passwordInput = new InputComponent( "loginPassword", { type: "password", class: "input-field", required: true, placeholder: " " } );
  const passwordLabel = new LabelComponent( "loginPassword", { text: "Password", for: "loginPassword" } );
  passwordGroup.elements = [
    passwordInput,
    passwordLabel
  ]

  const submitButton = new ButtonComponent( "submitBtn", { attributes: { type: "submit" }, class: "submit-btn input-field", label: "Login" } );


  withEventHandlers( loginForm, {
    onSubmit: ( event ) => {
      event.preventDefault();
      EventSystem.emit( "login-form-submit", {
        username: usernameInput.value,
        password: passwordInput.value
      } );
    }
  } );

  loginForm.elements = [
    header,
    usernameGroup,
    passwordGroup,
    submitButton
  ]

  return loginForm;
}

export function createLoginForm() {
  const menuContainer = new DivComponent( "loginMenu", { object: new CSS3DObject(), class: "menu" } );

  const logo = new TextComponent( "42", { text: "42", class: "logo" } );

  // hexagon
  const loginFrom = loginFormComponent();
  const octagon = new DivComponent( "octagon", { class: "octagon" } );
  const octagonInner = new DivComponent( "octagonInner", {
    class: "octagon-inner", elements: [
      loginFrom
    ]
  } );

  octagon.elements = [
    octagonInner
  ];

  menuContainer.elements = [
    logo,
    octagon,
    new DivComponent( "authStatus", { class: "auth-status" } )
  ]

  menuContainer.transitionIn = () => {
    menuContainer._object.position.set( 0, 0, -500 );
  }

  menuContainer.transitionOut = () => {
    menuContainer._object.position.set( 0, 0, -300 );
  }

  return menuContainer;
}
