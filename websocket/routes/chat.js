'use strict'
let WebSocket=require('ws');

let wss=new WebSocket.Server({noServer:true, perMessageDeflate: false})

//use new Map() instead new Array  // use session ID for socket client 
//connections.set('ClientId',new Map().set('sessionId',new ARray().fill('ws')))
let Clients=new Map()

wss.on('connection',(ws,socket,info)=>{
    let Client=Clients.get(info.user.id)||new Map()
    
      let session=Client.get(info.cookies.session)||new Array()
        if(session.length>0){
          session.push(socket)
          Client.set(info.cookies.session,session)
          Clients.set(info.user.id,Client)
        }
        else{
          Client.set(info.cookies.session,[socket])
          Clients.set(info.user.id,Client)
        }
    console.log(Clients)
     ws.send(JSON.stringify({message:'connected'}))
       ws.on('message',(m)=>{
         let msg=JSON.parse(m.toString('utf-8'))
         wss.clients.forEach((c)=>{
             c.send(JSON.stringify({message:msg}))
            
         })
              
     })
     ws.on('close',(w)=>{
        let sessions=Clients.get(info.user.id)||new Map()
        let sockets=sessions.get(info.cookies.session)||new Array()
        if(sockets.length>1){
           sockets.splice(sockets.indexOf(socket),1)
           sessions.set(info.cookies.session,sockets)
           Clients.set(info.user.id,sessions)
        }
        else{
          if(sessions.size>1){
            sessions.delete(info.cookies.session)
            Clients.set(info.user.id,sessions)
          }
          else{
            Clients.delete(info.user.id)
          }
        }
        console.log(Clients)
     })
     
 })
//checking socket connections
 const interval = setInterval(()=> {
  wss.clients.forEach((ws)=> {
    ws.ping('hhh');
    if (ws.readyState!==1 ){
      console.log('down')
      return ws.close()
    };
      
    
  });
}, 3000);

 module.exports=wss