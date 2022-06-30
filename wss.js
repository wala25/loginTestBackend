'use strict'
let WebSocket=require('ws');
let server=require('./app').server



let wss=new WebSocket.Server({noServer:true,path:'/chat', perMessageDeflate: false})
//use new Map() instead new Array  // use session ID for socket client 
let client=new Array()
server.on('upgrade',(req,socket,head)=>{
  //  const pathname =(req.headers.cookie)&&(req.headers.cookie.split(";")[0].split('usr=')[1]);
   // console.log(req.headers.cookie.split(";")[0].split('usr=')[1])
    if (true){
        console.log(req.socket.remoteAddress)
      wss.handleUpgrade(req,socket,head,(ws)=>{wss.emit('connection',ws,{userId:'gate'})})
    }
    else{
        socket.destroy()
    }
})

wss.on('connection',(ws,req)=>{
   //console.log(req)
    client.push(client.length+1)
    ws.send(JSON.stringify({message:'connected'}))
      ws.on('message',(m)=>{
        let msg=JSON.parse(m.toString('utf-8'))
        wss.clients.forEach((c)=>{

            c.send(JSON.stringify({message:msg}))
        })
             
    })
    ws.on('close',(w)=>{
        
        client.pop()
        console.log(client)
    })
})


/*
    let arr=new Array()
wss.on('request',(request)=>{
    console.log('req')
    w.send(JSON.stringify({message:'connected'}))
    let con=request.accept();
    console.log('gg')
    arr.push(con)
    con.on('message',(m)=>{
    arr.map(c=>
        c.send(JSON.stringify({message:JSON.parse(m.utf8Data)}))
    )})
})
    
*/

exports.wss


/*
var ws = require('websocket');

var client = new ws.server({noServer: true,
  path: "/websockets"});
  client(this.server)

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});

client.connect('ws://localhost:8080/', 'echo-protocol');
*/


