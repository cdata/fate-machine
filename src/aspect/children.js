class Children {
  constructor () {
    this.set = new Set();
  }

  add (child) {
    this.set.add(child);
  }

  remove (child) {
    this.set.remove(child);
  }
}

export { Children };
