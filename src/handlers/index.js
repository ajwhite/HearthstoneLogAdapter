'use strict';
import PowerHandler from './power';

class Handlers {
  constructor(gameEventManager) {
    this.handlers = [
      new PowerHandler(gameEventManager)
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
