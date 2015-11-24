'use strict';
import Zone from '../constants/zone';

class Handler {
  constructor(name, filters) {
    this.name = name;
    this.filters = filters;
    this.matcher = new RegExp(`(\\[${this.name}\\])`);
  }

  matches(line) {
    return this.matcher.test(line);
  }

  handle(line) {
    var filter = this.filters.find(filter => {
      return filter.pattern.test(line);
    });
    if (filter) {
      let matches = filter.pattern.exec(line);
      filter.handle.apply(filter.handle, matches.slice(1, matches.length));
    }
  }
}

export default Handler;
