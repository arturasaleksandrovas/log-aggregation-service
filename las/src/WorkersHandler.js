import _ from 'lodash';
import EventEmitter from 'events';

class WorkersHandler extends EventEmitter {
    constructor() {
        super();

        this.workers = [];
        this.jobs = [];

        this.on('addJobToQueue', (job) => this.addJobToQueue(job));
        this.on('process', () => this.process());
    }

    addWorker(worker) {
        this.workers.push({
            id: this.workers.length,
            worker: worker,
            isWorking: false
        });
    }

    addJobToQueue(job) {
        this.jobs.push(job);

        this.emit('process');
    }

    process() {
        //let's check for any free worker availability
        const worker = this._checkForAvailableWorker();

        if (!worker) {
            return false;
        }

        //if there are any workers maybe we have some unprocessed job?
        const job = this._checkForUnprocessedJob();

        if (!job) {
            return;
        }

        worker.isWorking = true;

        worker.worker.send(job.job);

        worker.worker.on('message', (data) => {
            worker.isWorking = false;
            worker.worker.removeAllListeners('message');

            this.emit('process');

            if (job.onComplete) {
                job.onComplete(data);
            }
        });
    }

    _checkForAvailableWorker() {
        const worker = _.find(this.workers, (worker) => !worker.isWorking);

        if (!worker) {
            return false;
        }

        return worker;
    }

    _checkForUnprocessedJob() {
        if (!this.jobs.length) {
            return false;
        }

        return this.jobs.shift();
    }
}

export default WorkersHandler;