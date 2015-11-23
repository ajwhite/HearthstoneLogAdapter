'use strict';
import Handler from './handler';
import Entity from '../entity';
import TagChangeHandler from './tag-change';
import GameTag from '../constants/game-tag';

const NAME = 'Power';

var parseEntity = (rawEntity) => {
  var entity = {};
  if (!rawEntity) {
    return null;
  }

  entity.id = /id=(\d+)/.exec(rawEntity);
  entity.name = /name=(\w+)/i.exec(rawEntity);
  entity.zone = /zone=(\w+)/i.exec(rawEntity);
  entity.zone_pos = /zonePos=(\d+)/.exec(rawEntity);
  entity.card_id = /cardId=(\w+)/.exec(rawEntity);
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
    super(NAME);
    this.filters = [
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
        pattern: /FULL_ENTITY - Creating ID=(\d+) CardID=(\w*)/i,
        handle: this.onFullEntity.bind(this)
      },
      {
        pattern: /SHOW_ENTITY - Updating Entity=(.+) CardID=(\w*)/i,
        handle: this.onShowEntity.bind(this)
      },
      {
        pattern: /tag=(\w+) value=(\w+)/,
        handle: this.onCurrentEntityTagChange.bind(this)
      },
      {
        pattern: /ACTION_START.*Entity=.*id=\d+.*cardId=(\w+).*player=2.*BlockType=POWER.*Target=[^\d].*/i,
        handle: (cardId) => {
          gameEventManager.opponentCardPlayed(cardId);
        }
      }
    ];

    this.gameEventManager = gameEventManager;
    this.tagChangeHandler = new TagChangeHandler(gameEventManager);
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
    var parsedEntity = parseEntity(rawEntity);
    if (parsedEntity && parsedEntity.id) {
      this.tagChangeHandler.tagChanged(parsedEntity.id, tag, value);
    }
  }
  onCurrentEntityTagChange(tag, value) {
    // console.log('current entity tag changed', this.currentEntity, tag, value);
    // console.log('current entity tag change', this.currentEntity, tag, value);
    if (this.currentEntity) {
      // console.log('triggering tag change');
      this.tagChangeHandler.tagChanged(this.currentEntity, tag, value);
    }
    // console.log('');
  }
  onFullEntity(id, cardId) {
    var entity = this.gameEventManager.safeAddEntity(id);
    entity.card_id = cardId;
    this.currentEntity = entity.id;
  }
  onShowEntity(rawEntity, cardId) {
    var entity = parseEntity(rawEntity);
    // console.log('showEntity', rawEntity);
    if (entity && entity.id) {
      if (!this.gameEventManager.hasEntity(entity.id)) {
        this.gameEventManager.addEntity(new Entity(entity));
      }
      this.gameEventManager.entities[entity.id].card_id = cardId;
      if (entity.zone){
        this.gameEventManager.entities[entity.id].tags[GameTag.ZONE] = entity.zone;
        // console.log('updating card zone', entity.zone);
      }
      // console.log('setting current entity', entity.id);
      // console.log('');
      this.currentEntity = entity.id;
      // console.log('updated entity', this.gameEventManager.entities[entity.id]);
    }
  }
}

export default PowerHandler;
