const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/academy';
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

const connectDB = async () => {
  conn1 = mongoose.createConnection('mongodb://localhost:27017/academy', options);
  conn2 = mongoose.createConnection('mongodb://localhost:27017/academylog', options);

  console.log(`MongoDB Connected: ${conn1.host}`);
  console.log(`MongoDB Connected: ${conn2.host}`);
};

module.exports = connectDB;

