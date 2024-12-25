import {ButtonComponent, InputComponent,MenuComponent, TextComponent, DivComponent, FormComponent, LabelComponent } from '../ecs/components/Type.Component.js';
import { CSS3DObject } from 'three/examples/jsm/Addons';
import { withEventHandlers } from '../ecs/components/UIComponent.Util.js';


function loginFormComponent() {
  const loginForm = new FormComponent("loginForm", {class:"active"}).render();

  const header = new TextComponent("loginHeader", {text:"Login", class:"loginRegisterHeader"}).render();
  loginForm.appendChild(header);

  // Email input group
  const emailGroup = new DivComponent("emailGroup", {class:"input-group"}).render();
  const emailInput = new InputComponent("loginEmail", {type:"email", required:true, placeholder:" "}).render();
  const emailLabel = new LabelComponent("loginEmail", {text:"Email", for:"loginEmail"}).render();
  emailGroup.appendChild(emailInput);
  emailGroup.appendChild(emailLabel);
  loginForm.appendChild(emailGroup);

  // Password input group
  const passwordGroup = new DivComponent("passwordGroup", {class:"input-group"}).render();
  const passwordInput = new InputComponent("loginPassword", {type:"password", required:true, placeholder:" "}).render();
  const passwordLabel = new LabelComponent("loginPassword", {text:"Password", for:"loginPassword"}).render();
  passwordGroup.appendChild(passwordInput);
  passwordGroup.appendChild(passwordLabel);
  loginForm.appendChild(passwordGroup);

  // Submit button
  const submitButton = new ButtonComponent("submitBtn", {type:"submit", class:"submit-btn", label:"Login"}).render();
  loginForm.appendChild(submitButton);

  return loginForm;
}

function registerFormComponent() {
  const registerForm = new FormComponent("registerForm").render();

  const header = new TextComponent("registerHeader", {text:"Register", class:"loginRegisterHeader"}).render();
  registerForm.appendChild(header);

  // Username input group
  const usernameGroup = new DivComponent("usernameGroup", {class:"input-group"}).render();
  const usernameInput = new InputComponent("registerUsername", {type:"text", required:true, placeholder:" "}).render();
  const usernameLabel = new LabelComponent("registerUsername", {text:"Username", for:"registerUsername"}).render();
  usernameGroup.appendChild(usernameInput);
  usernameGroup.appendChild(usernameLabel);
  registerForm.appendChild(usernameGroup);

  // Email input group
  const emailGroup = new DivComponent("emailGroup", {class:"input-group"}).render();
  const emailInput = new InputComponent("registerEmail", {type:"email", required:true, placeholder:" "}).render();
  const emailLabel = new LabelComponent("registerEmail", {text:"Email", for:"registerEmail"}).render();
  emailGroup.appendChild(emailInput);
  emailGroup.appendChild(emailLabel);
  registerForm.appendChild(emailGroup);

  // Password input group
  const passwordGroup = new DivComponent("passwordGroup", {class:"input-group"}).render();
  const passwordInput = new InputComponent("registerPassword", {type:"password", required:true, placeholder:" "}).render();
  const passwordLabel = new LabelComponent("label", {text:"Password", for:"registerPassword"}).render();
  passwordGroup.appendChild(passwordInput);
  passwordGroup.appendChild(passwordLabel);
  registerForm.appendChild(passwordGroup);

  // Submit button
  const submitButton = new ButtonComponent("submitBtn", {type:"submit", class:"submit-btn", label:"Register"}).render();
  registerForm.appendChild(submitButton);

  return registerForm;
}

export default function LoginRegisterComponent(){
  const menuContainer = new DivComponent("loginRegisterMenu", {class:"menu"}).render();

  const logo = new TextComponent("42", {text:"42", class:"logo"}).render();

  // Swicht form
  const modeSwitch = new DivComponent("modeSwitch", {class:"mode-switch"}).render();
  const loginButton = new ButtonComponent("loginBtn", {class:"active", label:"Login"});
  const registerButton = new ButtonComponent("registerBtn", {label:"Register"});
  withEventHandlers(loginButton, {
      onClick: () => console.log(`${loginButton.id} clicked`),
    });
  modeSwitch.appendChild(loginButton.render());
  modeSwitch.appendChild(registerButton.render());

  // hexagon
  const octagon = new DivComponent("octagon", {class:"octagon"}).render();
  const octagonInner = new DivComponent("octagonInner", {class:"octagon-inner"}).render();
  octagonInner.appendChild(loginFormComponent());
  octagonInner.appendChild(registerFormComponent());
  octagon.appendChild(octagonInner);

  const authStatus = new DivComponent("authStatus", {class:"auth-status"}).render();
  octagon.appendChild(authStatus);

  menuContainer.appendChild(logo);
  menuContainer.appendChild(modeSwitch);
  menuContainer.appendChild(octagon);

  const menuObject = new CSS3DObject( menuContainer );
  menuObject.position.set( 0, 0, 0 );
  return menuObject;
}
/*
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const authStatus = document.getElementById("authStatus");



  loginBtn.addEventListener("click", () => {
      switchForm(loginBtn, loginForm, registerBtn, registerForm);
  });

  registerBtn.addEventListener("click", () => {
      switchForm(registerBtn, registerForm, loginBtn, loginForm);
  });

  loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password =
          document.getElementById("loginPassword").value;
      verifyAuth("login", { email, password });
  });

  registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email =
          document.getElementById("registerEmail").value;
      const password =
          document.getElementById("registerPassword").value;
      const confirmPassword =
          document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
          authStatus.textContent = "Passwords do not match";
          return;
      }

      verifyAuth("register", { email, password });
  });


});

function verifyAuth(action, data) {
    // Simulating a request to an authentication server
    authStatus.textContent = "Verifying...";

    // Replace 'https://auth.example.com' with your actual authentication server URL
    fetch(`https://api.django/profile/34223423`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => response.json())
.then(result => {
    if (result.success) {
        authStatus.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)} successful!`;
        // Here you can redirect the user or perform other actions upon successful authentication
    } else {
        authStatus.textContent = result.message || `${action.charAt(0).toUpperCase() + action.slice(1)} failed. Please try again.`;
    }
})
.catch(error => {
    console.error('Error:', error);
    authStatus.textContent = 'An error occurred. Please try again later.';
    });
}
*/
