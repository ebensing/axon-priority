

function applyPlugin(socketObj) {

  // this is going to be a map from number of outstanding requests to a list of
  // indexes into the sock array, which represent the connected clients
  socketObj.priorityMap = {};
  // this is the inverse of the above map
  socketObj.sockMap = {};
  // this is a sorted list of the different levels of outstanding requests
  socketObj.priorities = [];

  // overwrite the send functionality
  socketObj.send = function (msg) {
    var socks = this.socks
      , sock = null
      , index = null,
      , count = null,
      , len = socks.length
      , args = Array.isArray(msg)
        ? msg
        : slice(arguments);

    // time for the priority magic
    // step 1: if these numbers are not equal, then a new socket has connected
    // and not been sent anything. In this case, we should send something to
    // it.
    if (this.priorities.length != len) {
      // the value of n is always the "next" thing we should grab off the end
      // of the list
      sock = this.socks[this.n];
      index = this.n;
      count = 1;
      this.n++;
    } else {
      // we are going to get something that is the least busy, and it will now
      // become "1 more busy"
      count = this.priorities[0].shift();
      count++;

      // get the next index, which will be the first item in the count-1
      // priority list
      index = this.priorityMap[count-1].shift();
      sock = this.socks[index];
    }

    // TODO: make this actually put things in sorted order
    this.priorities.push(count);
    if (this.priorityMap[count] === undefined) {
      this.priorityMap[count] = [];
    }

    this.priorityMap[count].push(index);
    this.sockMap[index] = count;

    if (sock) {
      var hasCallback = 'function' == typeof args[args.length - 1];
      if (!hasCallback) args.push(function(){});
      var fn = args.pop();
      fn.id = this.id();
      this.callbacks[fn.id] = fn;
      args.push(fn.id);
    }

    if (sock) {
      sock.write(this.pack(args));
    } else {
      debug('no connected peers');
      this.enqueue(args);
    }
  }

}
