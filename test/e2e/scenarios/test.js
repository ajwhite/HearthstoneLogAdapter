'use strict';
import fs from 'fs';
import path from 'path';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import GameEventManager from '../../../src/game-event-manager';
import Handlers from '../../../src/handlers';

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
    gameEventManager.gameStarted = sinon.stub(gameEventManager, 'gameStarted');
    gameEventManager.playerHero = sinon.stub(gameEventManager, 'playerHero');
    gameEventManager.opponentHero = sinon.stub(gameEventManager, 'opponentHero');
    handlers = new Handlers(gameEventManager);
    file = fs.readFileSync(path.join(__dirname, '/game1.txt'), 'utf8');
    file.toString().split('\n').forEach(line => {
      handlers.handle(line);
    });
  });
  it ('should identify the opponent cards played', () => {
    expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_189');
    expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_189');
  });
  it ('should identify the player cards drawn', () => {
    expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_007');
    expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('LOE_023');
  });
});
