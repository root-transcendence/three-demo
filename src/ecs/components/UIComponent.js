import Component from "../Components";

class UIComponent extends Component {
  constructor(id, styles = {}, object, _class) {
    super();
    this.id = id;
    this.styles = styles;
    this.object = object;
    this.class = _class || ''; // class boşsa, varsayılan olarak boş dize
    this.active = false;
    this.element = null;
  }

  applyStyles(element) {
    if (this.styles) {
      for (const [key, value] of Object.entries(this.styles)) {
        element.style[key] = value;
      }
    }
  }

  applyClasses(element) {
    if (this.class) {
      element.classList.add(this.class); // classList ile sınıf ekleyin
    }
  }

  applyAttributes(element) {
    if (this.object) {
      for (const [key, value] of Object.entries(this.object)) {
        element[key] = value;
      }
    }
  }

  removeEventListener(event) {
    if (this.element && this[event]) {
        this.element.removeEventListener(event, this[event]);
      }
    this[event] = null;
  }

  addEventListener(event, handler) {
    if (this.element && this[event]) {
      this.element.removeEventListener(event, this[event]);
    }
    this[event] = handler;
  }

  addEventListeners(element, expectedListeners) {
    for (const [event, handler] of Object.entries(expectedListeners)) {
      if (handler) {
        element.addEventListener(event, handler);
      }
    }
  }
}

export default UIComponent;
