'use strict';
import GameTag from './constants/game-tag';

class Entity {
  constructor (arg) {
    if (typeof arg === 'object') {
      Object.assign(this, arg);
    } else {
      this.id = arg;
    }
    this.tags = {};
  }
  getController() {
    return this.tags[GameTag.CONTROLLER];
  }
  isOwnedByPlayer() {
    return this.getController() === 1;
  }
  isOwnedByOpponent() {
    return this.getController() === 2;
  }
  updateTag(tag, value) {
    if (tag === GameTag.MULLIGAN_STATE) {
      console.log('mulligan', tag, value);
    }
    this.tags[tag] = value;
  }
  getTag(tag) {
    return this.tags[tag];
  }
  getZone() {
    return this.tags[GameTag.ZONE];
  }
}

export default Entity;
