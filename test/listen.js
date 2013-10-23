/*

listen.js - gossipmongerTcpTransport.listen() test

The MIT License (MIT)

Copyright (c) 2013 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var net = require('net'),
    TcpTransport = require('../index.js');

var test = module.exports = {};

test['listen() starts a TCP server on localhost:9742 by default'] = function (test) {
    test.expect(1);
    var tcpTransport = new TcpTransport();
    tcpTransport.listen(function () {
        var client = net.connect({host: 'localhost', port: 9742}, function () {
            test.ok(true); // assert connection
            tcpTransport.close(function () {
                test.done();
            });
        });
        client.on('error', function () {
            // catch test connection cut
        });
    });
};

test['listen() starts a TCP server on host:port from options'] = function (test) {
    test.expect(1);
    var tcpTransport = new TcpTransport({host: '127.0.0.1', port: 6744});
    tcpTransport.listen(function () {
        var client = net.connect({host: '127.0.0.1', port: 6744}, function () {
            test.ok(true); // assert connection
            tcpTransport.close(function () {
                test.done();
            });
        });
        client.on('error', function () {
            // catch test connection cut
        });
    });
};

test['listening transport emits `deltas` event when it receives deltas'] = function (test) {
    test.expect(2);
    var localPeer = {id: "local", transport: {host: 'localhost', port: 9742}};
    var remotePeer = {id: "remote", transport: {host: '127.0.0.1', port: 11111}};
    var tcpTransport = new TcpTransport();
    var clientLocalAddress;
    var clientLocalPort;
    tcpTransport.listen(function () {
        var client = net.connect({host: 'localhost', port: 9742}, function () {
            var rpc = {
                deltas: [["remote", "foo", "bar", 3]],
                sender: remotePeer
            };
            clientLocalAddress = client.localAddress;
            clientLocalPort = client.localPort;
            client.end(JSON.stringify(rpc) + '\r\n'); // deltas rpc
        });
        client.on('error', function (error) {
            // catch test connection cut
        });
    });
    tcpTransport.on('deltas', function (rPeer, deltas) {
        remotePeer.transport.host = clientLocalAddress;
        remotePeer.transport.port = clientLocalPort;
        test.deepEqual(rPeer, remotePeer);
        test.deepEqual(deltas, [["remote", "foo", "bar", 3]]);
        tcpTransport.close(function () {
            test.done();
        });
    });
};

test['listening transport emits `digest` event when it receives digest'] = function (test) {
    test.expect(2);
    var localPeer = {id: "local", transport: {host: 'localhost', port: 9742}};
    var remotePeer = {id: "remote", transport: {host: '127.0.0.1', port: 11111}};
    var digestPeer = {
        id: "digest", 
        maxVersionSeen: 17, 
        transport: {host: '127.0.0.1', port: 12222}
    };
    var tcpTransport = new TcpTransport();
    var clientLocalAddress;
    var clientLocalPort;
    tcpTransport.listen(function () {
        var client = net.connect({host: 'localhost', port: 9742}, function () {
            var rpc = {
                digest: [digestPeer],
                sender: remotePeer
            };
            clientLocalAddress = client.localAddress;
            clientLocalPort = client.localPort;            
            client.end(JSON.stringify(rpc) + '\r\n'); // digest rpc
        });
        client.on('error', function (error) {
            // catch test connection cut
        });
    });
    tcpTransport.on('digest', function (rPeer, digest) {
        remotePeer.transport.host = clientLocalAddress;
        remotePeer.transport.port = clientLocalPort;
        test.deepEqual(rPeer, remotePeer);
        test.deepEqual(digest, [digestPeer]);
        tcpTransport.close(function () {
            test.done();
        });
    });
};