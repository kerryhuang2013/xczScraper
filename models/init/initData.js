const Chaodai = require('../chaodai.js').Chaodai;
const CHAODAIS = require('../chaodai.js').CHAODAIS;

function initChaodai() {
    CHAODAIS.forEach((CHAODAI) => {
        var chaodai = new Chaodai({name: CHAODAI});
        chaodai.save((err) => {if (err) {console.log(err)}});
    })
}

function initData() {
    initChaodai();
}

module.exports = initData;
