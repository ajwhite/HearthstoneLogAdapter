import Events from './events';
import Cards from './cards';

class GameEventManager {
  constructor(adapter) {
    this.adapter = adapter;
  }
  opponentCardPlayed(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.OPPONENT_CARD, Object.assign({}, card));
    }
  }
  playerCardDrawn(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.PLAYER_CARD, Object.assign({}, card));
    }
  }
  gameStarted() {
    this.adapter.emit(Events.GAME_STARTED);
  }
  playerHero(cardId) {
    var card = Cards.getbyId(cardId);
    if (card) {
      this.adapter.emit(Events.PLAYER_HERO, Object.assign({}, card));
    }
  }
  opponentHero(cardId) {
    var card = Cards.getById(cardId);
    if (card) {
      this.adapter.emit(Events.OPPONENT_HERO, Object.assign({}, card));
    }
  }
}

export default GameEventManager;
