var util = require('util');
var http = require('http');
var url  = require('url');

function HttpServerBackend(startupTime, config, emitter) {
    var self = this;
    self.metrics = {}
    self.headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
    emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
};

HttpServerBackend.prototype.flush = function(timestamp, metrics) {
    this.metrics = JSON.parse(JSON.stringify(metrics))
};

HttpServerBackend.prototype.respond = function(res, statusCode, obj) {
    res.writeHead(statusCode, this.headers)
    res.end(JSON.stringify(obj, undefined, 2));
}

HttpServerBackend.prototype.serve = function() {
    var self = this
    http.createServer(function (req, res) {

        if(req.url == '' || req.url == '/') {
            return self.respond(res, 200, self.metrics)
        }

        path = url.parse(req.url.slice(1)).pathname.split('/')
        try {
            if(path.length == 1) {
                metrics = self.metrics[path[0]]
            } else if(path.length == 2) {
                metrics = self.metrics[path[0]][path[1]]
            } else if(path.length == 3) {
                metrics = self.metrics[path[0]][path[1]][path[2]]
            } else {
                return self.respond(res, 404, '')
            }
            return self.respond(res, 200, metrics)
        } catch(e) {
            return self.respond(res, 404, '' + e)
        }
        return self.respond(res, 500, '')
    }).listen(8127);

    return true
};

exports.init = function(startupTime, config, events) {
    return new HttpServerBackend(startupTime, config, events).serve();
};
