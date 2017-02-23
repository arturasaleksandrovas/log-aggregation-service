'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _output = require('./output');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//used only for better mocking in tests

var Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);

        this.levels = ['info', 'error', 'warning'];
    }

    _createClass(Logger, [{
        key: 'info',
        value: function info(message) {
            this.log('info', message);
        }
    }, {
        key: 'error',
        value: function error(message) {
            this.log('error', message);
        }
    }, {
        key: 'warning',
        value: function warning(message) {
            this.log('warning', message);
        }
    }, {
        key: 'log',
        value: function log(level, message) {
            if (this.levels.indexOf(level) === -1) {
                return;
            }

            _output2.default.log(level + ': ' + message);
        }
    }]);

    return Logger;
}();

exports.default = new Logger();