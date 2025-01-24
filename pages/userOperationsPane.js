import { useApi } from "../src/api/Api.js";
import { useGameRequestSocket } from "../src/api/GameRequestSocket.js";

/**
 * Creates a pane (card) with top-tab navigation for user operations:
 * - Friends
 * - Requests
 * - Search
 * - (optional) Blocked or other user-related features
 *
 * Returns a DOM element (div.card) you can place anywhere in your layout.
 */
export function createUserOperationsPane() {
  const api = useApi();
		const gameRequestSocket = useGameRequestSocket();

  // Main container for this pane
  const card = document.createElement( "div" );
  card.className = "card shadow-sm";

  // Header (optional)
  const cardHeader = document.createElement( "div" );
  cardHeader.className = "card-header pb-0";

  const nav = document.createElement( "ul" );
  nav.className = "nav nav-tabs card-header-tabs";

  const tabs = [
    { id: "friendsTab", label: "Friends", active: true },
    { id: "requestsTab", label: "Requests" },
    { id: "searchTab", label: "Search" },
    { id: "gameRequestTab", label: "Game Request List" },
  ];

  tabs.forEach( ( tab, idx ) => {
    const li = document.createElement( "li" );
    li.className = "nav-item";

    const button = document.createElement( "button" );
    button.className = `nav-link ${tab.active ? "active" : ""}`;
    button.type = "button";
    button.setAttribute( "data-bs-toggle", "tab" );
    button.setAttribute( "data-bs-target", `#${tab.id}` );
    button.textContent = tab.label;

    li.appendChild( button );
    nav.appendChild( li );
  } );

  const cardBody = document.createElement( "div" );
  cardBody.className = "card-body tab-content";

  // --------------- FRIENDS TAB ---------------
  const friendsPane = document.createElement( "div" );
  friendsPane.className = "tab-pane fade show active";
  friendsPane.id = "friendsTab";
  friendsPane.innerHTML = `
    <h5>Friends</h5>
    <p class="text-muted">List of current friends goes here.</p>
    <ul class="list-group mb-3" id="friendsList"></ul>
    <!-- Example Add Friend Form -->
    <form class="row gx-2 gy-2 align-items-end" id="addFriendForm">
      <div class="col-8">
        <label for="newFriendName" class="form-label">Username</label>
        <input
          type="text"
          id="newFriendName"
          class="form-control"
          placeholder="Friend's username"
          required
        />
      </div>
      <div class="col-4">
        <button type="submit" class="btn btn-primary w-100">Add Friend</button>
      </div>
    </form>
  `;

  populateFriends( friendsPane.querySelector( "#friendsList" ), api );

  const addFriendForm = friendsPane.querySelector( "#addFriendForm" );
  addFriendForm.addEventListener( "submit", async ( e ) => {
    e.preventDefault();
    const input = addFriendForm.querySelector( "#newFriendName" );
    const friendName = input.value.trim();
    if ( !friendName ) return;
    try {
      await api.sendFriendRequest( friendName );
      alert( `Friend request sent to: ${friendName}` );
      input.value = "";
      populateRequests( friendsPane.querySelector( "#requestsList" ), api );
    } catch ( error ) {
      console.error( "Failed to send friend request:", error );
      alert( error );
    }
  } );

  // --------------- REQUESTS TAB ---------------
  const requestsPane = document.createElement( "div" );
  requestsPane.className = "tab-pane fade";
  requestsPane.id = "requestsTab";
  requestsPane.innerHTML = `
    <h5>Pending Friend Requests</h5>
    <p class="text-muted">Accept or decline friend requests here.</p>
    <ul class="list-group" id="requestsList"></ul>
  `;

  populateRequests( requestsPane.querySelector( "#requestsList" ), api );

  const gameRequestsPane = document.createElement( "div" );
  gameRequestsPane.className = "tab-pane fade";
  gameRequestsPane.id = "gameRequestTab";
  gameRequestsPane.innerHTML = `
    <h5>Pending Game Requests</h5>
    <p class="text-muted">Accept or decline game requests here.</p>
    <ul class="list-group" id="gameRequestsList"></ul>
  `;

  populateGameRequests( gameRequestsPane.querySelector( "#gameRequestsList" ), gameRequestSocket );

  // --------------- SEARCH TAB ---------------
  const searchPane = document.createElement( "div" );
  searchPane.className = "tab-pane fade";
  searchPane.id = "searchTab";
  searchPane.innerHTML = `
    <h5>Search Users</h5>
    <form class="row gx-2 gy-2 align-items-end mb-3" id="searchForm">
      <div class="col-9">
        <label for="searchUserInput" class="form-label">Username</label>
        <input
          type="text"
          id="searchUserInput"
          class="form-control"
          placeholder="Enter username"
        />
      </div>
      <div class="col-3">
        <button type="submit" class="btn btn-primary w-100">
          Search
        </button>
      </div>
    </form>
    <ul class="list-group" id="searchResults"></ul>
  `;

  const searchForm = searchPane.querySelector( "#searchForm" );
  searchForm.addEventListener( "submit", async ( event ) => {
    event.preventDefault();
    const input = searchPane.querySelector( "#searchUserInput" );
    const searchKey = input.value.trim();
    if ( !searchKey ) return;

    const resultsList = searchPane.querySelector( "#searchResults" );
    resultsList.innerHTML = "";

    try {
      const res = await api.searchUser( searchKey );
      const found = res?.user_data ?? {};

      if ( !found.username ) {
        const li = document.createElement( "li" );
        li.className = "list-group-item";
        li.textContent = "No results found.";
        resultsList.appendChild( li );
      }

      const li = document.createElement( "li" );
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = found.username;

      const actionsWrapper = document.createElement( "span" );
      actionsWrapper.className = "d-flex gap-2";

      const addBtn = document.createElement( "button" );
      addBtn.className = "btn btn-sm btn-primary";
      addBtn.textContent = "Add Friend";
      addBtn.addEventListener( "click", async () => {
        try {
          await api.sendFriendRequest( found.username );
          alert( `Friend request sent to: ${found.username}` );
        } catch ( error ) {
          console.error( "Error sending friend request:", error );
          alert( "Error sending friend request." );
        }
        populateRequests( friendsPane.querySelector( "#requestsList" ), api );
      } );

      const blockBtn = document.createElement( "button" );
      blockBtn.className = "btn btn-sm btn-outline-warning";
      blockBtn.textContent = "Block";

      blockBtn.addEventListener( "click", async () => {
        try {
          await api.blockUser( found.username );
          blockBtn.textContent = "Unblock";
        } catch ( error ) {
          console.error( "Error blocking user:", error );
          alert( "Error blocking user." );
        }
        populateFriends( friendsPane.querySelector( "#friendsList" ), api );
      } );

      actionsWrapper.append( addBtn, blockBtn );
      li.appendChild( actionsWrapper );
      resultsList.appendChild( li );

      input.value = "";
    } catch ( error ) {
      console.error( "Error searching user:", error );
      alert( "Error searching user." );
    }
  } );

  // (Optional) If you have more tabs, define them similarly (e.g. "Blocked Users")

  // Append tabs to the card
  card.appendChild( cardHeader );
  cardHeader.appendChild( nav );
  card.appendChild( cardBody );

  // Append each tab pane to the .tab-content
  cardBody.appendChild( friendsPane );
  cardBody.appendChild( requestsPane );
  cardBody.appendChild( searchPane );
  cardBody.appendChild( gameRequestsPane );

  // Return the assembled card
  return card;
}

/* 
  ---- EXAMPLE SUB-FUNCTIONS FOR POPULATING LISTS ----
  (You can adapt these to your own API data structures.)
*/

/**
 * Fetch friends & blocked users, then render them in #friendsList with remove/block logic
 */
async function populateFriends( friendsListElement, api ) {
  try {
    const resFriends = await api.getFriendsList(); // e.g. { friends: [ { username: ... }, ... ] }
    const currentFriends = resFriends?.friends ?? [];

    const resBlocked = await api.getBlockedUsersList(); // { "blocked-users": [ { username: ... }, ... ] }
    const blockedUsers = resBlocked?.["blocked-users"] ?? [];
    const blockedUsernames = new Set( blockedUsers.map( ( u ) => u.username ) );

    // Clear old content
    friendsListElement.innerHTML = "";

    // Render each friend
    currentFriends.forEach( ( friend ) => {
      const li = document.createElement( "li" );
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = friend.username;

      const actionsWrapper = document.createElement( "span" );
      actionsWrapper.className = "d-flex gap-2";

      // Remove friend
      const removeBtn = document.createElement( "button" );
      removeBtn.className = "btn btn-sm btn-outline-danger";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener( "click", async () => {
        try {
          await api.declineFriendRequest( friend.username );
          li.remove();
        } catch ( error ) {
          console.error( "Failed to remove friend:", error );
          alert( "Error removing friend." );
        }
      } );

      // Block / Unblock
      const blockBtn = document.createElement( "button" );
      blockBtn.className = "btn btn-sm btn-outline-warning";

      if ( blockedUsernames.has( friend.username ) ) {
        blockBtn.textContent = "Unblock";
        blockBtn.addEventListener( "click", async () => {
          try {
            await api.unblockUser( friend.username );
            blockedUsernames.delete( friend.username );
            blockBtn.textContent = "Block";
          } catch ( err ) {
            console.error( "Failed to unblock user:", err );
            alert( "Error unblocking user." );
          }
        } );
      } else {
        blockBtn.textContent = "Block";
        blockBtn.addEventListener( "click", async () => {
          try {
            await api.blockUser( friend.username );
            blockedUsernames.add( friend.username );
            blockBtn.textContent = "Unblock";
          } catch ( err ) {
            console.error( "Failed to block user:", err );
            alert( "Error blocking user." );
          }
        } );
      }

      actionsWrapper.appendChild( removeBtn );
      actionsWrapper.appendChild( blockBtn );
      li.appendChild( actionsWrapper );

      friendsListElement.appendChild( li );
    } );
  } catch ( err ) {
    console.error( "Error populating friends:", err );
  }
}

/**
 * Fetch pending friend requests (e.g. getAllRequestsList) and display them
 */
async function populateRequests( requestsListElement, api ) {
  try {
    const response = await api.getAllRequestsList();
    // Suppose it returns { pending: [{ username: ... }, ...] }
    const all = response['all-requests'];
    const received_requests = all?.received_requests ?? [];

    requestsListElement.innerHTML = "";

    received_requests.forEach( ( req ) => {
      const li = document.createElement( "li" );
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = req.username;

      const actions = document.createElement( "span" );
      actions.className = "d-flex gap-2";

      // Accept
      const acceptBtn = document.createElement( "button" );
      acceptBtn.className = "btn btn-sm btn-success";
      acceptBtn.textContent = "Accept";
      acceptBtn.addEventListener( "click", async () => {
        try {
          await api.acceptFriendRequest( req.username );
          li.remove();
        } catch ( error ) {
          console.error( "Error accepting request:", error );
          alert( "Error accepting request." );
        }
      } );

      // Decline
      const declineBtn = document.createElement( "button" );
      declineBtn.className = "btn btn-sm btn-outline-danger";
      declineBtn.textContent = "Decline";
      declineBtn.addEventListener( "click", async () => {
        try {
          await api.declineFriendRequest( req.username );
          li.remove();
        } catch ( error ) {
          console.error( "Error declining request:", error );
          alert( "Error declining request." );
        }
      } );

      actions.appendChild( acceptBtn );
      actions.appendChild( declineBtn );
      li.appendChild( actions );
      requestsListElement.appendChild( li );
    } );
  } catch ( error ) {
    console.error( "Error populating requests:", error );
  }
}

async function populateGameRequests( requestsListElement, socket ) {
		const response = await socket.fechGameRequest()

}
