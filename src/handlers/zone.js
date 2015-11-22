'use strict';
import Handler from './handler';

const NAME = 'Zone';

class ZoneHandler extends Handler {
  constructor (gameEventManager) {
    var filters = [
      {
        pattern: /TRANSITIONING card.* id=\d+.*cardId=(\w+).*to FRIENDLY HAND/i,
        handle: (cardId) => {
          gameEventManager.playerCardDrawn(cardId);
        }
      }
    ];
    super(NAME, filters);
  }
}

export default ZoneHandler;
