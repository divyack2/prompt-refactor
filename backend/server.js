const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const secrets = require('./config/secrets'); 
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

// Use CORS to allow cross-origin requests
app.use(cors());

// Body parsing middleware should be added before defining routes
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Connect to a MongoDB --> Uncomment this once you have a connection string!!
mongoose.connect(secrets.mongo_connection,  { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('MongoDB disconnected');
});

require('./routes')(app, router);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
