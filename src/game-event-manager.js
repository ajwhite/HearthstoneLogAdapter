import Events from './events';
import Cards from './cards';
import Entity from './entities/entity';
import PlayerEntity from './entities/player';
import GameTag from './constants/game-tag';
import Mulligan from './constants/mulligan';

class GameEventManager {
  constructor(adapter) {
    this.adapter = adapter;
    this.entities = {};
  }
  opponentCardPlayed(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.OPPONENT_CARD, Object.assign({}, card));
    }
  }
  playerCardDrawn(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.PLAYER_CARD, Object.assign({}, card));
    }
  }
  gameStarted() {
    this.adapter.emit(Events.GAME_STARTED);
  }
  playerHero(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.PLAYER_HERO, Object.assign({}, card));
    }
  }
  opponentHero(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.OPPONENT_HERO, Object.assign({}, card));
    }
  }
  addEntityById(id) {
    this.entities[id] = new Entity(id);
    // console.log('adding entity ID', id);
    return this.entities[id];
  }
  addEntity(entity) {
    this.entities[entity.id] = entity;
    // console.log('adding entity object', entity);
    return this.entities[entity.id];
  }
  hasEntity(id) {
    return !!this.entities[id];
  }
  getEntity(id) {
    return this.entities[id];
  }
  safeAddEntity(id) {
    if (!this.entities[id]) {
      this.entities[id] = new Entity(id);
    }
    return this.entities[id];
  }
  getPlayerEntity() {
    return this.getActors().find(entity => {
      return entity.getTag(GameTag.PLAYER_ID) === 1;
    });
  }
  getOpponentEntity() {
    return this.getActors().find(entity=> {
      return entity.getTag(GameTag.PLAYER_ID) === 2;
    });
  }
  getActors() {
    return Object.keys(this.entities).map(key => {
      return this.entities[key];
    }).filter(entity => {
      return entity instanceof PlayerEntity;
    })
  }
  getActor(playerId) {
    return this.getActors().find(actor => {
      return actor.getTag(GameTag.PLAYER_ID) === playerId;
    });
  }
  getActorByName(name) {
    return this.getActors().find(actor => {
      return actor.name === name;
    });
  }
  isMulliganDone() {
    var player = this.getPlayerEntity();
    var opponent = this.getOpponentEntity();

    if (!player || !opponent) {
      return false;
    }

    return player.getTag(GameTag.MULLIGAN_STATE) === Mulligan.DONE &&
           opponent.getTag(GameTag.MULLIGAN_STATE) == Mulligan.DONE;
  }
}

export default GameEventManager;
