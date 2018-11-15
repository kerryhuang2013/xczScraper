const mongoose = require('./db.js');
const Schema = mongoose.Schema;

//作品
const ZuopinSchema = new Schema({
    timu: {type: String},                           //题目 
    cipai: {type: String},                          //词牌   
    zuozhe: {type: String},                         //作者
    leixing: {type: String},                        //类型：诗、词、曲、赋、文
    chaodai: {type: String},                        //朝代
    baiduwiki: {type: String},                      //百度文库url
    fanyi: {type: String},                          //翻译
    pingxi: {type: String},                         //评析
    shangxi: {type: String},                        //赏析
    neirong: {type: String},                        //内容
    jiping: {type: String},                         //辑评
    qianyan: {type: String},                        //前言 
    zhushi: {type: String},                         //注释      
    zuozheId: {type: String},                       //作者reference ID
    refId: {type: String, unique: true}             //作品reference ID
});

module.exports = mongoose.model('Zuopin', ZuopinSchema);
