import Component from "../Components";

class UIComponent extends Component {
  constructor( id, styles = {}, object ) {
    super();
    this.id = id;
    this.styles = styles;
    this.object = object;
    this.active = false;
    this.element = null;
  }

  applyStyles( element ) {
    for ( const [key, value] of Object.entries( this.styles ) ) {
      element.style[key] = value;
    }
  }

  addEventListeners( element, expectedListeners ) {
    for ( const [event, handler] of Object.entries( expectedListeners ) ) {
      if ( handler ) {
        element.addEventListener( event, handler );
      }
    }
  }

}

export default UIComponent;