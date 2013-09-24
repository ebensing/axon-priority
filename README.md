Axon-Priority
===============

This is a plugin for the [Axon](https://github.com/visionmedia/axon) socket
module. It create a mode where req/rep sockets will send the next request to
the least busy node instead of always using round robin.

Usage
===============

```
var axon = require('axon');
var axonPriority = require('axon-priority');

var req = axon.socket('req');
axonPriority.patchSocket(req);

// continue to use the socket as you normally would...
```

Tests
===============
`make test`

They take about 30s to a minute to run, so be patient.

Author
==============
* [ebensing](https://github.com/ebensing)
