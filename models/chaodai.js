const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const CHAODAIS = ['商', '周', '秦', '汉', '三国', '晋', '南北朝', '隋',
                 '唐', '五代十国', '宋', '金', '元', '明', '清', '现代'];
//朝代
const ChaodaiSchema = new Schema({
    name: {type: String, unique: true}        //朝代
});
Chaodai = mongoose.model('Chaodai', ChaodaiSchema);

module.exports ={Chaodai, CHAODAIS};