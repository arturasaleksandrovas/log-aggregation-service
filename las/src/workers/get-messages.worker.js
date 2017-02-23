import _ from 'lodash';
import redis from 'redis';

const GetMessages = {
    run: () => {
        const client = redis.createClient();

        client.keys('*', (err, keys) => {
            if (err) return console.log(err);

            const date = new Date();
            const minutes = date.setMinutes(date.getMinutes() - 1);

            const messageKeys = _.filter(keys, (key) => key.indexOf('frequencies') === -1 && parseInt(key) > parseInt(minutes));

            if (!messageKeys.length) {
                process.send([]);
                return;
            }

            client.mget(messageKeys, (err, values) => {
                let result = [];

                _.forEach(values, (value) => {
                    result.push(JSON.parse(value));
                });

                result = _.orderBy(result, ['timestamp'], ['desc']);

                process.send(result);
            });
        });
    }
};

export default GetMessages;