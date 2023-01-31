const express = require('express')
const { Router } = express 
const cartRouter = Router() 

const { products, carts } = require('../daos/generalDaos')



//------------POST Carrito
cartRouter.post('/carrito', async (req, res) => {
  carts.newCart({ products: [] })
  res.send('Cart creada')
})


//----------DELETE carrito
cartRouter.delete('/carrito/:id', async (req, res) => {
  const id = req.params.id
  await carts.deleteById(id)
  res.send('Borrado exitoso')
})


//------------GET todos los productos del carrito
cartRouter.get('/carrito/:id/productos', async (req, res) => {
  const products = await carts.getAllItems( req.params.id )
  res.send(products)
})


//---------POST producto en carrito
cartRouter.post('/carrito/:id/productos/:id_prod', async (req, res) => {
  await carts.addItem( req.params.id, req.params.id_prod ) 
  res.send('Producto agregado')
})


//---------DEL producto en carrito
cartRouter.delete('/carrito/:id/productos/:id_prod', async (req, res) => {
  await carts.deleteItem( req.params.id, req.params.id_prod )
  res.send('Producto borrado exitosamente')
})



module.exports = cartRouter