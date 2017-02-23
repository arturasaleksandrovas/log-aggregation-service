class LogAggregationService {
    constructor(workersHandler, willResponse = false) {
        this.workersHandler = workersHandler;
    }

    info(timestamp, message, response = false) {
        this._log(timestamp, message, 'info', response);
    }

    warning(timestamp, message, response = false) {
        this._log(timestamp, message, 'warning', response);
    }

    error(timestamp, message, response = false) {
        this._log(timestamp, message, 'error', response);
    }

    getMessages(response = false) {
        const job = {
            job: {
                name: 'GetMessages'
            }
        };

        if (response) {
            job.onComplete = (result) => {
                response.send(result);
            };
        }

        this.workersHandler.emit('addJobToQueue', job);
    }

    getFrequencies(response = false) {
        const job = {
            job: {
                name: 'GetFrequencies'
            }
        };

        if (response) {
            job.onComplete = (result) => {
                response.send(result);
            };
        }

        this.workersHandler.emit('addJobToQueue', job);
    }

    _log(timestamp, message, level, response = false) {
        const job = {
            job: {
                name: 'Log',
                data: {
                    timestamp,
                    message,
                    level
                }
            }
        };

        if (response) {
            job.onComplete = (result) => {
                response.send(result);
            };
        }

        this.workersHandler.emit('addJobToQueue', job);
    }
}

export default LogAggregationService;