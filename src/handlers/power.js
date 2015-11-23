'use strict';
import Handler from './handler';
import Entity from '../entity';

const NAME = 'Power';

var parseEntity = (rawEntity) => {
  var entity = {};
  if (!rawEntity) {
    return null;
  }

  entity.id = /id=(\d+)/.exec(rawEntity);
  entity.name = /name=(\w+)/i.exec(rawEntity);
  entity.zone = /zone=(\w+)/i.exec(rawEntity);
  entity.zonePos = /zonePos=(\d+)/.exec(rawEntity);
  entity.cardId = /cardId=(\w+)/.exec(rawEntity);
  entity.player = /player=(\d+)/.exec(rawEntity);
  entity.type = /type=(\w+)/.exec(rawEntity);

  Object.keys(entity).forEach(function (key) {
    if (entity[key]) {
      entity[key] = entity[key][1];
    }
  });
  return entity;
};

var isEntity = (entityObject) => {
  return Object.keys(entityObject).map(key => {
    return !!entityObject[key];
  }).filter(value => {
    return !!value;
  }).length > 0;
};

class PowerHandler extends Handler {
  constructor (gameEventManager) {
    var filters = [
      {
        pattern: /(CREATE_GAME)/i,
        handle: () => {
          gameEventManager.gameStarted();
        }
      },
      {
        pattern: /GameEntity EntityID=(\d+)/,
        handle: this.onGameEntity.bind(this)
      },
      {
        pattern: /Player EntityID=(\d+) PlayerID=(\d+) GameAccountId=(.+)/,
        handle: this.onGameEntity.bind(this)
      },
      {
        pattern: /TAG_CHANGE Entity=([\w\s]+\w) tag=PLAYER_ID value=(\d)/,
        handle: this.onPlayerName.bind(this)
      },
      {
        pattern: /TAG_CHANGE Entity=(.+) tag=(\w+) value=(\w+)/,
        handle: this.onTagChange.bind(this)
      },
      {
        pattern: /ACTION_START.*Entity=.*id=\d+.*cardId=(\w+).*player=2.*BlockType=POWER.*Target=[^\d].*/i,
        handle: (cardId) => {
          gameEventManager.opponentCardPlayed(cardId);
        }
      },
      {
        pattern: /FULL_ENTITY - Creating ID=(\d+) CardID=(\w*)/i,
        handle: (id, cardId) => {
          gameEventManager.addEntityById(id);
        }
      },
      {
        pattern: /SHOW_ENTITY - Updating Entity=(.+) CardID=(\w*)/i,
        handle: this.onShowEntity.bind(this)
      }
    ];
    super(NAME, filters);
    this.gameEventManager = gameEventManager;
  }
  onGameEntity(id) {
    this.gameEventManager.safeAddEntity(id);
    this.currentEntity = id;
  }
  onPlayerEntity(id) {
    this.gameEventManager.safeAddEntity(id);
    this.currentEntity = id;
  }
  onPlayerName(name, player) {
    console.log('playername', name, player);
  }
  onTagChange(rawEntity, tag, value) {

  }
  onShowEntity(rawEntity, cardId) {
    var entity = parseEntity(rawEntity);
    if (entity && entity.id) {
      if (!gameEventManager.hasEntity(entity.id)) {
        gameEventManager.addEntity(new Entity(entity));
      }
      gameEventManager.entities[entity.id].card_id = cardId;
      console.log('updated entity', gameEventManager.entities[entity.id]);
    }
  }
}

export default PowerHandler;
