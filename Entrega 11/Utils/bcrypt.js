const bcrypt = require('bcrypt')

function comparePassword(user,password){
    return bcrypt.compareSync(password, user.password)
}

function hashPassword(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

module.exports = {hashPassword,comparePassword}