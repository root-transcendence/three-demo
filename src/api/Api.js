import { createRequestHandler, getCookie } from "./ApiUtils.js";

const BASE_URL = '';

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
    this.#api = createRequestHandler( BASE_URL );
  }

  #getHeaders( csrf = true, auth = true ) {
    const headers = { "Content-Type": "application/json" };
    if ( csrf ) {
      headers['X-CSRFToken'] = getCookie( 'csrftoken' );
    }
    if ( auth ) {
      headers['Authorization'] = `Bearer ${localStorage.getItem( 'access' )}`;
    }
    return headers;
  }


  /****************************************************/
  /*                                                  */
  /*                      Auth                        */
  /*                                                  */
  /****************************************************/

  async register( username, email, password ) {
    return this.#api.post( '/api/users/register/' )
      .withBody( { username, email, password } )
      .withHeaders( this.#getHeaders( true, false ) )
      .send();
  }

  /**
   * 
   * @param {string} username 
   * @param {string} password 
   *
   */
  async login( username, password ) {
    return this.#api.post( '/api/users/login/' )
      .withBody( { username, password } )
      .withHeaders( this.#getHeaders( true, false ) )
      .send();
  }

  async logout() {
    throw new Error( 'Not implemented' );
  }

  async oAuthLogin( code, provider = 42 ) {
    return this.#api.post( `/api/users/login${provider}/` )
      .withBody( { code } )
      .withHeaders( this.#getHeaders( true, false ) )
      .send();
  }

  async set2FA( state ) {
    return this.#api.post( '/api/users/setTwoFactor/' )
      .withHeaders( this.#getHeaders() )
      .withBody( { enable_2fa: state } )
      .send();
  }

  async get2FAQR() {
    return this.#api.get( '/api/users/getQrCodeImage/' )
      .withHeaders( this.#getHeaders( false ) )
      .send();
  }

  async verify2FA( code ) {
    return this.#api.post( '/api/users/verifyTwoFactor/' )
      .withHeaders( this.#getHeaders() )
      .withBody( { code } )
      .send();
  }

  async verifyAccessToken() {
    const headers = this.#getHeaders();
    return this.#api.get( '/api/users/verifyAccessToken/' )
      .withHeaders( headers )
      .withBody( { access_token: headers['Authorization'] } )
      .send();
  }

  /****************************************************/
  /*                                                  */
  /*                     Profile                      */
  /*                                                  */
  /****************************************************/

  async getProfile() {
    return this.#api.get( '/api/users/profile/' )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /**
   * 
   * @param {string | undefined} searchKey 
   * @returns 
   */
  async searchUser( searchKey ) {
    return this.#api.post( "/api/users/search/" )
      .withHeaders( this.#getHeaders() )
      .withBody( { username: searchKey?.trim() } )
      .send();
  }

  async getUserBio() {
    return this.#api.get( "/api/users/user-bio/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async updateUserBio( bio ) {
    return this.#api.post( "/api/users/update-bio/" )
      .withHeaders( this.#getHeaders() )
      .withBody( { bio } )
      .send();
  }

  async uploadProfilePicture( file ) {
    const formData = new FormData();
    formData.append( 'profile_picture', file );
    return this.#api.post( "/api/users/upload-profile-picture/" )
      .withHeaders( this.#getHeaders() )
      .withBody( formData )
      .send();
  }


  /****************************************************/
  /*                                                  */
  /*                     Social                       */
  /*                                                  */
  /****************************************************/

  async sendFriendRequest( toUsername ) {
    return this.#api.delete( "/api/social/friend/request/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async cancelFriendRequest( toUsername ) {
    return this.#api.delete( "/api/social/friend/cancel/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async acceptFriendRequest( toUsername ) {
    return this.#api.post( "/api/social/friend/accept/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async declineFriendRequest( toUsername ) {
    return this.#api.delete( "/api/social/friend/decline/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async blockUser( toUsername ) {
    return this.#api.post( "/api/social/block/block/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async unblockUser( toUsername ) {
    return this.#api.delete( "/api/social/block/unblock/" )
      .withBody( { target_name: toUsername } )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  /* Lists */

  async getFriendsList() {
    return this.#api.get( "/api/social/friend/list-friends/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }

  async getBlockedUsersList() {
    return this.#api.get( "/api/social/block/blocked-users/" )
      .withHeaders( this.#getHeaders() )
      .send();
  }
}

( async function () {
  const response = await fetch( `${BASE_URL}/api/users/get-csrf-token/`, {
    method: 'GET',
    credentials: 'include'
  } );
  if ( !response.ok ) {
    const error = await response.text();
    throw new Error( `HTTP Error: ${response.status} - ${error}` );
  }
  return response.json();
} )()

function csrfSafeMethod( method ) {
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test( method );
}
