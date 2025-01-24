/**
 * gamePage.js
 * 
 * Represents the "Game" page in the SPA. 
 * It leverages the initNewGame() function to set up the canvas, scoreboard, 
 * start button, and WebSocket communication.
 */

import { initNewGame } from "./initNewGame.js"; // Adjust the path to wherever initNewGame is defined

export async function gamePage() {
  // Create a container element for the game page
  const container = document.createElement( "div" );
  container.className = "game-page-container";

  // Optional: a title or some header
  const title = document.createElement( "h1" );
  title.textContent = "Multiplayer Pong";
  container.appendChild( title );

  // If you want to pass arguments (like user ID and room ID) from elsewhere:
  // for example: const uid = "someUserId"; const roomId = "someRoomId";
  // Or read them from URL params, localStorage, or a global store:
  const uid = "player123";    // example placeholder
  const roomId = "roomXYZ";   // example placeholder

  // Initialize the new game
  // Note: initNewGame appends canvas, scoreboard, etc. to document.body by default.
  // If you prefer to attach those elements specifically inside this container, 
  // you can modify initNewGame to return a container or accept a parent element.
  initNewGame( uid, roomId );

  // Return the container so that the SPA can attach it to the DOM.
  return container;
}
