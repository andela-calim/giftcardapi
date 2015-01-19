// Required
var mongoose		= require('mongoose');

var Schema			= mongoose.Schema;

// Define Schema
var UserSchema	= new Schema({
	firstName			: String,
	lastName			: String,
	email					: String,
	password			: String,
	wishList			: Array,
	token					: String
});

// Export Schema
module.exports	= mongoose.model('User', UserSchema);