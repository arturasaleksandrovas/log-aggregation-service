'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Log = {
    run: function run(data) {
        var client = _redis2.default.createClient();

        var timestamp = data.timestamp;
        var message = data.message;
        var level = data.level;

        var redisMessage = {
            message: message,
            level: level,
            timestamp: timestamp
        };

        client.setex(timestamp, 300, JSON.stringify(redisMessage));

        client.get('frequencies', function (error, result) {
            var frequencies = {};

            if (result) {
                frequencies = JSON.parse(result);
            }

            if (!frequencies[level]) {
                frequencies[level] = 0;
            }

            frequencies[level] = parseInt(frequencies[level]) + 1;

            client.setex('frequencies', 86400, JSON.stringify(frequencies));
        });

        process.send({ timestamp: timestamp, message: message, level: level });
    }
};

exports.default = Log;