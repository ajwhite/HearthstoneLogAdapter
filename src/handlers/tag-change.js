'use strict';
import GameTag from '../constants/game-tag';
import Zone from '../constants/zone';

class TagChangeHandler {
  constructor(gameEventManager) {
    this.gameEventManager = gameEventManager;
  }
  tagChanged (id, rawTag, value) {
    var previousZone;
    var entity = this.gameEventManager.getEntity(id);
    var tag = GameTag[tag];
    if (!tag) {
      console.log('no tag exists for', tag);
      return;
    }

    if (!entity) {
      entity = this.gameEventManager.addEntityById(id);
    }
    console.log('tag changed', id, tag, value, entity.cardId);

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
              console.log('Card added from deck to hand');
              // Deck -> Hand
              break;
            case Zone.REMOVEDFROMGAME:
            case Zone.SETASIDE:
              console.log('Joust');
              break;
            case Zone.GRAVEYARD:
              // deck discard
              console.log('card discard from deck to graveyard');
              break;
            case Zone.PLAY:
              // card played
              console.log('Card played from deck');
              break;
            case Zone.SECRET:
              // card played
              console.log('secret played from deck');
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
              console.log('card played from hand');
              break;
            case Zone.REMOVEDFROMGAME:
            case Zone.GRAVEYARD:
              // card discarded
              console.log('card discarded from hand');
              break;
            case Zone.SECRET:
              // player plays a secret
              console.log('secret played from hand');
              break;
            case Zone.DECK:
              // player card mulliganed
              console.log('card mulliganed');
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
              console.log('card in play returned to hand');
              break;
            case Zone.DECK:
              // card returned to deck
              console.log('card in play returned to deck');
              break;
            case Zone.GRAVEYARD:
              // card died
              console.log('card in play killed');
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

export default TagChangeHandler;
