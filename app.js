require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3030;
const bodyParser=require('body-parser')
const Allroute =require('./routes/indexRoute')

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',Allroute)

app.listen(port,(err)=>{
    if(err){
        return console.log("server error",err)
    }
    console.log(`app listening on port ${port}!`)
})