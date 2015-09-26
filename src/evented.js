(function() {
  'use strict';

  const eventListeners = Symbol('eventListeners');

  class Evented {
    constructor() {
      this[eventListeners] = {};
    }

    on(event, handler) {
      this[eventListeners][event] =
        this[eventListeners][event] || [];
    }

    notify(event, ...details) {
      let listeners = this[eventListeners][event];

      if (!listeners) {
        return;
      }

      for (let index = 0; index < listeners.length; ++index) {
        listeners[index](...details);
      }
    }
  }

  window.Evented = Evented;
})();
