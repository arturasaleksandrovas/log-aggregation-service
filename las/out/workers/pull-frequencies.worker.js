'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pullFrequenciesWorker = {
    run: function run() {
        var client = _redis2.default.createClient();

        client.get('frequencies', function (err, result) {
            if (!result) {
                result = {};
            }

            process.send(result);
        });
    }
};

exports.default = pullFrequenciesWorker;