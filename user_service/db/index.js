const mongoose = require('mongoose');

exports.connect = () => {
  mongoose.set('strictQuery', false);
  mongoose.connect('mongodb://127.0.0.1/grpc_db').then(() => {
    console.log(`Database is connected successfully`);
  });
};
