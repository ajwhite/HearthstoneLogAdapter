import Events from './events';
import Cards from './cards';
import Entity from './entities/entity';
import PlayerEntity from './entities/player';
import GameTag from './constants/game-tag';
import Mulligan from './constants/mulligan';
import PlayState from './constants/play-state';

class GameEventManager {
  constructor(adapter) {
    this.adapter = adapter;
    this.entities = {};
    this.currentActor = null;
    this.playState = PlayState.INVALID;
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
  gameStart() {
    if (this.playState !== PlayState.PLAYING) {
      this.playState = PlayState.PLAYING;
      this.adapter.emit(Events.GAME_STARTED);
    }
  }
  gameEnd(playState) {
    this.adapter.emit(Events.GAME_ENDED, {outcome: playState});
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
    return this.entities[id];
  }
  addEntity(entity) {
    this.entities[entity.id] = entity;
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
  turnChange(actor) {
    if (!this.currentActor || this.currentActor.id !== actor.id) {
      this.currentActor = actor;
    }
  }
  setPlayState(playState) {
    if (this.playState !== playState) {
      this.playState = playState;
    }
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
