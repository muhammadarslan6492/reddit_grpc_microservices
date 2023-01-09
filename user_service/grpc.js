const grpc = require('@grpc/grpc-js');
const PROTO_PATH = __dirname + '/protos/user.proto';
const { connect } = require('./db/index');

const server = new grpc.Server();

exports.startGrpcServer = function () {
  server.bindAsync(
    '127.0.0.1:50050',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.log({ error: err.message });
      } else {
        connect();
        server.start();
        console.log(`server running on 127.0.0.1:${port}`);
      }
    }
  );
};

exports.getGrpcServer = function () {
  return server;
};
