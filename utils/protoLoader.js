const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

const getServiceFromProto = (protoPath) => {
    const packageDefinition = protoLoader.loadSync(
        protoPath,
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

    return grpc.loadPackageDefinition(packageDefinition);
}

module.exports = { getServiceFromProto }