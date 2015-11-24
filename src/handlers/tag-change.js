'use strict';
import GameTag from '../constants/game-tag';
import Zone from '../constants/zone';

class TagChangeHandler {
  constructor(gameEventManager) {
    this.gameEventManager = gameEventManager;
  }
  tagChanged (id, rawTag, rawValue) {
    var previousZone;
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

    if (tag === GameTag.ZONE) {
      // console.log('zone changed from', entity.getZone(), 'to', value, 'for', id, entity.card_id);
    }


    previousZone = entity.getZone();
    entity.updateTag(tag, value);

    if (tag === GameTag.ZONE) {
      switch (previousZone) {

        /**
         * When a card was last in the deck
         */
        case Zone.DECK:
          switch (value) {
            case Zone.HAND:
              if (entity.isOwnedByPlayer() && entity.card_id) {
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
              // player card mulliganed
              // console.log('card mulliganed', entity);
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
    }
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
