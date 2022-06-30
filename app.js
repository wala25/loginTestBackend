const express=require('express');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const app=express();
app.use(express.json());
app.use(cookieParser())

const cors=require('cors');
const corsOption={ origin:"http://localhost:4200",credentials:true}
app.use(cors(corsOption));

mongoose.connect('mongodb://localhost:27017/Test',
 {useNewUrlParser: true,
  useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

//routes 
const auth=require('./routes/auth')

app.use('/api',auth)


app.use( express.static(__dirname+'/dist/angular-test'))
app.get('/*',(req,res)=>{res.sendFile('index.html',{root:'./dist/angular-test/'})})

exports.server=require('http').createServer(app)
const ws=require('./wss')  //needed to call websocket 

this.server.listen(3000,()=>{console.log("connected")})





