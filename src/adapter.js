'use strict';
import Promise from 'bluebird';
import child_process from 'child_process';
import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import Handlers from './handlers';


var spawn = child_process.spawn;
fs = Promise.promisifyAll(fs);

class LogAdapter extends EventEmitter {
  constructor(logDirectory) {
    this.logDirectory = logDirectory;
    this.handlers = new Handlers();
    this.stream = null;
  }
  start() {
    return fs.readdirAsync(this.logDirectory).then(files => {
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
