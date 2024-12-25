export class WebSocketManager {

  constructor( url ) {
    this.url = url;
    this.websocket = new WebSocket( url ); // Ensure the URL starts with 'wss://'
    this.websocket.onopen = () => console.log( 'Connected to server via WSS' );
    this.websocket.onmessage = ( event ) => this.onMessage( event );
    this.websocket.onerror = ( event ) => console.error( 'WebSocket error:', event );
    this.websocket.onclose = () => console.log( 'Disconnected from server' );
  }

  get url() { }
  set url( value ) { }

  onMessage( event ) {
    try {
      const serverState = JSON.parse( event.data );
      synchronizationSystem.update( serverState );
      uiSystem.update( serverState );
    } catch ( err ) {
      console.error( 'Error parsing server message:', err );
    }
  }

  send( data ) {
    if ( this.websocket.readyState === WebSocket.OPEN ) {
      this.websocket.send( JSON.stringify( data ) );
    } else {
      console.warn( 'WebSocket is not open. Unable to send data.' );
    }
  }
  reconnect() {
    console.log( 'Attempting to reconnect...' );
    this.websocket = new WebSocket( this.url );
    this.websocket.onopen = () => console.log( 'Reconnected to server via WSS' );
    this.websocket.onmessage = ( event ) => this.onMessage( event );
    this.websocket.onerror = ( event ) => console.error( 'WebSocket error:', event );
    this.websocket.onclose = () => setTimeout( () => this.reconnect(), 5000 ); // Retry after 5 seconds
  }

}
