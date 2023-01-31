/* 
Basándose en los contenedores ya desarrollados (memoria, archivos) desarrollar dos contenedores más (que cumplan con la misma interfaz) que permitan realizar
las operaciones básicas de CRUD en MongoDb (ya sea local o remoto) y en Firebase. Luego, para cada contenedor, crear dos clases derivadas, una para trabajar con Productos,
y otra para trabajar con Carritos.
>>Aspectos a incluir en el entregable: 
1. A las clases derivadas de los contenedores se las conoce como DAOs (Data Access Objects), y pueden ir todas incluidas en una misma carpeta de ‘daos’.
2. En la carpeta de daos, incluir un archivo que importe todas las clases y exporte una instancia de dao de productos y una de dao de carritos, según corresponda.
Esta decisión se tomará en base al valor de una variable de entorno cargada al momento de ejecutar el servidor.
3.Incluir un archivo de configuración (config) que contenga los datos correspondientes para conectarse a las bases de datos o medio de persistencia que corresponda.
>>Opcional:
4. Hacer lo mismo para bases de datos relacionales: MariaDB/SQLite3.
*/

const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')
const productRouter = require('./routes/productRouter')
const cartRouter = require('./routes/cartRouter')

const { products, carts } = require('./daos/generalDaos')


const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)


//-------- middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))



//-------------------------------------------------
//------------------------------------------SOCKET
io.on('connection', async socket => {
  console.log('Nuevo cliente conectado!')

  //------ productos inicial al cliente
  socket.emit('productos', await products.getAll())
  socket.emit('carritos', await carts.getAll())
 
  //------ nuevo producto desde cliente
  socket.on('update', async producto => {
    await products.add( producto )
    io.sockets.emit('productos', await products.getAll())
  })

  //----------------
  socket.on('newCart', async () => {
    socket.emit('carritos', await carts.getAll())
  })
  
})


//--------------------------------------------------
//-------------------- API REST ROUTER

//---- productRouter
app.use('/api', productRouter)

//---- cartRouter
app.use('/api', cartRouter)

//---- error 404
app.use(function(req, res) {
  res.status(404).send({error: -1, descripcion: 'ruta no implementada'})
})


//-----------------------------------------SERVER ON
const PORT = 8080
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))