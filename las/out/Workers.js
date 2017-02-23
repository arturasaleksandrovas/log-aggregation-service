'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _log = require('./workers/log.worker');

var _log2 = _interopRequireDefault(_log);

var _getMessages = require('./workers/get-messages.worker');

var _getMessages2 = _interopRequireDefault(_getMessages);

var _getFrequencies = require('./workers/get-frequencies.worker');

var _getFrequencies2 = _interopRequireDefault(_getFrequencies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TASKS = {
    Log: 'Log',
    GetMessages: 'GetMessages',
    GetFrequencies: 'GetFrequencies'
};

exports.default = {
    start: function start(cluster) {
        process.on('message', function (task) {
            console.log('Working on process with id', cluster.worker.id);

            switch (task.name) {
                case TASKS.Log:
                    _log2.default.run(task.data);
                    break;
                case TASKS.GetMessages:
                    _getMessages2.default.run();
                    break;
                case TASKS.GetFrequencies:
                    _getFrequencies2.default.run();
                    break;
            }
        });
    }
};