'use strict'
let WebSocket=require('ws');

let wss=new WebSocket.Server({noServer:true, perMessageDeflate: false})

//use new Map() instead new Array  // use session ID for socket client 
//connections.set('ClientId',new Array().fill(new Map().set('sessionId',new ARray().fill('ws'))))
let Clients=new Map()

wss.on('connection',(ws,socket,info)=>{
  console.log(socket[0])
    let Client=Clients.get(info.user.id)||new Array()
    if(Client.length>0){
      let session=[]
      for (let i=0;i<Client.length;i++){
        session=Client[i].get(info.cookies.session)
        if(session.length>0){
          session.push(socket)
          Client[i].set(info.cookies.session,session)
          Clients.set(info.user.id,Client)
          break
         }
        else if(i===Client.leght-1){
          Client.push(new Map().set(info.cookies.session,[socket]))
          Clients.set(info.user.id,Client)
        }
      }
    }
    else{
          Client.push(new Map().set(info.cookies.session,[socket]))
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
        let sockets=Clients.get(info.user.id).map(e=>{let s=e.get(info.cookies.session); if(s.length>0) return s })
        
        sockets.map((e)=>{e[0].destroy()})
     })
 })

 module.exports=wss