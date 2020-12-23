const amqplib = require('amqplib');

class Publisher {
    constructor(queue) {
        this.queue = queue;
    }

    async connect(url) {
        this.connection = await amqplib.connect(url);
        this.channel = await this.connection.createChannel();
        this.channel.assertQueue(this.queue);
    }

    async publish(data) {
        return this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)))
    }

    disconnect() {
        this.connection.close();
    }
}

module.exports = Publisher;