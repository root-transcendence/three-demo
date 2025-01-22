import UIComponent from "./UIComponent.js";

export class LabelComponent extends UIComponent {
  constructor(id, props = {}) {
    super(id, props.styles, props.class, props.object);
    this.text = props.text;
    this.object = props.object;
    this.class = props.class || '';
  }

  render() {
    if (this.element) {
      return this.element;
    }

    const textElement = document.createElement("label");

    this.element = textElement;

    textElement.id = this.id;
    textElement.innerText = this.text;
    if (this.object)
      if (this.object.for)
        textElement.htmlFor = this.object.for;

    // Stil ve sınıf uygulamaları
    this.applyStyles(textElement);
    this.applyClasses(textElement);

    if (this.transitionIn) {
      this.transitionIn(textElement);
    }

    return textElement;
  }
}
