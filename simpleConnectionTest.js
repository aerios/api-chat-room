var DBConnection = require("./libs/DBConnection")
DBConnection.then(function(sql){
	new sql
		.Request()
		.query("INSERT INTO users (username,password) VALUES (''test,''test) ")
		.then(function(result){
			console.log("Success",result)
		})
		.catch(function(reason){
			console.log("Error",reason)
		})
})