'use strict'

var Config = require('../config')
var FB = require('../connectors/facebook')
var Wit = require('node-wit').Wit
var log = require('node-wit').log
var request = require('request')


var firstEntityValue = function (entities, entity) {
	var val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value

	if (!val) {
		return null
	}
	return typeof val === 'object' ? val.value : val
}


var actions = {

	say (sessionId, context, message, cb) {
		
		// Bot testing mode, run cb() and return
		if (require.main === module) {
			cb()
			return
		}
		console.log('WIT.JS:WIT WANTS TO TALK TO:', context._fbid_)
		console.log('WIT.JS:WIT HAS SOMETHING TO SAY:', message)
		console.log('WIT.JS:WIT HAS A CONTEXT:', context)
		// Pass message to FB
		FB.newMessage(context._fbid_, message)	

		cb()
	},

	merge(sessionId, context, entities, message, cb) {

		console.log('Wit.JS: gettingFlight')
		console.log('WIT.JS: Merge TO:', context._fbid_)
		var loc = firstEntityValue(entities, 'location')
		if (loc) {
			context.loc = loc
			console.log('WIT.JS:Merge location',loc)
		}

		var date = firstEntityValue(entities, 'datetime')
		if (date) {
			context.date = date
			console.log('WIT.JS:Merge date',date)
		}

		var cat = firstEntityValue(entities, 'category')
		if (cat) {
			context.category = cat
			console.log('WIT.JS:category memorizeCat')

		}

		var details = firstEntityValue(entities, 'details')
		if (details) {
			context.details = details

			console.log('WIT.JS:details memorizeCat')

		}



		cb(context)
	},

	['getFlight'](sessionId, context, cb){
		var flightDetail = 'Sunny'
		context.flights = flightDetail
		console.log("WIT.JS Getting Flights in getFlight actions")
		context.flights = 'No flights'
		cb(context)
	},

	['memorizeCat'](sessionId, context, cb){
		console.log("WIT.JS Getting Flights in memorizeCat actions")
		console.log("WIT.JS context.cat is ",context.category)
		console.log("WIT.JS context.det is ",context.details)


		// call some function to save the context.det and context.cat
		// CHekc if data already exisst
		// else STORE DATA
		// DELTETE THE DATA context.details
		context.cat = "It's done!"

		cb(context)

	},

	//['retrieveCat']

	error(sessionId, context, error) {
		console.log("WIT.JS: Error",error.message)
	}

}


// SETUP THE WIT.AI SERVICE
var getWit = function () {
	console.log('GRABBING WIT')
	return new Wit(Config.WIT_TOKEN, actions)
}

module.exports = {
	getWit: getWit,
}

// BOT TESTING MODE
if (require.main === module) {
	console.log('Bot testing mode!')
	var client = getWit()
	client.interactive()
};
