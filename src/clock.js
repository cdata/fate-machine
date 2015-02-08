let mspf = Symbol('mspf', true);

class Clock {
  constructor (fps) {
    this.fps = fps;

    this.stop();
  }

  start () {
    this.lastSplit = this.now;

    return this;
  }

  stop () {
    this.lastSplit = 0;

    return this;
  }

  split () {
    this.lastSplit += this.ticks * this[mspf];
  }

  set fps (fps) {
    this[mspf] = 1000 / fps;
  }

  get fps () {
    return Math.round(1000 / this[mspf]);
  }

  get ticks () {
    return this.time / this[mspf]
  }

  get now () {
    return Date.now();
  }

  get time () {
    return this.now - this.lastSplit;
  }
}

export { Clock }
