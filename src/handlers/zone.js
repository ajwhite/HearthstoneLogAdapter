'use strict';
import Handler from './handler';

const NAME = 'Zone';

class ZoneHandler extends Handler {
  constructor (gameEventManager) {
    var filters = [
      {
        pattern: /ProcessChanges.*TRANSITIONING card \[name=.*zone=PLAY.*cardId=(\w+).*player=\d+\] to FRIENDLY PLAY \(Hero\)/i,
        handle: (cardId) => {
          gameEventManager.playerHero(cardId);
        },
      },
      {
        pattern: /ProcessChanges.*TRANSITIONING card \[name=.*zone=PLAY.*cardId=(\w+).*player=\d+\] to OPPOSING PLAY \(Hero\)/i,
        handle: (cardId) => {
          gameEventManager.opponentHero(cardId);
        }
      }
    ];


    // var filters = [
    //   {
    //     pattern: /TRANSITIONING card.* id=\d+.*cardId=(\w+).*to FRIENDLY HAND/i,
    //     handle: (cardId) => {
    //       gameEventManager.playerCardDrawn(cardId);
    //     }
    //   },
    //   {
    //     pattern: /TRANSITIONING card.* id=\d+.*cardId=(\w+).*to OPPOSING PLAY$/i,
    //     handle: (cardId) => {
    //       gameEventManager.opponentCardPlayed(cardId);
    //     }
    //   }
    // ];
    super(NAME, filters);
  }
}

export default ZoneHandler;
