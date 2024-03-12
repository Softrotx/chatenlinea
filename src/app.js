const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')

const viewsRouter = require('./routes/views.router')

const app = express()

// configurar handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static(`${__dirname}/../public`))
app.use('/', viewsRouter)

const httpServer = app.listen(8080, () => {
    console.log('Servidor listo!')
})

// crear un servidor para WS
const io = new Server(httpServer)

const menssageLogs = []

io.on('connection', clientSocket => {
    console.log(`Nuevo cliente conectado => ${clientSocket.id}`)

    clientSocket.on('message', (data) => {
        menssageLogs.push(data)
        io.emit('message', data)
        console.log(menssageLogs)

    })
    for (const message of menssageLogs) {
        clientSocket.emit('message', message)

    }

})

io.on('new-user', username => {

    clientSocket.broad.emit('user-joined', username)
    console.log(username)

})
