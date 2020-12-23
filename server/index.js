const Server = require('./server');
const Publisher = require('./messagePublisher');
const dotenv = require('dotenv')

dotenv.config()

const QUEUE_NAME = 'logs';

(async () => {
    const publisher = new Publisher(QUEUE_NAME);
    await publisher.connect(process.env.RABBIT_MQ_CONNECT_URL);
    const server = new Server(publisher);
    server.start();
    server.startBroadcast();
})()

