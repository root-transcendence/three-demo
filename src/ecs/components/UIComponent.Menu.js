import UIComponent from "./UIComponent";

export class MenuComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles, props.object );
    this.elements = props.elements;

    this.expectedListeners = () => ({
      click: this.onClick,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
    });
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    this.element = this.createMenuElement();

    this.object.element = this.element;

    const menuElement = this.element

    this.applyStyles( menuElement );

    this.elements.forEach( ( child ) => {
      menuElement.appendChild( child.render() );
    } );

    if ( this.transitionIn ) {
      this.transitionIn( menuElement );
    }

    this.addEventListeners( menuElement, this.expectedListeners() );

    return menuElement;
  }

  createMenuElement() {
    const menuElement = document.createElement( "div" );
    menuElement.id = this.id;
    return menuElement;
  }

  addElement( element ) {
    this.elements.push( element );
  }

  removeElement( element ) {
    this.elements = this.elements?.filter( ( e ) => e !== element );
  }
}
