// Required
var mongoose			= require('mongoose');

var Schema				= mongoose.Schema;

// Define Schema
var ItemSchema		= new Schema({
	itemName				: String,
	itemDescription	: String,
	itemCategory		: String,
	itemPrice				: String
});

//Export
module.exports = mongoose.model('Item', ItemSchema);