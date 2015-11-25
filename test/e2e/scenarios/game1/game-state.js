'use strict';
import fs from 'fs';
import path from 'path';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import GameEventManager from '../../../../src/game-event-manager';
import Handlers from '../../../../src/handlers';

/**
 * Game 1 Scenario
 * 1. Mulligan
 *  - FP1_002
 *  - EX1_319
 *  - LOE_029
 *  - FP1_002
 * 2. Take all cards from Mulligan
 * 3. Receive Coin
 * 4. Opponent plays card
 *  - CS2_189 - Battlecry, 1 damage to Player Hero
 * 5. Player draws cards
 *  - FP1_007
 * 6. Player plays card
 *  - EX1_319 - Battlecry, 3 damage to Player Hero
 * 7. Opponent plays card
 *  - CS2_121 - Battlecry, taunt self
 * 8. Opponent attack hero with minion
 *  - CS2_189
 * 9. Player draws card
 *  - LOE_023
 *
 */
describe('E2E Test - Game 1', () => {
  var expect = chai.expect;
  var gameEventManager;
  var handlers;
  before(() => {
    chai.use(sinonChai);
  });
  beforeEach(() => {
    var file;
    gameEventManager = new GameEventManager();
    gameEventManager.opponentCardPlayed = sinon.stub(gameEventManager, 'opponentCardPlayed');
    gameEventManager.playerCardDrawn = sinon.stub(gameEventManager, 'playerCardDrawn');
    gameEventManager.gameStart = sinon.stub(gameEventManager, 'gameStart');
    gameEventManager.playerHero = sinon.stub(gameEventManager, 'playerHero');
    gameEventManager.opponentHero = sinon.stub(gameEventManager, 'opponentHero');
    handlers = new Handlers(gameEventManager);
    file = fs.readFileSync(path.join(__dirname, '/game1.txt'), 'utf8');
    file.toString().split(/\n/g).forEach(line => {
      handlers.handle(line);
    });
  });
  describe('GameState', () => {
    it ('should indicate the game has started', () => {
      expect(gameEventManager.gameStart).to.have.been.caled;
    })
    it ('should identify the player mulligan card drawn', () => {
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_002');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_319');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('LOE_029');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_002');
    })
    it ('should identify the opponent cards played', () => {
      expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_189');
      expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_189');
    });
    it ('should identify the player cards drawn', () => {
      var cardCallGroups = gameEventManager.playerCardDrawn.getCalls().map(call => call.args).reduce((map, args) => {
        var cardId = args.pop();
        if (!(cardId in map)) {
          map[cardId] = [];
        }
        map[cardId].push(cardId);
        return map;
      }, {});
      expect(cardCallGroups['FP1_007'].length).to.be.eql(1);
      expect(cardCallGroups['LOE_023'].length).to.be.eql(1);
    });
  });
});
