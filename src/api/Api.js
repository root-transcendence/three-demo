import { createRequestHandler, getCookie } from "./ApiUtils.js";

const ECOLE42_API_KEY = "u-s4t2ud-0d930db14b6e4ce5c5444d9e4a6ec2a7cbfebd777c72611065425e8de4f96f3d";

let api;

/**
 *
 * @returns {Api}
 */
export const useApi = () => {
  if ( !api ) {
    api = new Api();
  }
  return api;
};

class Api {
  #api;

  constructor() {
    this.#api = createRequestHandler( window.location.origin );
  }

  #getHeaders( csrf = true, auth = true ) {
    const headers = { "Content-Type": "application/json" };
    if ( csrf ) {
      headers["X-CSRFToken"] = getCookie( "csrftoken" );
    }
    if ( auth ) {
      headers["Authorization"] = `Bearer ${localStorage.getItem( "access" )}`;
    }
    return headers;
  }

  /****************************************************/
  /*                                                  */
  /*                      Auth                        */
  /*                                                  */
  /****************************************************/

  async register( username, email, password ) {
    return this.#api
      .post( "/api/users/register/" )
      .withBody( { username, email, password } )
      .withHeaders( this.#getHeaders( true, false ) )
      .send();
  }
  async login( username, password ) {
    return new Promise( async ( resolve, reject ) => {
      const response = await this.#api
        .post( "/api/users/login/" )
        .withBody( { username, password } )
        .withHeaders( this.#getHeaders( true, false ) )
        .send();

      if ( response ) {
        localStorage.setItem( "access", response.access );
        localStorage.setItem( "refresh", response.refresh );
        resolve( response );
      } else {
        reject( response );
      }
    } )
  }

  async refreshToken() {
    return new Promise( async ( resolve, reject ) => {
      const response = await this.#api
        .post( "/api/users/refresh/" )
        .withBody( { refresh: localStorage.getItem( "refresh" ) } )
        .withHeaders( this.#getHeaders( true, false ) )
        .send();

      if ( response ) {
        localStorage.setItem( "access", response.access );
        resolve( response );
      } else {
        reject( response );
      }
    } )
  }

  async logout() {
    return this.#api
      .post( "/api/users/logout/" )
      .withHeaders( this.#getHeaders( true, false ) )
      .send();
  }

  async oAuthLogin( code ) {
    return this.#api
      .post( `/api/users/login42/` )
      .withBody( { code } )
      .withHeaders( this.#getHeaders( true, false ) )
      .send();
  }

  async getCSRFToken() {
    return this.#api
      .get( "/api/users/get-csrf-token/" )
      .withHeaders( this.#getHeaders( false, false ) )
      .send();
  }

  async set2FA( state ) {
    return this.#api
      .post( "/api/users/setTwoFactor/" )
      .withHeaders( this.#getHeaders() )
      .withBody( { enable_2fa: state } )
      .send();
  }

  async get2FAQR() {
    return this.#api
      .get( "/api/users/getQrCodeImage/" )
      .withHeaders( this.#getHeaders( false ) )
      .send();
  }

  async verify2FA( code ) {
    return this.#api
      .post( "/api/users/verifyTwoFactor/" )
      .withHeaders( this.#getHeaders() )
      .withBody( { code } )
      .send();
  }

  async verifyToken() {
    const headers = this.#getHeaders();
    return this.#api
      .post( "/api/users/verifyToken/" )
      .withHeaders( headers )
      .withBody( { access_token: headers["Authorization"]?.split( " " ).pop() } )
      .send();
  }

  /****************************************************/
  /*                                                  */
  /*                     Profile                      */
  /*                                                  */
  /****************************************************/

  async getProfile() {
    return this.#api
      .get( "/api/users/profile/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async searchUser( searchKey ) {
    return this.#api
      .post( "/api/users/search/" )
      .withHeaders( this.#getHeaders() )
      .withBody( { username: searchKey?.trim() } )
      .send();
  }

  async getUserBio() {
    return this.#api
      .get( "/api/users/user-bio/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async updateUserBio( bio ) {
    return this.#api
      .post( "/api/users/update-bio/" )
      .withHeaders( this.#getHeaders() )
      .withBody( { bio } )
      .send();
  }

  async uploadProfilePicture( file ) {
    const formData = new FormData();
    formData.append( "profile_picture", file );
    return this.#api
      .post( "/api/users/upload-profile-picture/" )
      .withHeaders( this.#getHeaders() )
      .withBody( formData )
      .send();
  }

  /****************************************************/
  /*                                                  */
  /*                     Social                       */
  /*                                                  */
  /****************************************************/

  /* Friend */

  async sendFriendRequest( toUsername ) {
    return this.#api
      .post( "/api/social/friend/request/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async acceptFriendRequest( toUsername ) {
    return this.#api
      .patch( "/api/social/friend/accept/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async cancelFriendRequest( toUsername ) {
    return this.#api
      .delete( "/api/social/friend/cancel/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async declineFriendRequest( toUsername ) {
    return this.#api
      .delete( "/api/social/friend/delete/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /* Lists of Friend Requests */
  async getFriendsList() {
    return this.#api
      .get( "/api/social/friend/list-friends/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async getSentRequestsList() {
    return this.#api
      .get( "/api/social/friend/sent-requests/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async getReceivedRequestsList() {
    return this.#api
      .get( "/api/social/friend/received-requests/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async getAllRequestsList() {
    return this.#api
      .get( "/api/social/friend/all-requests/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /* Follow */

  async followUser( toUsername ) {
    return this.#api
      .post( "/api/social/follow/request/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async unfollowUser( toUsername ) {
    return this.#api
      .post( "/api/social/follow/unfollow/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /* Lists of Follows */
  async getFollowingList() {
    return this.#api
      .get( "/api/social/follow/followings/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async getFollowersList() {
    return this.#api
      .get( "/api/social/follow/followers/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /* Block */

  async blockUser( toUsername ) {
    return this.#api
      .post( "/api/social/block/block/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async unblockUser( toUsername ) {
    return this.#api
      .post( "/api/social/block/unblock/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /* Lists of Blocks */
  async getBlockedUsersList() {
    return this.#api
      .get( "/api/social/block/blocked-users/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /****************************************************/
  /*                                                  */
  /*                     Dashboard                    */
  /*                                                  */
  /****************************************************/

  async saveGameData( {
    player1_name,
    player2_name,
    player1_goals,
    player2_goals,
    game_type,
    game_date,
    game_played_time,
  } ) {
    return this.#api
      .post( "/api/dashboard/save-game-data/" )
      .withHeaders( this.#getHeaders() )
      .withBody( {
        player1_name: player1_name,
        player2_name: player2_name,
        player1_goals: player1_goals,
        player2_goals: player2_goals,
        game_type: game_type, // "casual", "tournament"
        game_date: game_date, // "YYYY-MM-DD"
        game_played_time: game_played_time, // 4.5
      } )
      .send();
  }

  async getGameStats( game_id ) {
    return this.#api
      .get( "/api/dashboard/get_game_stats/?game_id=" + game_id )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async getUserProfileStats( username ) {
    return this.#api
      .get( "/api/dashboard/get_user_profile_stats/?username=" + username )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  // TODO: GameRequest 
  // ws/gamerequest/<str:token>/  

}

( async function () {
  const response = await fetch( `/api/users/get-csrf-token/`, {
    method: "GET",
    credentials: "include",
  } );
  if ( !response.ok ) {
    const error = await response.text();
    throw new Error( `HTTP Error: ${response.status} - ${error}` );
  }
  return response.json();
} )();

function csrfSafeMethod( method ) {
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test( method );
}
