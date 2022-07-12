const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')
const server = express();
const port = 3000;

server.use(express.json({limit: '50mb'}));
server.use(express.urlencoded({limit: '50mb'}));
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
server.use(bodyParser.json())
server.use(cors())

var sum = 0;

//Routen
server.get('/', (req, res) => res.send('Geiler Node Server hier'));

server.post('/api/data', function (req, res) {
    sum = 0;

    for (let index = 0; index < req.body.length; index++) {
        sum += Number(req.body[index].aqi);
    }

    sum /= req.body.length;
    res.send("Success!");
});

server.get('/api/maxdata', function (req, res) {
    res.send(sum.toString());
});

server.listen(port, () => console.log(`Server running on port ${port}!`));