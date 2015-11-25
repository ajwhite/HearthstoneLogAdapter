'use strict';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import GameEventManager from '../../../src/game-event-manager';
import PowerHandler from '../../../src/handlers/power';
import EVENTS from '../../../src/events';

describe('Handlers: Power', () => {
  var {
    expect,
    assert
  } = chai;
  var powerHandler;
  var gameEventManager;

  before(() => {
    chai.use(sinonChai);
  });

  beforeEach(() => {
    gameEventManager = sinon.stub(sinon.create(GameEventManager.prototype));
    powerHandler = new PowerHandler(gameEventManager);
  });

  describe('event handlers', function () {
    it ('should detect ranked mode', function () {
      powerHandler.handle('[Power] CREATE_GAME');
      expect(gameEventManager.gameStart).to.have.been.called;
    });
  });
});
