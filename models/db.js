const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost/Poetry';

mongoose.connect(MONGO_URL);
mongoose.connection.on('connected', () => console.log('Mongoose connection open to ' + MONGO_URL));
mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose connection disconnected'));

module.exports = mongoose;