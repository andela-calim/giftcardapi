// Required Modules
var express 		= require('express'),
		giftRouter	= express.Router(),
		jwt					= require('jsonwebtoken');

// Required Scripts
var Item				= require('../models/item.model.js');
var User				= require('../models/user.model.js');
var x						= require('../config/database.js');

// Redirect to API
giftRouter.route('/')
.get(function(request, response) {
	response.redirect('/api');
});

// API routes
giftRouter.route('/api')
.get(function(request, response) {
	Item.find(function(err, item) {
		if(err) {
			return console.error(err);
		}
		console.log('Found ' + item.length + ' items! \n' + item);
		response.status(200).send(item);
	});
})
.post(function(request, response) {
	console.log('request gotten');
	console.log(request.body);
	Item.create(request.body, function(err, item) {
		if (err) {
			return console.error(err);
		}
		console.log(item.itemName + ' has been added!');
		console.log(item);
		return response.status(201).send(item);
	});
});

// API routes with id
giftRouter.route('/api/:id')
.get(function(request, response) {
	Item.findById(request.params.id, function(err, item) {
		if (err) {
			return console.error(err);
		}
		if (item) {
			console.log('Item ' + request.params.id + ' found!\n' + item);
			return response.status(200).send('Item ' + request.params.id + ' found!\n' + item)
		}
		console.log('Item doesn\'t exist!');
		return response.status(404).send('Item doesn\'t exist!');
	});
})
.put(function(request, response) {
	Item.findByIdAndUpdate(request.params.id, request.body, function(err, item) {
		if (err) {
			return console.error(err);
		}
		if (item) {
			console.log(item + '\n' + request.params.id + ' has been Updated!');
			return response.status(200).send(item + '\n' + request.params.id + ' has been Updated!');
		}
		console.log('Item doesn\'t exist!');
		return response.status(404).send('Item doesn\'t exist!');
	})
})
.delete(function(request, response) {
	Item.findByIdAndRemove(request.params.id, function(err, item) {
		if (err) {
			return console.error(err);
		}
		if (item) {
			console.log('Item ' + request.params.id + ' has been deleted');
			return response.status(200).send('Item ' + request.params.id + ' has been deleted!');
		}
		console.log('Item ' + request.params.id + ' doesn\'t exist!');
		return response.status(404).send('Item ' + request.params.id + ' doesn\'t exist!');
	});
});

// FrontEnd routes
giftRouter.post('/authenticate', function(request, response) {
  User.findOne({email: request.body.email, password: request.body.password}, function(err, user) {
  	
    if (err) {
      response.json({
        type: false,
        data: 'Error occured: ' + err
      });
    }
    if (user) {
	    response.json({
	      type: true,
	      data: user,
	      token: user.token
	    }) 
    } 
    else {
      response.send(400, {
        type: false,
        data: 'Incorrect email/password'
      });    
    }
  });
});

giftRouter.post('/signin', function(request, response) {
  User.findOne({email: request.body.email, password: request.body.password}, function(err, user) {
    if (err) {
      response.json({
        type: false,
        data: 'Error occured: ' + err
      });
    } else {
      if (user) {
        response.json({
          type: false,
          data: 'User already exists!'
        });
      } else {
        var userModel = new User();
        userModel.firstName = request.body.firstName;
        userModel.lastName = request.body.lastName;
        userModel.email = request.body.email;
        userModel.password = request.body.password;
        userModel.save(function(err, user) {
          user.token = jwt.sign(user, x.JWT_SECRET);
          user.save(function(err, user1) {
            response.json({
              type: true,
              data: user1,
              token: user1.token
            });
          });
        });
      }
    }
  });
});

giftRouter.get('/profile', ensureAuthorized, function(request, response) {
  User.findOne({token: request.token}, function(err, user) {
    if (err) {
      response.json({
        type: false,
        data: 'Error occured: ' + err
      });
    } else {
      response.json({
        type: true,
        data: user
      });
    }
  });
});

giftRouter.post('/profile', ensureAuthorized, function(request, response) {
	console.log('accepted save call. request.body is: ');
	console.log(request.body);
	console.log(request.token);
	User.findOne({token: request.token}, function(err, user) {
		if (err) {
			console.log(err);
			response.json({
				type: false,
				data: 'Error occured: ' + err
			});
		} 

		if (user) {
			console.log(user);
			user.wishList = request.body;
			user.save(function(err, user1) {
				response.json({
					type: true,
					data: user
				});
			});
		} else {
			console.log('else');
			response.send(400, {
        type: false,
        data: 'Go and register!'
      });
		}
	});
});

giftRouter.get('/users', function(request, response) {
	User.find({}, function(err, users) {
		if (err) {
			response.json({
				type: false,
				data: 'Error occured: ' + err
			});
		}
		if (users) {
			response.json({
				type: true,
				data: users
			});
		} else {
			response.send(400, {
        type: false,
        data: 'No user found!'
      });
		}
	});
});

function ensureAuthorized(request, response, next) {
  var bearerToken;
  var bearerHeader = request.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];
    request.token = bearerToken;
    next();
  } else {
    response.send(403);
  }
}

process.on('uncaughtException', function(err) {
  console.log(err);
});

module.exports = giftRouter;