'use strict';
import Handler from './handler';
import Events from '../events';

const NAME = 'Power';
const FILTERS = [
  {
    pattern: /(CREATE_GAME)/i,
    eventName: EVENTS.GAME_STARTED
  },
  {
    pattern: /ACTION_START.*Entity=.*id=(\d+).*cardId=(\w+).*player=2.*BlockType=POWER.*Target=[^\d].*/i,
    eventName: EVENTS.OPPONENT_CARD
  }
];

class PowerHandler extends Handler {
  constructor (adapter) {
    super(adapater, NAME, FILTERS);
  }
}

export default PowerHandler;
