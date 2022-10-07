const express = require('express');

const {Server:SocketServer} = require('socket.io')
const {Server:HTTPServer} = require('http');

const app = express();
const handlebars = require('express-handlebars');
const events = require('./public/js/sockets_events');
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);
const routerProductos = require('./routes/productos-test')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./schema/user')
const {hashPassword, comparePassword} = require('./Utils/bcrypt')
const {Types} = require('mongoose')


const auth = require('./middleware/auth')
const {mensaje} = require('./schema/mensajes')
const MensajeMongo = require('./DAOs/mensajes')
const nvoMsj = new MensajeMongo
const connection = require('./dataBase');
const Usuario = require('./schema/user');
connection()



passport.use('login',  new LocalStrategy(async(username, password, done)=>{
    try{
        const user = await Usuario.findOne({username})
        console.log(user);
        if(!user || !comparePassword(user,password)){
            console.log(comparePassword(user,password));
            return done(null,false,{mensaje:'Usuario no encontrado'})
        } else{
            return done(null, user)
        }
    
    }catch(err){
        done(err)
    }
}))



console.log(Usuario);


passport.use('signup', new LocalStrategy({
    passReqToCallback:true
}, async (req,username,password,done)=>{
    const user = await Usuario.findOne({username})
    const confirmPass = req.body.confirmPassword
    console.log(confirmPass);
    console.log(password);
    if(user){
        return done(null, false, {mensaje:' Usuario ya existe'})
    }else if(password !== confirmPass){
        return done(null, false, {mensaje:' Contraseña no Coincide'})
    }
    const hashedPassword = hashPassword(password);
    const newUser = new User({ username, password: hashedPassword});
    console.log(newUser);
    await newUser.save();   
    return done(null, newUser);
}))

passport.serializeUser((user,done)=>{
    done(null, user._id)
});

passport.deserializeUser(async(id,done)=>{
    id = Types.ObjectId(id);
    const user = await User.findOne(id)
    done(null, user)
})


/* ------------------------------ */

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://ignacio:pass123456@cluster0.cqnie57.mongodb.net/SEGUNDA_PREENTREGA',
        mongoOptions,
        ttl: 600,
        retries: 0
    }),
    secret: "Secret",
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session())

const hbs = handlebars.create({
    extname:'.hbs',
    defaultLayout:'index.hbs',
    layoutsDir: __dirname + '/public/views/layout',
})  

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './public/views');




app.use('/test/productos', routerProductos)


app.get("/", (req, res) => {
    //res.sendFile(__dirname + "/public/login.html");
    const usuario = req.session.user
    //console.log(usuario);
    if(!usuario){
        res.redirect('/login')
    } else{
        res.render('main',{
            usuario: usuario
        })
    } 
    /*     res.render('main',{
        usuario: usuario
    }) */
    
});

app.get("/login",(req, res) => {
   // res.redirect('/')
   res.sendFile(__dirname + "/public/login.html")
});

app.post("/login",passport.authenticate('login',{failureRedirect:'/login'}),(req, res) => {
    // res.redirect('/'
    req.session.user = req.user;
    console.log(123);
    res.redirect('/')

 });

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html")

});
app.post('/signup',passport.authenticate('signup',{failureRedirect: '/signup'}),(req,res)=>{
    res.redirect('/login')

})


app.post("/",  (req,res)=>{
    let usuario = req.body.usuario;
    req.session.usuario = usuario
    if(usuario){
        res.redirect('/login')
    }
})

app.get("/logout", (req,res)=>{
    let usuario = req.session.user
    console.log(req.session.usuario);
    if(usuario){
        req.session.destroy();
        res.render('./partials/logout',{
         usuario: usuario
    })
    }else{
        res.redirect('/')
    }
})


socketServer.on('connection', async(socket)=>{
    const totalMensajes = await nvoMsj.getAll();
    socketServer.emit(events.TOTAL_MENSAJES, totalMensajes)
    socket.on(events.ENVIAR_MENSAJE, async(msg)=>{
        const MENSAJE = new mensaje(msg)
        const result = await nvoMsj.save(MENSAJE)
        console.log(result);
        console.log(msg.author.nombre);
        socketServer.sockets.emit(events.NUEVO_MENSAJE, msg)
    })
    const pesoNormMsjs = JSON.stringify(totalMensajes).length / 1024
    socketServer.sockets.emit('porcentaje', totalMensajes, pesoNormMsjs)
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, ()=>{
    console.log(`El servidor se esta ejecutando en el puerto ${PORT}`);
})