const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use('/peerjs', peerServer)
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.render('joinRoom')
})

app.post('/join', (req, res) => {
  const roomName = req.body.roomName
  const userName = req.body.userName

  res.redirect(`/chat/${roomName}/${userName}/`)
})

app.get('/chat/:roomName/:userName/', (req, res) => {
  res.render('chat', {
    roomName: req.params.roomName,
    userName: req.params.userName,
  })
})

io.on('connection', (socket) => {
  socket.on('joinroom', (data, id) => {
    console.log(id)
    socket.join(data.roomName)
    socket.to(data.roomName).broadcast.emit('userConnected', data.userName, id)
    socket.on('newMessage', (message, userName) => {
      io.to(data.roomName).emit('createMessage', message, userName)
    })
    socket.on('disconnect', () => {
      io.to(data.roomName).emit(
        'createMessage',
        'left the meeting',
        data.userName
      )
    })
  })
})

server.listen(process.env.PORT || 5000)
