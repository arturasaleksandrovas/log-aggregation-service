import redis from 'redis';

const Log = {
    run: (data) => {
        const client = redis.createClient();

        const timestamp = data.timestamp;
        const message = data.message;
        const level = data.level;

        const redisMessage = {
            message,
            level,
            timestamp
        };

        client.setex(timestamp, 300, JSON.stringify(redisMessage));

        client.get('frequencies', (error, result) => {
            let frequencies = {};

            if (result) {
                frequencies = JSON.parse(result);
            }

            if (!frequencies[level]) {
                frequencies[level] = 0;
            }

            frequencies[level] = parseInt(frequencies[level]) + 1;

            client.setex('frequencies', 86400, JSON.stringify(frequencies));
        });

        process.send({ timestamp, message, level });
    }
};

export default Log;