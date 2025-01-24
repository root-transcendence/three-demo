import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import { ButtonComponent, DivComponent, FormComponent, InputComponent, LabelComponent, TextComponent } from '../core/components/Type.Component.js';
import { withEventHandlers } from '../core/components/UIComponent.Util.js';
import { EventSystem } from "../core/systems/EventSystem.js";

function registerFormComponent() {

  const registerForm = new FormComponent( "registerForm" );

  const header = new TextComponent( "registerHeader", { text: "Register", class: "loginRegisterHeader" } );

  // Username input group
  const usernameGroup = new DivComponent( "usernameGroup", { class: "input-group" } );
  const usernameInput = new InputComponent( "registerUsername", { type: "text", class: "input-field", required: true, placeholder: " " } );
  const usernameLabel = new LabelComponent( "registerUsernameLabel", { text: "Username", for: "registerUsername" } );
  usernameGroup.elements = [
    usernameInput,
    usernameLabel
  ]

  // Email input group
  const emailGroup = new DivComponent( "emailGroup", { class: "input-group" } );
  const emailInput = new InputComponent( "registerEmail", { type: "email", class: "input-field", required: true, placeholder: " " } );
  const emailLabel = new LabelComponent( "registerEmailLabel", { text: "Email", for: "registerEmail" } );
  emailGroup.elements = [
    emailInput,
    emailLabel
  ]

  // Password input group
  const passwordGroup = new DivComponent( "passwordGroup", { class: "input-group" } );
  const passwordInput = new InputComponent( "registerPassword", { type: "password", class: "input-field", required: true, placeholder: " " } );
  const passwordLabel = new LabelComponent( "label", { text: "Password", for: "registerPassword" } );
  passwordGroup.elements = [
    passwordInput,
    passwordLabel
  ]

  // Submit button
  const submitButton = new ButtonComponent( "submitBtn", { attributes: { type: "submit" }, class: "submit-btn input-field", label: "Register" } );

  withEventHandlers( registerForm, {
    onSubmit: ( event ) => {
      event.preventDefault();
      EventSystem.emit( "register-form-submit", {
        username: usernameInput.value,
        email: emailInput.value,
        password: passwordInput.value
      } );
    }
  } );

  registerForm.elements = [
    header,
    usernameGroup,
    emailGroup,
    passwordGroup,
    submitButton
  ]

  return registerForm;
}

export function createRegisterForm() {

  const menuContainer = new DivComponent( "registerMenu", { object: new CSS3DObject(), class: "menu" } );

  const logo = new TextComponent( "42", { text: "42", class: "logo" } );

  // hexagon
  const registerForm = registerFormComponent();
  const octagon = new DivComponent( "octagon", { class: "octagon" } );
  const octagonInner = new DivComponent( "octagonInner", {
    class: "octagon-inner", elements: [
      registerForm
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
    menuContainer._object.position.set( 0, 0, -1000 );
  }

  return menuContainer;
}








