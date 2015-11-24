import Entity from './entity';
import GameTag from '../constants/game-tag';

class PlayerEntitty extends Entity {
  constructor (entityId, playerId) {
    super(entityId);
    this.name = null;
    this.updateTag(GameTag.PLAYER_ID, playerId);
  }
  setName(name) {
    this.name = name;
  }
}

export default PlayerEntitty;
