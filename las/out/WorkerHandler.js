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

var WorkerHandler = function (_EventEmitter) {
    _inherits(WorkerHandler, _EventEmitter);

    function WorkerHandler() {
        _classCallCheck(this, WorkerHandler);

        var _this = _possibleConstructorReturn(this, (WorkerHandler.__proto__ || Object.getPrototypeOf(WorkerHandler)).call(this));

        _this.workers = [];
        _this.jobs = [];

        _this.on('setJob', function (job) {
            return _this.setJob(job);
        });
        _this.on('process', function (worker, job) {
            return _this.process(worker, job);
        });
        _this.on('tryProcessJob', _this.tryProcessJob);
        return _this;
    }

    _createClass(WorkerHandler, [{
        key: 'addWorker',
        value: function addWorker(worker) {
            this.workers.push({
                id: this.workers.length,
                worker: worker,
                isWorking: false
            });
        }
    }, {
        key: 'setJob',
        value: function setJob(job) {
            this.jobs.push(job);

            this.emit('tryProcessJob');
        }
    }, {
        key: 'process',
        value: function process(worker, job) {
            var _this2 = this;

            console.log('Working on message with index: ' + JSON.stringify(job.job));

            worker.isWorking = true;

            worker.worker.send(job.job);

            worker.worker.on('message', function (data) {
                worker.isWorking = false;
                worker.worker.removeAllListeners('message');

                _this2.emit('tryProcessJob');

                if (job.onComplete) {
                    job.onComplete(data);
                }
            });
        }
    }, {
        key: 'tryProcessJob',
        value: function tryProcessJob() {
            if (!this.jobs.length) {
                return false;
            }

            var availableWorker = _lodash2.default.find(this.workers, function (worker) {
                return !worker.isWorking;
            });

            if (!availableWorker) {
                return false;
            }

            var nextJob = this.jobs.shift();

            if (availableWorker) {
                this.emit('process', availableWorker, nextJob);
            }

            return true;
        }
    }]);

    return WorkerHandler;
}(_events2.default);

exports.default = WorkerHandler;