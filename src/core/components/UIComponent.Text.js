import UIComponent from "./UIComponent.js";

export class TextComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles);
    this.text = props.text;
    this.class = props.class || '';
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const textElement = document.createElement("p");

    this.element = textElement;

    textElement.id = this.id;
    textElement.innerText = this.text;

    this.applyStyles(textElement);
    this.applyClasses(textElement);

    if (this.transitionIn) {
      this.transitionIn(textElement);
    }

    return textElement;
  }
}
