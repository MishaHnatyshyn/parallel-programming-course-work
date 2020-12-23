const Listener = require('./messageListener')
const DatabaseService = require('./database.service')
const dotenv = require('dotenv')

dotenv.config()

const QUEUE_NAME = 'logs';

(async () => {
    const dbService = new DatabaseService();
    await dbService.connect(process.env.MONGO_DB_CONNECT_URL);
    const listener = new Listener(QUEUE_NAME, dbService);
    await listener.connect(process.env.RABBIT_MQ_CONNECT_URL);
    listener.startConsumingMessages();
})()
