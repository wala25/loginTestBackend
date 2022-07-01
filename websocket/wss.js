'use strict'

const WebSocket=require('ws');
const server=require('../app').server
const jwt=require('jsonwebtoken');
const wss=require('./routes/chat')

server.on('upgrade',(req,socket,head)=>{
      const cookies=getCookies(req);
      const user=verifyClient(cookies);
      if (user){
        wss.handleUpgrade(req,socket,head,(ws)=>{wss.emit('connection',ws,socket,{user:user,cookies:cookies})})
      }
      else{
          socket.destroy()
      }

      
})


 

function getCookies(req){
  const cookies =req.headers.cookie?.split("; ")||[];
       let token=''; let session=''
       cookies.map(e=>{
        if(e.startsWith('usr=')){
             token=e.split('usr=')[1]
        }
        else if(e.startsWith('session=')){
             session=e.split('session=')[1]
        }
       })
return {token:token,session:session}
}


let key='532B9FA5EED2729771BBD1BFCD94F'

function verifyClient(cookies){
  let token=cookies.token;
  try{let user=jwt.verify(token,key);
       if(cookies.session.length>0) return user
       else return false;
      }
  catch{
    return false
  }
}



