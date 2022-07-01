const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../schemas/user').User
const Session=require('../schemas/session').Session

let key='532B9FA5EED2729771BBD1BFCD94F'


exports.signup=(req,res)=>{
    let message=new Array;
    let user=new User(req.body);
    let RegExpMail=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; 
    if (!RegExpMail.test(user.email)){message.push('*Adress Mail invalide !')};
    if (!user.email||!user.name||!user.password){message.push('*Remplissez tout les champs !')}
    if(message.length===0)
      {bcrypt.hash(user.password,8)
        .then((pswd)=>{user.password=pswd;
            user.save()
              .then(()=>{res.status(201).json()})
              .catch((e)=>{(e.code===11000)?(message.push('*Cette adress email existe déjà')):(message.push('*Unknown error !'));res.status((e.code===11000)?400:500).json(message)})
           })
        .catch(()=>{res.status(500).json(['*Unknown error !'])})
      }
      else{res.status(400).json(message)}
      
}


exports.login=(req,res)=>{
    res.clearCookie('usr');
     let user=req.body;
     if (!user.email||!user.password){res.status(400).json('*Remplissez tout les champs !')}
      else {User.findOne({email:user.email})
           .then((usr)=>{if(usr)
             {bcrypt.compare(user.password , usr.password)
                  .then((rslt)=>{if(rslt)   
                        {let session=new Session({userId:usr._id})
                        session.save()
                              .then((r)=>{
                                let token=jwt.sign({id:usr._id,name:usr.name}, key ,{algorithm:'HS256', expiresIn:'30d'});
                                res.status(200).cookie('session',r._id,{maxAge:30*24*60*60*1000,httpOnly:true})
                                .cookie('usr',token,{maxAge:30*24*60*60*1000,httpOnly:true}).json(usr.name)
                              })
                        }
                        else {res.status(403).json('*Mdp incorrect !')}
                       }) 
                  .catch((e)=>{res.status(500).json('*Unknown error !')})
               }
               else{res.status(404).json('*User not found !')}
             })
           .catch((e)=>{res.status(500).json('*Unknown error !')})}
}


exports.logout=(req,res)=>{
    res.status(204).clearCookie('usr').json()
}


exports.check=(req,res)=>{
    let token=req.cookies.usr;
    try{let user=jwt.verify(token,key);
         res.status(200).json(user.name)}
    catch{res.status(403).json()}
}