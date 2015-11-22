import cards from './data/cards.json';

export default {
  getById: (cardId) => {
    return Object.keys(cards).map(key => {
      return cards[key];
    }).reduce((flat, current) => {
      return flat.concat(current);
    }, []).find(function (card) {
      return card.id === cardId;
    });
  }
};
