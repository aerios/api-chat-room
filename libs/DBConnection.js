var MsSQL = require("mssql")
var Promise = require("bluebird")
var Config = require("../config.json")

var CONNECTION_CONFIG = Config.Connection

var prReady = new Promise(function(resolve,reject){
	MsSQL.connect(CONNECTION_CONFIG).then(function(){
		resolve(MsSQL)
	}).catch(reject)
})

module.exports = prReady
