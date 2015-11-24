# Hearthstone Log Adapter
This is a library that allows you to access live events from your Hearthstone client as a game is played. It behaves as an adapter on the log file and broadcasts events, such as when an opponent card is played, or the playing user draws a card.

### Installation
```
npm install hearthstone-log-adapter
```

### Examples

Starting the log adapter:
```js
var HearthstoneLogAdapter = require('hearthstone-log-adapter');
var logAdapter = new HearthstoneLogAdapter('/path/to/hearthstone/log/directory');
logAdapter.start().then(function (stream) {
  // the stream will emit events that occur real-time in the game
  stream.on('playerCardDrawn', function (card, player) {
    // `card` is the model of the card the `player` drew
  });
  stream.on('opponentCardPlayed', function (card, player) {
    // `card` is the model of the card the `player` played
  });
  stream.on('gameStart', function () {
    // game started
  });
  stream.on('gameEnd', function (winner, loser) {
    // game ended, `winner` and `loser` are player models
  });
});
```
