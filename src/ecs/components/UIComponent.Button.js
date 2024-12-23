import UIComponent from "./UIComponent";

export class ButtonComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles );
    this.label = props.label;

    this.expectedListeners = {
      click: this.onClick,
      mouseenter: this.onMouseEnter,
      mouseleave: this.onMouseLeave,
    };
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    const buttonElement = document.createElement( "div" );

    this.element = buttonElement;

    buttonElement.id = this.id;
    buttonElement.innerText = this.label;

    this.applyStyles( buttonElement );

    if ( this.transitionIn ) {
      this.transitionIn( buttonElement );
    }

    this.addEventListeners( buttonElement, this.expectedListeners );

    return buttonElement;
  }

}
