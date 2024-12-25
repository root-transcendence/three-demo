import UIComponent from "./UIComponent";

export class DivComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles);
    this.class = props.class || '';
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const textElement = document.createElement("div");

    this.element = textElement;

    textElement.id = this.id;

    // Stil ve sınıf uygulamaları
    this.applyStyles(textElement);
    this.applyClasses(textElement);

    if (this.transitionIn) {
      this.transitionIn(textElement);
    }

    return textElement;
  }
}
