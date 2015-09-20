import { Aspect } from '../aspect';

class Children extends Aspect {
  static get type () {
    return 'children';
  }

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
