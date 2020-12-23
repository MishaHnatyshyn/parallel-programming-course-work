const grpc = require('@grpc/grpc-js');
const path = require('path');

const { getServiceFromProto } = require('../utils/protoLoader')

const PROTO_PATH = path.join(__dirname, 'server.proto');

class Server {
    constructor(publisher) {
        this.publisher = publisher;
        this.subscribers = [];
        this.server = new grpc.Server();
        const protoDescriptor = getServiceFromProto(PROTO_PATH);
        this.server.addService(protoDescriptor.TimeBroadcaster.service, {
            subscribeToBroadcast: this.subscribeToBroadcast.bind(this)
        })
    }

    start(address = '0.0.0.0:50051') {
        this.server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
            this.server.start();
            console.log('Server has been stated!')
        });
    }

    stopBroadcast() {
        clearInterval(this.interval)
    }

    startBroadcast() {
        this.interval = setInterval(this.broadcast.bind(this), 1000)
    }

    broadcast() {
        const date = Date.now();
        const message = {
            timestamp: date,
            UTCTime: new Date(date).toUTCString()
        }
        this.logMessage(message);

        this.subscribers.forEach((sub) => sub.write(message))
    }

    subscribeToBroadcast(call) {
        call.on('cancelled', () => {
            this.subscribers = this.subscribers.filter(sub => sub !== call);
        })
        this.subscribers.push(call);
    }

    logMessage(data) {
        const listeners = this.subscribers.map(sub => sub.request.name);
        console.log('Listeners: ', listeners.join(', '));
        console.log('Writing from server:, ', JSON.stringify(data))
        const logMessage = {
            listeners,
            data
        }

        this.publisher.publish(logMessage);
    }
}

module.exports = Server;
