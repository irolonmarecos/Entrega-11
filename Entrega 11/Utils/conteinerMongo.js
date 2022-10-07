const normalizr = require('./normalizrMensajes')
class AlmacenMongo{

    constructor(ruta){
        this.ruta = ruta
    }
    async getAll(){
        try{
            const getAll = await this.ruta.find();
            return normalizr(getAll);
        }catch(err){
            console.log(err);
        }
    }
    async getById (id){
        try{
            const getById = await this.ruta.findOne({_id: id});
            return getById;
        } catch(err){
            console.log(err);
        }
    }
    async save(info){
        try{
            const resultado = await info.save();
            return resultado;
    
        }catch(err){
            console.log(err);
        }

    }
    async updateById (id,info){
        try{
            const resultado = this.ruta.findOneAndUpdate(id,info);
            return resultado
        } catch (err){
            console.log(err);
        }
    }
    async deleteById(id){
        try{
            const resultado = await this.ruta.deleteOne({_id: id})
            return resultado
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = AlmacenMongo;