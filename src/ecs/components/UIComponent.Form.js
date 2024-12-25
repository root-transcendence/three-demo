import UIComponent from "./UIComponent";

export class FormComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles);
    this.class = props.class || '';
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const textElement = document.createElement("form");

    this.element = textElement;

    textElement.id = this.id;

    this.applyStyles(textElement);
    this.applyClasses(textElement);

    if (this.transitionIn) {
      this.transitionIn(textElement);
    }

    return textElement;
  }
}
