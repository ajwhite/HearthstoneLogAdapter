'use strict';
import fs from 'fs';
import path from 'path';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EventEmitter from 'events';
import GameEventManager from '../../../src/game-event-manager';
import Handlers from '../../../src/handlers';
import Game from '../../../src/game';
import PlayerEntity from '../../../src/entities/player';
import GameTag from '../../../src/constants/game-tag';


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
  var handlers;
  var gameInstance;
  before(() => {
    chai.use(sinonChai);
  });
  beforeEach(() => {
    var file;
    var logAdapter = sinon.stub(sinon.create(EventEmitter.prototype));
    var gameEventManager = new GameEventManager(logAdapter);
    gameInstance = new Game(gameEventManager);
    handlers = new Handlers(gameEventManager);
    file = fs.readFileSync(path.join(__dirname, '/game1.txt'), 'utf8');
    file.toString().split(/\n/g).forEach(line => {
      handlers.handle(line);
    });
  });
  describe('GameInstance', () => {
    it ('should get the player entity', () => {
      var player = gameInstance.getPlayer();
      expect(player instanceof PlayerEntity).to.be.true;
      expect(player.getTag(GameTag.PLAYER_ID)).to.be.eql(1);
    });
    it ('should get the opponent entity', () => {
      var player = gameInstance.getOpponent();
      expect(player instanceof PlayerEntity).to.be.true;
      expect(player.getTag(GameTag.PLAYER_ID)).to.be.eql(2);
    });
    it ('should get the player cards', () => {
      var cards = gameInstance.getPlayerCards();
      var expectedCards = [
        'FP1_002',
        'EX1_319',
        'LOE_029',
        'FP1_002',
        'FP1_007',
        'LOE_023',
        'GAME_005'
      ];

      // find the intersection between expected cards and discovered cards
      // at the end, there should be no cards left on either collection if there is a full intersection
      while (expectedCards.length > 0) {
        let expectedCard = expectedCards.pop();
        let matchedCardIndex = cards.findIndex(card => {
          return card.card_id === expectedCard;
        });
        expect(matchedCardIndex).not.to.be.eql(-1)
        cards.splice(matchedCardIndex, 1);
      }
      expect(cards.length).to.be.eql(0);
      expect(expectedCards.length).to.be.eql(0);
    });
    it ('should get the opponent cards played', () => {
      var cards = gameInstance.getOpponentCards();
      var expectedCards = [
        'CS2_189',
        'CS2_121'
      ];

      // find the intersection between expected cards and discovered cards
      // at the end, there should be no cards left on either collection if there is a full intersection
      while (expectedCards.length > 0) {
        let expectedCard = expectedCards.pop();
        let matchedCardIndex = cards.findIndex(card => {
          return card.card_id === expectedCard;
        });
        expect(matchedCardIndex).not.to.be.eql(-1)
        cards.splice(matchedCardIndex, 1);
      }
      expect(cards.length).to.be.eql(0);
      expect(expectedCards.length).to.be.eql(0);
    });
  });
});
