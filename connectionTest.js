var DBConnection = require("./libs/DBConnection")
var User = require("./models/User")
DBConnection.then(function(){
	User.createUser("harippe","nopassword").then(function(result){
		// console.log(result)
		User.loginUser("harippe","nopassword").then(function(result){
			console.log(result)
		})
	}).catch(console.error)
}).catch(console.error)