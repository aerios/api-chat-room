var DBConnection = require("../libs/DBConnection")
var User = {}

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

function createUser(username,password){
	var hashedPassword = md5(password)
	return new Promise(function(resolve,reject){
		DBConnection.then(function(sql){
			isUsernameExist(username).then(function(isExist){
				if(isExist){
					reject (new Error("Username already exists!"))
				}
				else{
					new sql
					.Request()
					.input("username",username)
					.input("password",hashedPassword)
					.query("INSERT INTO users (username,password) VALUES(@username,@password)")
					.then(resolve)
				}
			})		
		})
	})
}

function loginUser(username,password){
	var hashedPassword = md5(password)
	// console.log(username,password)
	return DBConnection.then(function(sql){
		return new sql
		.Request()
		.input("username",username)
		.input("password",hashedPassword)
		.query("SELECT * FROM users WHERE username=@username AND password=@password")
	})
}

function getUser(userId){

}

function getUserList(userIdList){

}

User.createUser = createUser
User.loginUser = loginUser

module.exports = User