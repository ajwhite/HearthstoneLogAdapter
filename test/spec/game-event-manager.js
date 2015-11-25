'use strict';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import GameEventManager from '../../src/game-event-manager';
import Adapter from '../../src/adapter';
import Events from '../../src/events';
import Cards from '../../src/cards';

describe('GameEventManager', () => {
  var expect = chai.expect;
  var gameEventManager;
  var adapter;

  before(() => {
    chai.use(sinonChai);
  });

  beforeEach(() => {
    adapter = sinon.stub(sinon.create(Adapter.prototype));
    gameEventManager = new GameEventManager(adapter);
  });

  describe('#opponentCardPlayed', () => {
    it ('should emit that the opponent card was played with the card object', () => {
      var card = Cards.getById('EX1_066');
      gameEventManager.opponentCardPlayed(card.id);
      expect(adapter.emit).to.have.been.calledWith(Events.OPPONENT_CARD, card);
    });
    it ('should not emit an event if the card was not found', () => {
      gameEventManager.opponentCardPlayed('non existant');
      expect(adapter.emit).not.to.have.been.called;
    });
  });
  describe('#playerCardDrawn', () => {
    it ('should emit that the player drew a card with the card object', () => {
      var card = Cards.getById('EX1_006');
      gameEventManager.playerCardDrawn(card.id);
      expect(adapter.emit).to.have.been.calledWith(Events.PLAYER_CARD, card);
    });
    it ('should not emit an event if the card was not found', () => {
      gameEventManager.playerCardDrawn('non existant');
      expect(adapter.emit).not.to.have.been.called;
    });
  });
  describe('#gameStart', () => {
    it ('should emit that the game was started', () => {
      gameEventManager.gameStart();
      expect(adapter.emit).to.have.been.calledWith(Events.GAME_STARTED);
    });
  });
});
