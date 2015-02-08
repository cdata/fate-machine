class Mainspring {
  constructor () {
    this.exhausted = false;
  }

  drive (handler) {
    if (this.exausted) {
      this.wind();
      return;
    }

    handler();

    window.requestAnimationFrame(() => {
      this.drive(handler);
    });
  }

  wind () {
    this.exhausted = false;
  }

  exaust () {
    this.exhausted = true;
  }
}

export { Mainspring };
