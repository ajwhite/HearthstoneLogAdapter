'use strict';
import PowerHandler from './power';
import ZoneHandler from './zone';

class Handlers {
  constructor(gameEventManager) {
    this.handlers = [
      new PowerHandler(gameEventManager),
      new ZoneHandler(gameEventManager)
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
