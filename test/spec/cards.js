'use strict';
import chai from 'chai';
import Cards from '../../src/cards';

describe('Cards', () => {
  var expect = chai.expect;

  describe('#getCardById', () => {
    it ('should get a card by it\'s ID', () => {
      var card = Cards.getById('EX1_066');
      expect(card).to.be.defined;
      expect(card.id).to.be.eql('EX1_066');
    });
    it ('should return `undefined` if a card is not found', () => {
      expect(Cards.getById('does not exist')).not.to.be.defined;
    });
  });
});
