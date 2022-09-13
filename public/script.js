const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host:'/',
    port: 3000
})
const myVideo = document.createElement('video')
myVideo.muted = true //mutes video for ourselves but not for others
const peers = {}

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true,
}).then(stream =>{
addVideoStream(myVideo, stream)

myPeer.on('call', call => { //answer call and send stream
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
    addVideoStream(video, userVideoStream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})
//allow connecteion with other users 
socket.on('user-connected', userId => {
connectToNewUser(userId, stream) //send current video stream to other users
})
})

myPeer.on('open', id=>{
    socket.emit('join-room',ROOM_ID, id)
})
socket.emit('join-room', ROOM_ID, 10)


function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream) //calling and then sending stream
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{//takes in other users video and audio stream
    addVideoStream(video, userVideoStream)
})
call.on('close', () =>{
    video.remove()
})
peers[userId] = call
}

function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}