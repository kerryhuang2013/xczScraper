const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//作者
const ZuozheSchema = new Schema({
    name: {type: String},                           //姓名
    shengnian: {type: String},                      //生年
    zunian: {type: String},                         //卒年
    chaodai: {type: String},                        //朝代
    baiduWiki: {type: String},                      //百度文库url
    jianjie: {type: String},                        //简介
    zuopinCount: {type: Number},                   //作品数量
    shiCount: {type: Number},                      //诗数量
    ciCount: {type: Number},                       //词数量
    quCount: {type: Number},                       //曲数量
    fuCount: {type: Number},                       //赋数量
    wenCount: {type: Number},                      //文数量
    refId: {type: String, unique: true}             //reference ID
});

module.exports = mongoose.model('Zuozhe', ZuozheSchema);