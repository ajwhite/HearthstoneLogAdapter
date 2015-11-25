import PlayState from './constants/play-state';


function GameInstance (gameEventManager) {
  class Game {
    getPlayer() {
      return gameEventManager.getPlayerEntity();
    }
    getOpponent() {
      return gameEventManager.getOpponentEntity();
    }
    getPlayerCards() {
      return Object.keys(gameEventManager.entities).map(key => {
        return gameEventManager.entities[key];
      }).filter(entity => {
        return !!entity.card_id;
      }).filter(entity => {
        return entity.isCard()
      }).filter(entity => {
        return entity.isOwnedByPlayer()
      });
    }
    getOpponentCards() {
      return Object.keys(gameEventManager.entities).map(key => {
        return gameEventManager.entities[key];
      }).filter(entity => {
        return !!entity.card_id;
      }).filter(entity => {
        return entity.isCard()
      }).filter(entity => {
        return entity.isOwnedByOpponent()
      });
    }
  }

  return new Game();
}

export default GameInstance;
