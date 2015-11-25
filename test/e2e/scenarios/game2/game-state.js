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
 * Player starts first
 * 1. Mulligan Options
 *  - EX1_310
 *  - EX1_316
 *  - CS2_065
 * 2. Discard EX1_310 from mulligan
 * 3. Confirm, receive FP1_007 from mulligan
 * 4. Mulligan goes into hand
 *  - FP1_007
 *  - EX1_316
 *  - CS2_065
 * 5. Player Turn
 *  - Draw FP1_022
 *  - Play CS2_065
 * 6. Opponent Turn
 *  - Play GAME_005
 *  - Cast CS2_234 -> kills CS2_065
 * 7. PLayer Turn
 *  - Draw CS2_203
 *  - Play FP1_007
 * 8. Opponent Turn
 *  - Cast CS1_130 -> kills FP1_007, creates FP1_007t
 * 9. Player Turn
 *  - Draw EX1_162
 *  - Play EX1_162
 *  - Attack FP1_007t -> 5 dmg to enemy Hero
 * 10. Opponent Turn
 *  - Hero Power CS1h_001 to face
 * 11. Player Turn
 *  - Draw CS2_065
 *  - Play FP1_022
 *  - Attack FP1_007t -> enemy hero 5 damage
 *  - Attack EX1_162 -> enemy hero 2 damage
 * 12. Opponent Turn
 *  - Hero Power CS1h_001 to face
 *  - Play CS2_121
 * 13. Player Turn
 *  - Draw CS2_188
 *  - Play CS2_203, silences CS2_121
 *  - Play CS2_188, +2 attack to CS1h_001
 *  - Attack FP1_022 -> CS2_121 4 damage (CS2_121 die)
 *  - Attack CS1h_001 -> Enemy hero 7 damage
 *  - Attack EX1_162 -> Enemy hero 2 damage
 *  - Hero Power (CS2_056)
 *  - Draw EX1_093
 * 14. Opponent Turn
 *  - Hero Power CS1h_001 -> Face
 *  - Play CS2_127
 * 15. Player Turn
 *  - Draw EX1_316
 *  - Attack FP1_022 -> CS2_127 (4 dmg, dies)
 *  - Cast EX1_316 -> CS1h_001
 *  - Cast EX1_316 -> CS1h_001
 *  - Attack CS1h_001 -> Enemy Hero (13 damage)
 *  - Attack EX1_162 -> Enemy Hero (2 damage)
 * 16. Opponent Dies, Player Wins, Game Over
 */
describe('E2E Test - Game 2', () => {
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
    file = fs.readFileSync(path.join(__dirname, '/game.txt'), 'utf8');
    file.toString().split(/\n/g).forEach(line => {
      handlers.handle(line);
    });
  });
  describe('GameState', () => {
    it ('should indicate the game has started', () => {
      expect(gameEventManager.gameStart).to.have.been.caled;
    });
    it ('should identify the mulligan', () => {
      // discarded during mulligan
      expect(gameEventManager.playerCardDrawn).not.to.have.been.calledWith('EX1_310');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_316');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('CS2_065');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_007');

    });
    it ('should identify when the player has drawn cards', () => {
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_316');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('CS2_065');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_007');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_022');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('CS2_203');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_162');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('CS2_065');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('CS2_188');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_093');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_316');
    })
    // it ('should identify the opponent cards played', () => {
    //   expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_189');
    //   expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_189');
    // });
    // it ('should identify the player cards drawn', () => {
    //   var cardCallGroups = gameEventManager.playerCardDrawn.getCalls().map(call => call.args).reduce((map, args) => {
    //     var cardId = args.pop();
    //     if (!(cardId in map)) {
    //       map[cardId] = [];
    //     }
    //     map[cardId].push(cardId);
    //     return map;
    //   }, {});
    //   expect(cardCallGroups['FP1_007'].length).to.be.eql(1);
    //   expect(cardCallGroups['LOE_023'].length).to.be.eql(1);
    // });
  });
});
