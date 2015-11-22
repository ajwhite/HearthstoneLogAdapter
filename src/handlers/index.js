'use strict';
import PowerHandler from './power';

class Handlers {
  constructor(adapter) {
    this.handlers = [
      new PowerHandler(adapter)
    ];
  }
  handle(line) {
    this.handlers.filter(handler => {
      return handler.matches(line);
    }).forEach(handler => {
      return handler.handle(line);
    });
  }
}

export default Handlers;
