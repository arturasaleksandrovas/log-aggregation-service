import express from 'express';
import cluster from 'cluster';
import os from 'os';
import bodyParser from 'body-parser';
import WorkersHandler from './WorkersHandler';
import LogAggregationService from './LogAggregationService';
import Workers from './Workers';

if (cluster.isMaster) {
    const cpuCount = os.cpus().length;

    const workersHandler = new WorkersHandler();

    for (let i = 0; i < cpuCount; i += 1) {
        const worker = cluster.fork();
        workersHandler.addWorker(worker);
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    const las = new LogAggregationService(workersHandler);
    const app = express();

    app.set('port', (process.env.PORT || 5000));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const router = express.Router();

    router.post('/api/log', (req, res) => {
        const timestamp = req.body.timestamp;
        const message = req.body.message;
        const level = req.body.level;

        switch (level) {
            case 'info':
                las.info(timestamp, message, res);
                break;
            case 'warning':
                las.warning(timestamp, message, res);
                break;
            case 'error':
                las.error(timestamp, message, res);
                break;
            default:
                res.send('Bad log message severity level!');
        }

    });

    router.get('/api/get-messages', (req, res) => {
        las.getMessages(res);
    });

    router.get('/api/get-frequencies', (req, res) => {
        las.getFrequencies(res);
    });

    app.use(router);

    app.listen(app.get('port'), () => {
        console.log('Server listening on port: ', app.get('port'));
    });
} else {
    Workers.start(cluster);
}
