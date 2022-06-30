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


exports.wss
