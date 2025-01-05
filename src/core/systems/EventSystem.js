class EventSystem {
  constructor() {
    this.listeners = {};
  }

  on(event, listener) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(listener);
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(listener => listener(data));
  }
}
