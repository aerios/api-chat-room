var express = require('express');
var router = express.Router();
var DBConnection = require("../libs/DBConnection")

function md5(str){
	return require('crypto').createHash('md5').update(str).digest("hex")
}

function isUsernameExist(username){
	return DBConnection.then(function(sql){
		return new sql
		.Request()
		.input("username",username)
		.query("SELECT username FROM users WHERE username=@username")
		.then(function(result){
			return result.length > 0
		})
	})
}

router.route("/users/")
//create new user
.put(function(request,response){
	DBConnection.then(function(sql){
		var username = request.body.username;
		var password = request.body.password
		var hashedPassword = md5(password)
		return isUsernameExist(username).then(function(isExist){
			if(!isExist){
				new sql
					.Request()
					.input("username",username)
					.input("password",hashedPassword)
					.query("INSERT INTO users (username,password) VALUES(@username,@password)")
					.then(function(){
						return new sql
							.Request()
							.input("username",username)
							.input("password",hashedPassword)
							.query("SELECT id,username,timestamp FROM users WHERE username=@username AND password@=password")
							.then(function(result){
								var realUser = result[0]
								response.send({
									"message":"Successfully create user",
									"result":realUser
								})
							})
					})
			}else{
				response.status(400).send({
					error : "User is already exists!"
				})
			}
			
		})
	}).catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})
//get user list
.get(function(request,response){
	new sql
	.Request()
	.query("SELECT id,username,timestamp FROM users")
	.then(function(result){
		response.send({
			"message":"Successfully retrieve user list".
			"result":result
		})
	}).catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})

//
router.route("/users/:id")
//get single user
.get(function(request,response){
	var userId = request.params.id
	new sql
	.Request()
	.input("id",id)
	.query("SELECT id,username,timestamp FROM users WHERE id=@id")
	.then(function(result){
		if(result.length){
			var realUser = result[0]
			response.send({
				"message":"Successfully retrieve user".
				"result":result
			})	
		}else{
			response.status(404).send({
				error : "User not found!"
			})
		}
		
	}).catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})
// edit existing user
.post(function(request,response){
	response.status(501).send({
		"error":"Endpoint not implemented"
	})
})

router.route("/users/login")
//try to authenticate user
.post(function(request,response){
	var username = request.body.username;
	var password = request.body.password
	var hashedPassword = md5(password)
	new sql
	.Request()
	.input("username",username)
	.input("password",hashedPassword)
	.query("SELECT id,username,timestamp FROM users WHERE username=@username AND password@=password")
	.then(function(result){
		if(result.length){
			var realUser = result[0]
			response.send({
				"message":"Successfully create user",
				"result":realUser
			})	
		}else{
			response.status(404).send({
				error : "User not found!"
			})
		}
		
	}).catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})	
})

router.route("/rooms/")
.get(function(request,response){
	new sql
	.Request()
	.input("id",id)
	.query("SELECT id,username,timestamp FROM rooms")
	.then(function(result){
		response.send({
			message : "Successfully retrieve rooms",
			result : result
		})
	}).catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})
.post(function(request,response){
	var roomName = request.body.roomName
	new sql
	.Request()
	.input("room_name",roomName)
	.query("INSERT INTO rooms (room_name) VALUES (@room_name)")
	.then(function(){
		return new sql
			.Request()
			.query("SELECT (id,room_name) FROM rooms WHERE room_name=@room_name")
			.then(function(result){
				if(result.length){
					var realRoom = result[0]
					response.send({
						message : "Successfully create room",
						result : realRoom
					})
				}
			})
	})
	.catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})
router.route("/rooms/:id")
.post(function(request,response){
	response.send(501).send({
		error : "Endpoint not implemented"
	})
})
.get(function(request,response){
	var id = request.params.id
	new sql
	.Request()
	.input("id",id)
	.query("SELECT id,room_name FROM users WHERE id=@id")
	.then(function(result){
		if(result.length){
			var realUser = result[0]
			response.send({
				"message":"Successfully retrieve room".
				"result":result
			})	
		}else{
			response.status(404).send({
				error : "Room not found!"
			})
		}
		
	}).catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})

router.route("/rooms/:id/users")
.get(function(request,response){
	var id = request.params.id
	new sql
	.Request()
	.input("id","id")
	.query("SELECT * FROM room_user INNER JOIN users ON room_user.user_id = users.id WHERE room_user.room_id=@id")
	.then(function(result){
		response.send({
			message : "Successfully retrieve user list",
			result : result
		})
	})
	.catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})

})
.post(function(request,response){
	response.status(500).send({
		error : "Endpoint not implemented"
	})
})


router.route("/rooms/:room_id/users/:user_id")
.put(function(request,response){
	var roomId = request.params.room_id
	var userId = request.params.user_id
	new sql
	.Request()
	.input("room_id",roomId)
	input("user_id",userId)
	.query("INSERT INTO room_user (room_id,user_id) VALUES (@room_id,@user_id)")
	.then(function(){
		response.send({
			result : "OK"
		})
	})
	.catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})
.delete(function(){
	var roomId = request.params.room_id
	var userId = request.params.user_id
	new sql
	.Request()
	.input("room_id",roomId)
	input("user_id",userId)
	.query("DELETE FROM room_user WHERE room_id=@room_id AND user_id=@user_id")
	.then(function(){
		response.send({
			result : "OK"
		})
	})
	.catch(function(reason){
		response.status(500).send({
			error : reason
		})
	})
})


module.exports = router;
