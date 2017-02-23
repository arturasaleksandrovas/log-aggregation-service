'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GetMessages = {
    run: function run() {
        var client = _redis2.default.createClient();

        client.keys('*', function (err, keys) {
            if (err) return console.log(err);

            var date = new Date();
            var minutes = date.setMinutes(date.getMinutes() - 1);

            var messageKeys = _lodash2.default.filter(keys, function (key) {
                return key.indexOf('frequencies') === -1 && parseInt(key) > parseInt(minutes);
            });

            if (!messageKeys.length) {
                process.send([]);
                return;
            }

            client.mget(messageKeys, function (err, values) {
                var result = [];

                _lodash2.default.forEach(values, function (value) {
                    result.push(JSON.parse(value));
                });

                result = _lodash2.default.orderBy(result, ['timestamp'], ['desc']);

                process.send(result);
            });
        });
    }
};

exports.default = GetMessages;