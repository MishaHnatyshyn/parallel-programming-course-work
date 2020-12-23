const Client = require('./client');

const [,,name] = process.argv;

const client = new Client(name);
client.connect();
client.subscribeToBroadcast();