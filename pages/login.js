/*
 * loginPage.js
 * Combined Login + Register in a tab-like UI.
 */

import { EventSystem } from "../src/core/systems/EventSystem.js";

export async function loginPage() {
  // Parent container
  const container = document.createElement( "div" );
  container.className = "login-page container py-5 d-flex justify-content-center";

  // Card
  const card = document.createElement( "div" );
  card.className = "card p-4 shadow-sm";
  card.style.maxWidth = "500px";
  card.style.width = "100%";

  // Title
  const title = document.createElement( "h2" );
  title.className = "mb-3 text-center";
  title.textContent = "Welcome";

  // Subtitle
  const subtitle = document.createElement( "p" );
  subtitle.className = "mb-4 text-center text-muted";
  subtitle.textContent = "Please choose an option below.";

  // -- Nav tabs for Login / Register
  const navWrapper = document.createElement( "ul" );
  navWrapper.className = "nav nav-tabs mb-3 justify-content-center";

  // Login tab
  const loginTabItem = document.createElement( "li" );
  loginTabItem.className = "nav-item";
  const loginTabLink = document.createElement( "a" );
  loginTabLink.className = "nav-link active"; // Login is default
  loginTabLink.href = "#"; // not strictly necessary in an SPA
  loginTabLink.textContent = "Login";
  loginTabItem.appendChild( loginTabLink );

  // Register tab
  const registerTabItem = document.createElement( "li" );
  registerTabItem.className = "nav-item";
  const registerTabLink = document.createElement( "a" );
  registerTabLink.className = "nav-link";
  registerTabLink.href = "#";
  registerTabLink.textContent = "Register";
  registerTabItem.appendChild( registerTabLink );

  navWrapper.appendChild( loginTabItem );
  navWrapper.appendChild( registerTabItem );

  // -- Alert Box (shared, or you can separate if you prefer unique messages)
  const alertBox = document.createElement( "div" );
  alertBox.className = "alert alert-danger d-none";
  alertBox.setAttribute( "role", "alert" );
  // Start empty. We fill this text as needed:
  alertBox.textContent = "";

  // ********************************************************
  //   LOGIN FORM
  // ********************************************************
  const loginForm = document.createElement( "form" );
  loginForm.className = "needs-validation";

  const usernameGroupLogin = document.createElement( "div" );
  usernameGroupLogin.className = "mb-3";
  usernameGroupLogin.innerHTML = `
    <label for="loginUsername" class="form-label">Username</label>
    <input
      type="text"
      id="loginUsername"
      name="username"
      class="form-control"
      placeholder="Enter username"
      required
    />
  `;

  const passwordGroupLogin = document.createElement( "div" );
  passwordGroupLogin.className = "mb-3 position-relative";
  passwordGroupLogin.innerHTML = `
    <label for="loginPassword" class="form-label">Password</label>
    <input
      type="password"
      id="loginPassword"
      name="password"
      class="form-control"
      placeholder="Enter password"
      required
    />
  `;

  const loginBtn = document.createElement( "button" );
  loginBtn.type = "submit";
  loginBtn.className = "btn btn-primary w-100 mt-3";
  loginBtn.textContent = "Login";

  // Append login inputs
  loginForm.appendChild( usernameGroupLogin );
  loginForm.appendChild( passwordGroupLogin );
  loginForm.appendChild( loginBtn );

  // Handle login submit
  loginForm.addEventListener( "submit", ( event ) => {
    event.preventDefault();

    // Clear any previous alert
    alertBox.classList.add( "d-none" );

    const { username, password } = loginForm.elements;
    if ( !username.value.trim() || !password.value.trim() ) {
      alertBox.classList.remove( "d-none" );
      alertBox.textContent = "Username and password must not be empty.";
      return;
    }

    try {
      // If you add real API calls here, wrap them in try/catch:
      // await someLoginApiCall(username.value.trim(), password.value);

      // Emit an event for login
      EventSystem.emit( "login-form-submit", {
        username: username.value.trim(),
        password: password.value,
      } );
    } catch ( error ) {
      // Catch any unexpected error and display in alertBox
      alertBox.classList.remove( "d-none" );
      alertBox.textContent = `Login failed. ${error.message}`;
      console.error( "Login error:", error );
    }
  } );

  // ********************************************************
  //   REGISTER FORM
  // ********************************************************
  const registerForm = document.createElement( "form" );
  registerForm.className = "needs-validation d-none";

  // Username
  const usernameGroupReg = document.createElement( "div" );
  usernameGroupReg.className = "mb-3";
  usernameGroupReg.innerHTML = `
    <label for="registerUsername" class="form-label">Username</label>
    <input
      type="text"
      id="registerUsername"
      name="username"
      class="form-control"
      placeholder="Enter username"
      required
    />
  `;

  // Email
  const emailGroupReg = document.createElement( "div" );
  emailGroupReg.className = "mb-3";
  emailGroupReg.innerHTML = `
    <label for="registerEmail" class="form-label">Email</label>
    <input
      type="email"
      id="registerEmail"
      name="email"
      class="form-control"
      placeholder="Enter email"
      required
    />
  `;

  // Password
  const passwordGroupReg = document.createElement( "div" );
  passwordGroupReg.className = "mb-3 position-relative";
  passwordGroupReg.innerHTML = `
    <label for="registerPassword" class="form-label">Password</label>
    <input
      type="password"
      id="registerPassword"
      name="password"
      class="form-control"
      placeholder="Enter password"
      required
    />
  `;

  const registerBtn = document.createElement( "button" );
  registerBtn.type = "submit";
  registerBtn.className = "btn btn-success w-100 mt-3";
  registerBtn.textContent = "Register";

  // Append register inputs
  registerForm.appendChild( usernameGroupReg );
  registerForm.appendChild( emailGroupReg );
  registerForm.appendChild( passwordGroupReg );
  registerForm.appendChild( registerBtn );

  // Handle register submit
  registerForm.addEventListener( "submit", ( event ) => {
    event.preventDefault();

    // Clear alert
    alertBox.classList.add( "d-none" );

    const { username, email, password } = registerForm.elements;
    if (
      !username.value.trim() ||
      !email.value.trim() ||
      !password.value.trim()
    ) {
      alertBox.classList.remove( "d-none" );
      alertBox.textContent = "All fields (username, email, password) are required.";
      return;
    }

    // Emit an event for register
    EventSystem.emit( "register-form-submit", {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
    } );
  } );

  // ********************************************************
  //   TOGGLING BETWEEN LOGIN & REGISTER
  // ********************************************************
  loginTabLink.addEventListener( "click", ( e ) => {
    e.preventDefault();
    e.stopPropagation();
    registerTabLink.classList.remove( "active" );
    loginTabLink.classList.add( "active" );
    registerForm.classList.add( "d-none" );
    loginForm.classList.remove( "d-none" );
    alertBox.classList.add( "d-none" );
  } );

  registerTabLink.addEventListener( "click", ( e ) => {
    e.preventDefault();
    e.stopPropagation();
    loginTabLink.classList.remove( "active" );
    registerTabLink.classList.add( "active" );
    loginForm.classList.add( "d-none" );
    registerForm.classList.remove( "d-none" );
    alertBox.classList.add( "d-none" );
  } );

  // ********************************************************
  //   ASSEMBLE EVERYTHING
  // ********************************************************
  card.appendChild( title );
  card.appendChild( subtitle );
  card.appendChild( navWrapper ); // The tabs
  card.appendChild( alertBox );
  card.appendChild( loginForm );
  card.appendChild( registerForm );

  container.appendChild( card );

  return container;
}
