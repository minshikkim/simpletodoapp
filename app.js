/*
create expree app and run server and connect to mongoDB
*/
require('dotenv').config()                                                             
const methodOverride = require('method-override')
const morgan = require('morgan')
const express = require('express');
const app = express();
app.use(express.static('views'))




// connect db;
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,
 { useNewUrlParser: true , useUnifiedTopology: true} , (error) => {
     if(error) throw error;
 });
const db = mongoose.connection;
db.on('error', (error) => console.error(error)) // using bulit-in event by defalut eventlistener
db.once('open', (error) => console.log('Conntected to Databases')) // Equivalent to connected (same) 




app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// using json (if you want, use module body-parser)
app.use(express.json());
app.use(express.urlencoded( {extended : true } ));
app.use(morgan('dev'))
//using static file
app.use(methodOverride('_method'))






// todo router
const router = require('./routes/item')
app.use('/', router)





app.listen(process.env.PORT, err => {
    if(err){
        console.log('server not working')
    }
    console.log(`server is on http://localhost:${process.env.PORT}`)
})



