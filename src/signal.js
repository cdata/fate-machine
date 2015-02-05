class Signal {
  constructor () {
    this.handlers = new Map();
  }

  emit (...args) {
    for (let context, handlers of this.handlers) {
      for (let handler of handlers) {
        handler.apply(context, args);
      }
    }
  }

  await (handler, context) {
    context = context || this;

    if (!this.handlers.has(context)) {
      this.handlers.set(context, new Set());
    }

    this.handlers.get(context).add(handler);
  }

  forget (handler, context) {
    var handlers = this.handlers.get(context);

    if (!handlers) {
      return;
    }

    if (handlers.has(handler)) {
      handlers.delete(handler);
    }

    if (handlers.length === 0) {
      this.handlers.delete(context);
    }
  }

  destroy () {
    this.handlers = null;
  }
}

export { Signal };
