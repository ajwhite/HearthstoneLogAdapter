'use strict';
import GameTag from '../constants/game-tag';
import Zone from '../constants/zone';
import PlayState from '../constants/play-state';

class TagChangeHandler {
  constructor(gameEventManager) {
    this.gameEventManager = gameEventManager;
    this.waitController = null;
  }
  tagChanged (id, rawTag, rawValue, recurse) {
    var previousZone;
    var controller;
    var entity = this.gameEventManager.getEntity(id);
    var tag = GameTag[rawTag];
    var value = parseValue(rawValue);
    if (!tag) {
      // console.log('no tag exists for', tag);
      return;
    }

    if (!entity) {
      entity = this.gameEventManager.addEntityById(id);
    }

    previousZone = entity.getZone();
    entity.updateTag(tag, value);

    if (tag === GameTag.ZONE) {
      if (!this.zoneChangeHandler(entity, value, previousZone)) {
        return;
      }
    } else if (tag === GameTag.PLAYSTATE) {
      if (value === PlayState.CONCEDED) {
        console.log('conceded');
      }
      console.log('play state changed', value);
    } else if (tag === GameTag.CURRENT_PLAYER) {
      if (value === 1) {
        this.gameEventManager.turnChange(entity);
      }
    }
    if (this.waitController && !recurse) {
      let id = this.waitController.id;

      this.tagChanged(
        this.waitController.id,
        this.waitController.tag,
        this.waitController.value,
        true
      );
      this.waitController = null;
    }
  }
  zoneChangeHandler(entity, value, previousZone) {
    var controller = entity.getController();
    if ((value === Zone.HAND || (value === Zone.PLAY && this.gameEventManager.isMulliganDone())) && !this.waitController) {
      if (!this.gameEventManager.isMulliganDone()) {
        previousZone = Zone.DECK;
      }
      if (!controller) {
        entity.updateTag(GameTag.ZONE, previousZone);
        this.waitController = {
          id: entity.id,
          tag: GameTag.ZONE,
          value: value
        };
        return false;
      }
    }

    switch (previousZone) {

      /**
       * When a card was last in the deck
       */
      case Zone.DECK:
        switch (value) {
          case Zone.HAND:
            if (entity.isOwnedByPlayer() && entity.card_id) {
              // console.log('drawing card', entity.card_id);
              this.gameEventManager.playerCardDrawn(entity.card_id);
            }
            // console.log('Card added from deck to hand', entity);
            // Deck -> Hand
            break;
          case Zone.REMOVEDFROMGAME:
          case Zone.SETASIDE:
            console.log('Joust', entity);
            break;
          case Zone.GRAVEYARD:
            // deck discard
            if (entity.isOwnedByOpponent() && entity.card_id) {
              this.gameEventManager.opponentCardPlayed(entity.card_id);
            }
            // console.log('card discard from deck to graveyard', entity);
            break;
          case Zone.PLAY:
            // card played
            if (entity.isOwnedByOpponent() && entity.card_id) {
              this.gameEventManager.opponentCardPlayed(entity.card_id);
            }
            // console.log('Card played from deck', entity);
            break;
          case Zone.SECRET:
            // card played
            // console.log('secret played from deck', entity);
            break;
        }
        break;


      /**
       * When a card was last in the hand
       */
      case Zone.HAND:
        switch (value) {
          case Zone.PLAY:
            // card played
            if (entity.isOwnedByOpponent() && entity.card_id) {
              this.gameEventManager.opponentCardPlayed(entity.card_id);
            }
            // console.log('card played from hand', entity);
            break;
          case Zone.REMOVEDFROMGAME:
          case Zone.GRAVEYARD:
            // card discarded
            if (entity.isOwnedByOpponent() && entity.card_id) {
              this.gameEventManager.opponentCardPlayed(entity.card_id);
            }
            // console.log('card discarded from hand', entity);
            break;
          case Zone.SECRET:
            // player plays a secret
            // console.log('secret played from hand', entity);
            break;
          case Zone.DECK:
            // console.log('mulliganed', entity);
            // player card mulliganed
            break;
        }
        break;

      /**
       * When a card was last on the board
       */
      case Zone.PLAY:
        switch (value) {
          case Zone.HAND:
            // card returned to hand
            // console.log('card in play returned to hand', entity);
            break;
          case Zone.DECK:
            // card returned to deck
            // console.log('card in play returned to deck', entity);
            break;
          case Zone.GRAVEYARD:
            // card died
            // console.log('card in play killed', entity);
            break;
        }
        break;

    }
    return true;
  }
  getTagValue(tag, rawValue) {
    if (tag === GameTag.ZONE) {
      return Zone[rawValue];
    } else if (tag === GameTag.MULLIGAN_STATE) {

    } else if (tag === GameTag.PLAYSTATE) {

    } else if (tag === GameTag.CARDTYPE) {

    } else if (!isNaN(rawValue)) {
      return parseInt(rawValue);
    } else {
      return 0;
    }
  }
}

function parseValue(value) {
  if (!isNaN(value)) {
    return parseInt(value);
  }
  return value;
}

export default TagChangeHandler;
