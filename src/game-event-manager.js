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
}

export default GameEventManager;
