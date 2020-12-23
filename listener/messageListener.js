const amqplib = require('amqplib');

class Listener {
    constructor(queue, dbService) {
        this.queue = queue;
        this.dbService = dbService;
    }

    async connect(url) {
        this.connection = await amqplib.connect(url);
        this.channel = await this.connection.createChannel();
        this.channel.assertQueue(this.queue);
    }

    async startConsumingMessages() {
        this.channel.consume(this.queue, (message) => {
            if (message) {
                this.handleMessage(message)
            }
        });
    }

    async handleMessage(message) {
        const messageData = JSON.parse(message.content.toString());
        console.log('Received new message: ');
        console.log(messageData);
        await this.dbService.insert(messageData);
        this.channel.ack(message);
    }
}

module.exports = Listener;