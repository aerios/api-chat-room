var DBConnection = require("./libs/DBConnection")
DBConnection.then(function(sql){
	new sql
		.Request()
		.query("SELECT * FROM users ")
		.then(function(result){
			console.log("Success",result)
		})
		.catch(function(reason){
			console.log("Error",reason)
		})
})
