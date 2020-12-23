const grpc = require('@grpc/grpc-js');
const path = require('path');

const { getServiceFromProto } = require('../utils/protoLoader')

const PROTO_PATH = path.join(__dirname, '..', 'server', 'server.proto');

class Client {
    constructor(name) {
        this.name = name;
        console.log(name)
        this.TimeBroadcaster = getServiceFromProto(PROTO_PATH).TimeBroadcaster;
    }

    connect(address = 'localhost:50051') {
        this.client = new this.TimeBroadcaster(address, grpc.credentials.createInsecure())
    }

    subscribeToBroadcast() {
        this.call = this.client.subscribeToBroadcast({ name: this.name });

        this.call.on('data', (data) => {
            console.log('Client', this.name, 'received message: ', data);
        })
    }
}

module.exports = Client;
