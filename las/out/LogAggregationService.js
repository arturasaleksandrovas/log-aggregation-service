'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogAggregationService = function () {
    function LogAggregationService(workersHandler) {
        var willResponse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, LogAggregationService);

        this.workersHandler = workersHandler;
    }

    _createClass(LogAggregationService, [{
        key: 'info',
        value: function info(timestamp, message) {
            var response = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this._log(timestamp, message, 'info', response);
        }
    }, {
        key: 'warning',
        value: function warning(timestamp, message) {
            var response = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this._log(timestamp, message, 'warning', response);
        }
    }, {
        key: 'error',
        value: function error(timestamp, message) {
            var response = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this._log(timestamp, message, 'error', response);
        }
    }, {
        key: 'getMessages',
        value: function getMessages() {
            var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var job = {
                job: {
                    name: 'GetMessages'
                }
            };

            if (response) {
                job.onComplete = function (result) {
                    response.send(result);
                };
            }

            this.workersHandler.emit('addJobToQueue', job);
        }
    }, {
        key: 'getFrequencies',
        value: function getFrequencies() {
            var response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var job = {
                job: {
                    name: 'GetFrequencies'
                }
            };

            if (response) {
                job.onComplete = function (result) {
                    response.send(result);
                };
            }

            this.workersHandler.emit('addJobToQueue', job);
        }
    }, {
        key: '_log',
        value: function _log(timestamp, message, level) {
            var response = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var job = {
                job: {
                    name: 'Log',
                    data: {
                        timestamp: timestamp,
                        message: message,
                        level: level
                    }
                }
            };

            if (response) {
                job.onComplete = function (result) {
                    response.send(result);
                };
            }

            this.workersHandler.emit('addJobToQueue', job);
        }
    }]);

    return LogAggregationService;
}();

exports.default = LogAggregationService;