import _ from 'lodash';
import redis from 'redis';

const GetFrequencies = {
    run: () => {
        const client = redis.createClient();

        client.get('frequencies', (err, result) => {
            if (!result) {
                result = [];
            }

            if (result.length) {
                result = JSON.parse(result);

                result = _.map(result, (frequency, level) => {
                    return {
                        level,
                        frequency
                    }
                });

                result = _.orderBy(result, ['frequency'], ['desc']);
            }

            process.send(result);
        });
    }
};

export default GetFrequencies;