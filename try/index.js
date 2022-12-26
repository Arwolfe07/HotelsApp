const express = require('express');
const app = express();
const Jabber = require('jabber');
const jabber = new Jabber();
jabber.createWord(6);

app.get('/',(req,res)=>{
    res.send('Hello');
})







app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})