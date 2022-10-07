const mongoose = require('mongoose')

async function connection (){
    const URIString = "mongodb+srv://ignacio:pass123456@cluster0.cqnie57.mongodb.net/SEGUNDA_PREENTREGA";
    await mongoose.connect(URIString)
}

module.exports = connection