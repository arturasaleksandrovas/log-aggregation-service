'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WorkersHandler = function (_EventEmitter) {
    _inherits(WorkersHandler, _EventEmitter);

    function WorkersHandler() {
        _classCallCheck(this, WorkersHandler);

        var _this = _possibleConstructorReturn(this, (WorkersHandler.__proto__ || Object.getPrototypeOf(WorkersHandler)).call(this));

        _this.workers = [];
        _this.jobs = [];

        _this.on('addJobToQueue', function (job) {
            return _this.addJobToQueue(job);
        });
        _this.on('process', function () {
            return _this.process();
        });
        return _this;
    }

    _createClass(WorkersHandler, [{
        key: 'addWorker',
        value: function addWorker(worker) {
            this.workers.push({
                id: this.workers.length,
                worker: worker,
                isWorking: false
            });
        }
    }, {
        key: 'addJobToQueue',
        value: function addJobToQueue(job) {
            this.jobs.push(job);

            this.emit('process');
        }
    }, {
        key: 'process',
        value: function process() {
            var _this2 = this;

            //let's check for any free worker availability
            var worker = this._checkForAvailableWorker();

            if (!worker) {
                return false;
            }

            //if there are any workers maybe we have some unprocessed job?
            var job = this._checkForUnprocessedJob();

            if (!job) {
                return;
            }

            worker.isWorking = true;

            worker.worker.send(job.job);

            worker.worker.on('message', function (data) {
                worker.isWorking = false;
                worker.worker.removeAllListeners('message');

                _this2.emit('process');

                if (job.onComplete) {
                    job.onComplete(data);
                }
            });
        }
    }, {
        key: '_checkForAvailableWorker',
        value: function _checkForAvailableWorker() {
            var worker = _lodash2.default.find(this.workers, function (worker) {
                return !worker.isWorking;
            });

            if (!worker) {
                return false;
            }

            return worker;
        }
    }, {
        key: '_checkForUnprocessedJob',
        value: function _checkForUnprocessedJob() {
            if (!this.jobs.length) {
                return false;
            }

            return this.jobs.shift();
        }
    }]);

    return WorkersHandler;
}(_events2.default);

exports.default = WorkersHandler;