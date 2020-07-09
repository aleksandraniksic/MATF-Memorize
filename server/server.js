const express = require('express') //framework
const app = express() 
const bodyParser = require('body-parser');
const port = 5000
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mindGame";

//connection to Mongo database
let dbMind = null;
MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  if (err) throw err;
  console.log("Konektovan na bazu!");
  dbMind = db.db('mindGame');
});

//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

let cnt = 1;
let useres = [];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    next();
});

app.post('/add', async (req, res) => {
    const addBody = req.body;

    const status = await dbMind.collection('TIMES').insertOne(addBody);
    res.send(status);
})

app.get('/', async (req, res) => {
    //vremena sortirano rastuce
    const arrTimes = await dbMind.collection('TIMES').find({}).sort({time: 1}).toArray();
    res.send(arrTimes);
})

app.listen(port, () => console.log(`Server osluskuje na  http://localhost:${port}`))