'use strict';
import Handler from './handler';
import EVENTS from '../events';

const NAME = 'Power';

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
        pattern: /ACTION_START.*Entity=.*id=\d+.*cardId=(\w+).*player=2.*BlockType=POWER.*Target=[^\d].*/i,
        handle: (cardId) => {
          gameEventManager.opponentCardPlayed(cardId);
        }
      }
    ];
    super(NAME, filters);
    this.gameEventManager = gameEventManager;
  }
}

export default PowerHandler;
