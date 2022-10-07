const {Schema, model} = require('mongoose');

const MensajeSchema = new Schema({
    author:{
        id: {type: String, require:true},
        nombre: {type: String, require:true},
        apellido: {type: String, require:true},
        edad: {type: Number, require:true},
        alias: {type: String, require:true},
        avatar: {type: String, require:true}
    },
    text: {type: String, require:true},

},{timestamps:true});

const mensaje = model ('mensaje', MensajeSchema);

module.exports = {
    mensaje,    
    MensajeSchema
}