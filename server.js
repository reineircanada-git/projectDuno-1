var express = require('express')
var bodyParser = require('body-parser')
const { Socket } = require('dgram')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')


app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


var dbUrl = 'mongodb+srv://reineir:reineir@cluster0.jkbtl20.mongodb.net/test'

var Message = mongoose.model('Message', {
    name: String,
    message: String,
    motType: String,
    dateAdded: {type: Date, default: Date.now}
})

//gets all the messages from the DB
app.get('/messages', (req, res) => {
    console.log(req)
    Message.find({motType: { $ne: null }},(err, message) => {
        res.send(message)
    }) 

})

//Saves a message to the DB
app.post('/messages', (req, res) => {
    var messages = new Message (req.body)

    messages.save((err) =>{
        if(err){
            console.log(err)
            res.sendStatus(500)
        }

        io.emit('message', req.body)
        res.sendStatus(200)
    })
    
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err)
})

var server = http.listen(process.env.PORT || 3001, () => {
    console.log('server is listening on port ', server.address().port)
})
