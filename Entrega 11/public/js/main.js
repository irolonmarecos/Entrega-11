const socket = io()
socket.on('connect', ()=>{
    console.log('Conectado al CHAT del servidor');
})

socket.on('TOTAL_MENSAJES',(msg)=>{
    document.getElementById('chat').innerHTML = ''
    MensajesRecibidos(msg)
})
socket.on('NUEVO_MENSAJE', (msj)=>{
    agregarMsj(msj)
})

function agregarMsj(msg) {
    //console.log(msg);
    document.getElementById("msj-chat").innerHTML += `
        <div>
          <b class="infoMail" style="color: black">${msg.author.id}:</b> 
          <b class="infoMail" style="color: rgb(76, 216, 118)">${msg.author.nombre}:</b> 
          <b class="infoMsj" style="color: black">${msg.text}</b> 

          </hr>
        </div>
    `;
} 

const author = new normalizr.schema.Entity('authors', {});
const mensajes = new normalizr.schema.Entity('mensajes', {
    author: author 
    },{ idAttribute: 'id' })

const MensajesRecibidos =  (msj) => {
    const desnormalizar = normalizr.denormalize(msj.result, [mensajes], msj.entities);
    desnormalizar.forEach(el => {
        return agregarMsj(el)
    }); 

}   

socket.on("porcentaje", (msj, pesoNorm )=>{
    let desnormalizar = normalizr.denormalize(msj.result,[mensajes],msj.entities)
    let pesoDesnormMsjs = JSON.stringify(desnormalizar).length/1024
    let porcentaje = Number(pesoNorm/pesoDesnormMsjs)*100
    let porcentajeFianl = porcentaje.toFixed(2)
    return compresion(porcentajeFianl)
})

function compresion (porc) {
        document.getElementById('compresion').innerHTML+= `
                <h1>Compresion al ${porc}% </h1>
        `
}

function enviarMensaje(){
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const edad = document.getElementById('edad').value;
    const alias = document.getElementById('alias').value;
    const avatar = document.getElementById('avatar').value;
    const email = document.getElementById('email').value;
    const text = document.getElementById('text').value;

    const mensaje = {
        author: {
            id:email,
            nombre:nombre,
            apellido: apellido,
            edad: edad,
            alias: alias,
            avatar: avatar
        },
        text: text
    }
    socket.emit('ENVIAR_MENSAJE', mensaje)
}

function cerrarSesion(){
    window.location.replace("/logout")
}

function registroUsuario(){
    window.location.replace("/signup")
}
function btnAtras(){
    window.location.replace("/login")
}