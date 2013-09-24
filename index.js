
var exporting = {};

exporting.plugin = require('./lib/priority');

exporting.patchSocket = function (sock) {
  sock.usePlugin = function (plugin) {
    this.use(plugin({fallback : this.enqueue}));
  }
}

module.exports = exports = exporting;
