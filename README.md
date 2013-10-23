# gossipmonger-tcp-transport

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/gossipmonger-tcp-transport.png)](http://npmjs.org/package/gossipmonger-tcp-transport)

TCP Transport for [Gossipmonger](https://github.com/tristanls/gossipmonger) (an implementation of the Scuttlebutt gossip protocol endpoint for real-time peer-to-peer replication).

## Usage

```javascript
var GossipmongerTcpTransport = require('gossipmonger-tcp-transport');
var transport = new GossipmongerTcpTransport();

transport.on('deltas', function (remotePeer, deltas) {
    // process deltas
});

transport.on('digest', function (remotePeer, digest) {
    // process digest
});

transport.on('error', function (error) {
    // process the error
    // if error handler is not registered if an error occurs it will be thrown
});

transport.listen();
```

## Tests

    npm test

## Overview

TCP Transport for [Gossipmonger](https://github.com/tristanls/node-gossipmonger).

## Documentation

### TcpTransport

**Public API**

  * [TcpTransport.listen(options, \[callback\])](#tcptransportlistenoptions-callback)
  * [new TcpTransport(options)](#new-tcptransportoptions)
  * [tcpTransport.close(\[callback\])](#tcptransportclosecallback)
  * [tcpTransport.deltas(remotePeer, localPeer, deltasToSend)](#tcptransportdeltasremotepeer-localpeer-deltastosend)
  * [tcpTransport.digest(remotePeer, localPeer, digestToSend)](#tcptransportdigestremotepeer-localpeer-digesttosend)
  * [tcpTransport.listen(\[options\],\[callback\])](#tcptransportlistenoptions-callback-1)
  * [Event 'deltas'](#event-deltas)
  * [Event 'digest'](#event-digest)
  * [Event 'error'](#event-error)

### TcpTransport.listen(options, [callback])

  * `options`: See `new TcpTransport(options)` `options`.
  * `callback`: See `tcpTransport.listen(callback)` `callback`.
  * Return: _Object_ An instance of TcpTransport with server listening on host and port as specified in options or defaults.

Creates new TCP transport and starts the server.

### new TcpTransport(options)

  * `options`:
    * `host`: _String_ _(Default: 'localhost')_
    * `port`: _Integer_ _(Default: 9742)_ A port value of zero will assign a random port.

Creates a new TCP transport.

### tcpTransport.close([callback])

  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is stopped.

Stops the server from listening to requests from other peers.

### tcpTransport.deltas(remotePeer, localPeer, deltasToSend)

  * `remotePeer`: _Object_ Peer to send rpc to.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `localPeer`: _Object_ Sender peer.
    * `id`: _String_ Sender peer id.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `deltasToSend`: _Any_ Deltas to send.

Sends `deltasToSend` to the `remotePeer`.

### tcpTransport.digest(remotePeer, localPeer, digestToSend)

  * `remotePeer`: _Object_ Peer to send rpc to.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `localPeer`: _Object_ Sender peer.
    * `id`: _String_ Sender peer id.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `digestToSend`: _Any_ Digest to send.

Sends `digestToSend` to the `remotePeer`.

### tcpTransport.listen([options], [callback])

  * `options`: _Object_
    * `host`: _String_ _(Default: as specified on construction)_ Hostname or IP to listen on.
    * `port`: _Integer_ _(Default: as specified on construction)_ Port number to listen on.
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional callback to call once the server is up.

Starts the server to listen to requests from other peers.

### tcpTransport.rpc(remotePeer, payload)

_**CAUTION: reserved for internal use**_

  * `remotePeer`: _Object_ Peer to send rpc to.
    * `transport`: _Object_ TCP transport data.
      * `host`: _String_ Host to connect to.
      * `port`: _Integer_ Port to connect to.
  * `payload`: _String_ or _Object_ Payload is send on the wire. If an _Object_ is provided, it will be `JSON.stringify()`'ed.

An internal common implementation for `tcpTransport.deltas(...)` and `tcpTransport.digest(...)`.

### Event `deltas`

  * `function (remotePeer, deltas) {}`
    * `remotePeer`: _Object_
      * `id`: _String_ Id of the peer.
      * `transport`: _Any_ Any data identifying this peer to the transport mechanism that is required for correct transport operation.    
    * `deltas`: _Any_ Received deltas.

Emitted when TcpTransport receives `deltas` from a peer.

### Event `digest`

  * `function (remotePeer, digest) {}`
    * `remotePeer`: _Object_
      * `id`: _String_ Id of the peer.
      * `transport`: _Any_ Any data identifying this peer to the transport mechanism that is required for correct transport operation.
    * `digest`: _Any_ Received digest.

Emitted when TcpTransport receives `digest` from a peer.

### Event `error`

  * `function (error) {}`
    * `error`: _Object_ An error that occurred.

Emitted when TcpTransport encounters an error. If no handler is registered, an exception will be thrown.