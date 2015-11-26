'use strict';
import Promise from 'bluebird';
import child_process from 'child_process';
import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import GameEventManager from './game-event-manager';
import GameInstance from './game';
import Handlers from './handlers';
import Events from './events';

var spawn = child_process.spawn;
var readDir = Promise.promisify(fs.readdir);

class LogAdapter extends EventEmitter {
  constructor(logDirectory) {
    super();
    this.logDirectory = logDirectory;
    this.gameEventManager = new GameEventManager(this);
    this.handlers = new Handlers(this.gameEventManager);
    this.tailProcess = null;
    this.directoryWatcher = null;
  }
  start() {
    return readDir(this.logDirectory).then(files => {
      var file = files.pop();
      this.startTailProcess(path.join(this.logDirectory, file));
      if (!this.directoryWatcher) {
        this.directoryWatcher = chokidar.watch(this.logDirectory, {ignoreInitial: true});
        this.directoryWatcher.on('add', path => this.startTailProcess(path));
      }
    });
  }
  startTailProcess(logfile) {
    if (this.tailProcess) {
      this.tailProcess.kill('SIGHUP');
    }
    this.tailProcess = spawn('tail', ['-f', logfile]);
    this.tailProcess.stdout.on('data', data => {
      var lines = data.toString().split('\n');
      lines.forEach(line => {
        this.handlers.handle(line);
      });
    });
  }
  getGameInstance() {
    return new GameInstance(this.gameEventManager);
  }
}

LogAdapter.Events = Events;

export default LogAdapter;
