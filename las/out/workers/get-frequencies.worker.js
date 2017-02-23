'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GetFrequencies = {
    run: function run() {
        var client = _redis2.default.createClient();

        client.get('frequencies', function (err, result) {
            if (!result) {
                result = [];
            }

            if (result.length) {
                result = JSON.parse(result);

                result = _lodash2.default.map(result, function (frequency, level) {
                    return {
                        level: level,
                        frequency: frequency
                    };
                });

                result = _lodash2.default.orderBy(result, ['frequency'], ['desc']);
            }

            process.send(result);
        });
    }
};

exports.default = GetFrequencies;