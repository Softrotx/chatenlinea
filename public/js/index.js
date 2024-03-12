// JS del lado del cliente (browser)

const socket = io()

// bloquear pantalla de usuario y pedirle username
let username
const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')

Swal.fire({
    title: 'Ingresa un username',
    input: 'text',
    text: 'Debes identificarte para ingresar',
    icon: "success",
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un username valido'
    },
    allowOutsideClick: false
})

    .then(result => {
        username = result.value
        console.log('usuario identificado como: ' + username)
        socket.emit('new-user', username)
    })


chatBox.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        const text = chatBox.value
        //para validar que no esta vacio
        if (text.trim().length > 0) {
            socket.emit('message', { username, text })
            chatBox.value = ""


        }
    }

})


//escuchar los mensajes desde el servidor(y mostrar)
socket.on('message', (data) => {
    const { username, text } = data

    messageLogs.innerHTML += `${username} dice: ${text}<br>`




})

// escuchar los usuarios conectados

socket.on('user-joined', (username) => {

    Swal.fire({
        text: `nuevo usuario conectado: '${username}`,
        toast: true,
        position: 'top-right'


    })
})


