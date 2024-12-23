import UIComponent from "./UIComponent";

export class TextComponent extends UIComponent {
  constructor( id, props = {} ) {
    super( id, props.styles );
    this.text = props.text;
  }

  render() {
    if ( this.element ) {
      return this.element;
    }

    const textElement = document.createElement( "span" );

    this.element = textElement;

    textElement.id = this.id;
    textElement.innerText = this.text;

    this.applyStyles( textElement );

    if ( this.transitionIn ) {
      this.transitionIn( textElement );
    }

    return textElement;
  }

}
