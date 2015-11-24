'use strict';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import GameEventManager from '../../../src/game-event-manager';
import ZoneHandler from '../../../src/handlers/zone';

describe('Handlers: Zone', () => {
  var expect = chai.expect;
  var zoneHandler;
  var gameEventManager;

  before(() => {
    chai.use(sinonChai);
  });

  beforeEach(() => {
    gameEventManager = sinon.stub(sinon.create(GameEventManager.prototype));
    zoneHandler = new ZoneHandler(gameEventManager);
  });

  describe('event handlers', function () {
    it ('should detect the player hero', function () {
      zoneHandler.handle("2015-11-21 23:14:29.313: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Gul'dan id=64 zone=PLAY zonePos=0 cardId=HERO_07 player=1] to FRIENDLY PLAY (Hero)");
      expect(gameEventManager.playerHero).to.have.been.calledWith('HERO_07');
    });
    it ('should detect the enemy hero', function () {
      zoneHandler.handle("2015-11-21 23:14:29.338: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Anduin Wrynn id=66 zone=PLAY zonePos=0 cardId=HERO_09 player=2] to OPPOSING PLAY (Hero)");
      expect(gameEventManager.opponentHero).to.have.been.calledWith('HERO_09');
    });
    return;
    it ('should detect a card added to the hand', function () {
      zoneHandler.handle("2015-11-21 00:55:27.503: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Power Overwhelming id=56 zone=HAND zonePos=0 cardId=EX1_316 player=2] to FRIENDLY HAND");
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('EX1_316');

      zoneHandler.handle('2015-11-21 01:19:00.112: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Abusive Sergeant id=27 zone=HAND zonePos=0 cardId=CS2_188 player=1] to FRIENDLY HAND');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('CS2_188');

      zoneHandler.handle('2015-11-21 01:37:59.269: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Jeweled Scarab id=25 zone=HAND zonePos=0 cardId=LOE_029 player=1] to FRIENDLY HAND');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('LOE_029');

      zoneHandler.handle('2015-11-21 02:08:50.031: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Haunted Creeper id=85 zone=HAND zonePos=0 cardId=FP1_002 player=2] to FRIENDLY HAND');
      expect(gameEventManager.playerCardDrawn).to.have.been.calledWith('FP1_002');
    });
    it ('should detect when an opponent plays a card', function () {
      zoneHandler.handle('2015-11-21 01:40:11.198: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Silverback Patriarch id=61 zone=PLAY zonePos=5 cardId=CS2_127 player=2] to OPPOSING PLAY');
      expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_127');

      zoneHandler.handle('2015-11-21 01:59:34.165: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Chillwind Yeti id=45 zone=PLAY zonePos=5 cardId=CS2_182 player=2] to OPPOSING PLAY');
      expect(gameEventManager.opponentCardPlayed).to.have.been.calledWith('CS2_182')
    });
    it ('should ignore opponent hero powers', function () {
      zoneHandler.handle('2015-11-21 02:11:10.322: [Zone] ZoneChangeList.ProcessChanges() - TRANSITIONING card [name=Lesser Heal id=67 zone=PLAY zonePos=0 cardId=CS1h_001 player=2] to OPPOSING PLAY (Hero Power)');
      expect(gameEventManager.opponentCardPlayed).not.to.have.been.called;
    });
  });
});
