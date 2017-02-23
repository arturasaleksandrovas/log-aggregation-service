'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _WorkersHandler = require('./WorkersHandler');

var _WorkersHandler2 = _interopRequireDefault(_WorkersHandler);

var _LogAggregationService = require('./LogAggregationService');

var _LogAggregationService2 = _interopRequireDefault(_LogAggregationService);

var _Workers = require('./Workers');

var _Workers2 = _interopRequireDefault(_Workers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_cluster2.default.isMaster) {
    (function () {
        var cpuCount = _os2.default.cpus().length;

        var workersHandler = new _WorkersHandler2.default();

        for (var i = 0; i < cpuCount; i += 1) {
            var worker = _cluster2.default.fork();
            workersHandler.addWorker(worker);
        }

        _cluster2.default.on('online', function (worker) {
            console.log('Worker ' + worker.process.pid + ' is online');
        });

        var las = new _LogAggregationService2.default(workersHandler);
        var app = (0, _express2.default)();

        app.set('port', process.env.PORT || 5000);

        app.use(_bodyParser2.default.urlencoded({
            extended: true
        }));
        app.use(_bodyParser2.default.json());
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        var router = _express2.default.Router();

        router.post('/api/log', function (req, res) {
            var timestamp = req.body.timestamp;
            var message = req.body.message;
            var level = req.body.level;

            switch (level) {
                case 'info':
                    las.info(timestamp, message, res);
                    break;
                case 'warning':
                    las.warning(timestamp, message, res);
                    break;
                case 'error':
                    las.error(timestamp, message, res);
                    break;
                default:
                    res.send('Bad log message severity level!');
            }
        });

        router.get('/api/get-messages', function (req, res) {
            las.getMessages(res);
        });

        router.get('/api/get-frequencies', function (req, res) {
            las.getFrequencies(res);
        });

        app.use(router);

        app.listen(app.get('port'), function () {
            console.log('Server listening on port: ', app.get('port'));
        });
    })();
} else {
    _Workers2.default.start(_cluster2.default);
}