
var exporting = {};

exporting.plugin = require('./lib/priority');

exporting.patchSocket = function (sock) {
  sock.usePriority = function () {
    this.use(exporting.plugin({fallback : this.enqueue}));
  }
  sock.usePriority();
}

module.exports = exports = exporting;
