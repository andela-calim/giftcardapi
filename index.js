// Required Modules
var express		= require('express'),
		morgan		= require('morgan'),
		bodyParser= require('body-parser'),
		mongoose	= require('mongoose'),

		giftApp		= express();

var cors  =	require('cors');
giftApp.use(cors());

var port	= process.env.PORT || 3000;

// Required Scripts
var configDB 	= require('./config/database.js');
var giftRoute = require('./routes/mainRoutes.js');

// Connect to the database
mongoose.connect(configDB.url);

// Use
giftApp.use(bodyParser.urlencoded({ extended: true }));
giftApp.use(bodyParser.json());
giftApp.use(morgan('dev'));

giftApp.use('/', giftRoute);

// Start Server
giftApp.listen(port, function() {
	console.log("Gift Card API listening on port " + port);
});