const mongoose = require('./db.js');
const Schema = mongoose.Schema;
//词牌
const CipaiSchema = new Schema({
    name: {type: String, unique: true}          //词牌名
});

module.exports = mongoose.model('Cipai', CipaiSchema);