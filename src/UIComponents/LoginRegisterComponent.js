import { CSS3DObject } from 'three/examples/jsm/Addons';
import { ButtonComponent, DivComponent, FormComponent, InputComponent, LabelComponent, TextComponent } from '../core/components/Type.Component.js';
import { withEventHandlers } from '../core/components/UIComponent.Util.js';


function loginFormComponent() {
  const loginForm = new FormComponent( "loginForm", { class: "active" } );

  const header = new TextComponent( "loginHeader", { text: "Login", class: "loginRegisterHeader" } );

  // Email input group
  const emailGroup = new DivComponent( "emailGroup", { class: "input-group" } );
  const emailInput = new InputComponent( "loginEmail", { type: "email", required: true, placeholder: " " } );
  const emailLabel = new LabelComponent( "loginEmail", { text: "Email", for: "loginEmail" } );
  emailGroup.elements = [
    emailInput,
    emailLabel
  ]

  // Password input group
  const passwordGroup = new DivComponent( "passwordGroup", { class: "input-group" } );
  const passwordInput = new InputComponent( "loginPassword", { type: "password", required: true, placeholder: " " } );
  const passwordLabel = new LabelComponent( "loginPassword", { text: "Password", for: "loginPassword" } );
  passwordGroup.elements = [
    passwordInput,
    passwordLabel
  ]

  // Submit button
  const submitButton = new ButtonComponent( "submitBtn", { type: "submit", class: "submit-btn", label: "Login" } );

  loginForm.elements = [
    header,
    emailGroup,
    passwordGroup,
    submitButton
  ]

  return loginForm;
}

function registerFormComponent() {
  const registerForm = new FormComponent( "registerForm" );

  const header = new TextComponent( "registerHeader", { text: "Register", class: "loginRegisterHeader" } );

  // Username input group
  const usernameGroup = new DivComponent( "usernameGroup", { class: "input-group" } );
  const usernameInput = new InputComponent( "registerUsername", { type: "text", required: true, placeholder: " " } );
  const usernameLabel = new LabelComponent( "registerUsername", { text: "Username", for: "registerUsername" } );
  usernameGroup.elements = [
    usernameInput,
    usernameLabel
  ]

  // Email input group
  const emailGroup = new DivComponent( "emailGroup", { class: "input-group" } );
  const emailInput = new InputComponent( "registerEmail", { type: "email", required: true, placeholder: " " } );
  const emailLabel = new LabelComponent( "registerEmail", { text: "Email", for: "registerEmail" } );
  emailGroup.elements = [
    emailInput,
    emailLabel
  ]

  // Password input group
  const passwordGroup = new DivComponent( "passwordGroup", { class: "input-group" } );
  const passwordInput = new InputComponent( "registerPassword", { type: "password", required: true, placeholder: " " } );
  const passwordLabel = new LabelComponent( "label", { text: "Password", for: "registerPassword" } );
  passwordGroup.elements = [
    passwordInput,
    passwordLabel
  ]

  // Submit button
  const submitButton = new ButtonComponent( "submitBtn", { type: "submit", class: "submit-btn", label: "Register" } );

  registerForm.elements = [
    header,
    usernameGroup,
    emailGroup,
    passwordGroup,
    submitButton
  ]

  return registerForm;
}

export default function loginRegisterComponent() {
  const menuContainer = new DivComponent( "loginRegisterMenu", { class: "menu" } );

  const logo = new TextComponent( "42", { text: "42", class: "logo" } );

  // Swicht form
  const modeSwitch = new DivComponent( "modeSwitch", { class: "mode-switch" } );
  const loginButton = new ButtonComponent( "loginBtn", { class: "active", label: "Login" } );
  const registerButton = new ButtonComponent( "registerBtn", { label: "Register" } );
  modeSwitch.elements = [
    loginButton,
    registerButton
  ]
  // withEventHandlers(loginButton, {
  //     onClick: () => console.log(`${loginButton.id} clicked`),
  //   });

  // hexagon
  const octagon = new DivComponent( "octagon", { class: "octagon" } );
  const octagonInner = new DivComponent( "octagonInner", {
    class: "octagon-inner", elements: [
      loginFormComponent(),
      registerFormComponent()
    ]
  } );
  octagon.elements = [
    octagonInner,
    new DivComponent( "authStatus", { class: "auth-status" } )
  ];

  menuContainer.elements = [
    logo,
    modeSwitch,
    octagon,
    new DivComponent( "authStatus", { class: "auth-status" } )
  ]

  menuContainer.object = new CSS3DObject();

  return menuContainer;
}

export function createLoginForm() {
  const menuContainer = new DivComponent( "loginRegisterMenu", { object: new CSS3DObject(), class: "menu" } );

  const logo = new TextComponent( "42", { text: "42", class: "logo" } );

  // Swicht form
  const modeSwitch = new DivComponent( "modeSwitch", { class: "mode-switch" } );
  const loginButton = new ButtonComponent( "loginBtn", { class: "active", label: "Login" } );
  const registerButton = new ButtonComponent( "registerBtn", { label: "Register" } );
  modeSwitch.elements = [
    loginButton,
    registerButton
  ]

  // hexagon
  const loginFrom = loginFormComponent();
  const registerForm = registerFormComponent();
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
    modeSwitch,
    octagon,
    new DivComponent( "authStatus", { class: "auth-status" } )
  ]

  withEventHandlers( loginButton, {
    onClick: () => {
      octagonInner.elements = [
        loginFrom
      ]
      octagonInner.render();
    }
  } );

  withEventHandlers( registerButton, {
    onClick: () => {
      octagonInner.elements = [
        registerForm
      ]
      octagonInner.render();
    }
  } );

  return menuContainer;
}
