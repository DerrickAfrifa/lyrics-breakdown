const DatabaseService = require('./services/DatabaseService');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var databaseService = new DatabaseService();


var app = express();

const port = process.env.PORT || 5000;

// CORS support.
var cors = require('cors');

app.use(cors({origin: '*'}));

/** SUPPORTED ROUTES **/
app.use('/user', require('./routes/UserRouter'));
app.use('/game', require('./routes/GameRouter'));

databaseService.connectToDatabase();

/** LISTEN **/
app.listen(port, () => console.log(`Listening on port ${port}`));
