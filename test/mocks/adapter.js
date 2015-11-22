import sinon from 'sinon';

class MockAdapater {
  constructor() {
    this.emit = sinon.stub(this, 'emit');
    this.addListener = sinon.stub(this, 'addListener');
  }
}
