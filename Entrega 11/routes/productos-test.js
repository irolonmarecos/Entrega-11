const express = require('express');
const {Router} = express
const {faker} = require('@faker-js/faker')

const routerProductos = Router()

function generadorProductos (n) {
    const productos = [];
    for (let i = 0; i < n; i++) {
        const _productos = {
            id: i+1,
            nombre: faker.commerce.product(),
            precio: faker.commerce.price(),
            foto: faker.image.abstract()
        }
        productos.push(_productos)
    }
    return productos
}

routerProductos.get("/",(req,res)=>{
    const cant = req.query.cant || 10;
    const productos = generadorProductos(cant);
    res.json(productos)
})

module.exports = routerProductos