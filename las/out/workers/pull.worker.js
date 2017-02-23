'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pullWorker = {
    run: function run() {
        var client = _redis2.default.createClient();

        client.keys('*', function (err, keys) {
            if (err) return console.log(err);

            var messageKeys = _lodash2.default.filter(keys, function (key) {
                return key.indexOf('frequencies') === -1;
            });

            if (!messageKeys.length) {
                process.send([]);
                return;
            }
            client.mget(messageKeys, function (err, values) {
                process.send(values);
            });
        });
    }
};

exports.default = pullWorker;