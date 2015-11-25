'use strict';
import GameTag from '../constants/game-tag';
import CardType from '../constants/card-type';

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
    this.tags[tag] = value;
  }
  getTag(tag) {
    return this.tags[tag];
  }
  getZone() {
    return this.tags[GameTag.ZONE];
  }
  isCard() {
    var cardType = this.getTag(GameTag.CARDTYPE);
    return [
      CardType.MINION,
      CardType.WEAPON,
      CardType.ENHANCEMENT,
      CardType.WEAPON,
      CardType.ITEM,
      CardType.SPELL
    ].indexOf(cardType) > -1;
  }
}

export default Entity;
