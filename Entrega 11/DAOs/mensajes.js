const AlmacenMongo = require('../Utils/conteinerMongo')
const {mensaje} = require('../schema/mensajes');

class MensajeMongo extends AlmacenMongo {
    constructor(){
        super(mensaje);
    }
}

module.exports = MensajeMongo;