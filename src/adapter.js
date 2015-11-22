'use strict';
import Promise from 'bluebird';
import child_process from 'child_process';
import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import Handlers from './handlers';

var spawn = child_process.spawn;
var readDir = Promise.promisify(fs.readdir);

class LogAdapter extends EventEmitter {
  constructor(logDirectory) {
    super();
    this.logDirectory = logDirectory;
    this.gameEventManager = new GameEventManager(this);
    this.handlers = new Handlers(this.gameEventManager);
    this.stream = null;
  }
  start() {
    return readDir(this.logDirectory).then(files => {
      var file = files.pop();
      var child = spawn('tail', ['-f', path.join(this.logDirectory, file)]);
      return child.stdout;
    }).then(stream => {
      this.stream = stream;
      this.stream.on('data', data => {
        var lines = data.toString().split('\n');
        lines.forEach(line => {
          this.handlers.handle(line);
        });
      });
    });
  }
}

export default LogAdapter;
