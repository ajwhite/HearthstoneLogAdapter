class Entity {
  constructor (arg) {
    if (typeof arg === 'object') {
      Object.assign(this, arg);
    } else {
      this.id = arg;
    }
  }
  isOwnedByPlayer() {
    return this.player === 2;
  }
  isOwnedByOpponent() {
    return this.player === 1;
  }
}

export default Entity;
