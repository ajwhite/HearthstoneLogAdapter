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
  isOwnedByPlayer() {
    return this.player === 2;
  }
  isOwnedByOpponent() {
    return this.player === 1;
  }
  updateTag(tag, value) {
    this.tags[tag] = value;
  }
  getZone() {
    return this.tags[GameTag.ZONE];
  }
}

export default Entity;
