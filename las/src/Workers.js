import Log from './workers/log.worker';
import GetMessages from './workers/get-messages.worker';
import GetFrequencies from './workers/get-frequencies.worker';

const TASKS = {
    Log: 'Log',
    GetMessages: 'GetMessages',
    GetFrequencies: 'GetFrequencies'
};

export default{
    start: (cluster) => {
        process.on('message', function(task) {
            console.log('Working on process with id', cluster.worker.id);

            switch (task.name) {
                case TASKS.Log:
                    Log.run(task.data);
                    break;
                case TASKS.GetMessages:
                    GetMessages.run();
                    break;
                case TASKS.GetFrequencies:
                    GetFrequencies.run();
                    break;
            }
        });
    }
};