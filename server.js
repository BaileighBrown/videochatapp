const express = require('express');
const app = express();
const server = require('http').Server(app) //allows for server to be created using socket.io
const io = require('socket.io')(server)
const { v4: uuidV4 }  = require('uuid')

//setting uo server 
//how we render our views
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/',(re,res)=>{  //route to homepage 
res.redirect(`/${uuidV4()}`) //gives dynamic room link (by random)
})

app.get('/:room',(re,res)=>{ 
    res.render('room, {roomId: req.params.roomId }')
})
server.listen(3001)