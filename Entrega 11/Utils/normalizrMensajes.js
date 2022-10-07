const {normalize, schema} = require('normalizr');

const author = new schema.Entity("authors", {})

const mensaje = new schema.Entity("mensajes", {
    author:author
},{idAttribute:"_id"})


const normalizr = (info)=>{
    let totalMensajes = info.map(msg => {
        //console.log(msg._doc);
        return {...msg._doc, _id: msg.author.id}
    })
    const normalizar = normalize(totalMensajes, [mensaje])
    return normalizar

}

module.exports = normalizr