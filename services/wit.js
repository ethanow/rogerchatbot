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
		context.cat = "It's done!"

		cb(context)
	},

	error(sessionId, context, error) {
		console.log("WIT.JS: Error",error.message)
	}

}

var findExpediaFlight = function(context){
	var loc = context.loc
	var date = context.date
	console.log('WIT.JS: Searching for: ', loc, ', date: ', date)
	return new Promise(function (resolve, reject) {
		console.log('EXPEDIA API SAYS:')
    // var url = 'http://terminal2.expedia.com/x/mflights/search?departureAirport=SIN&arrivalAirport=BKK&departureDate=' + date + '&apikey=10jrLILOwNwMhadNnYGj8PAD2y7U8Lnq'
    var url = 'http://www.google.com'
        request(url, function (error, response, body) {
        return 'SQ123'
      })
        /*
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var jsonData = JSON.parse(body)
                var flightTime = jsonData.legs[0].segments.departureTimeRaw.text
                var flightNo = jsonData.legs[0].segments.externalAirlineCode + jsonData.legs[0].segments.flightNumber.text
                console.log('EXPEDIA API SAYS: ', flightNo, 'on time: ', flightTime)
                return flightNo + ', departing at ' + flightTime
            }
        }) */
    })
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
}
/*
// GET WEATHER FROM API
var getWeather = function (location) {
	return new Promise(function (resolve, reject) {
		var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ location +'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	var jsonData = JSON.parse(body)
		    	var forecast = jsonData.query.results.channel.item.forecast[0].text
		      console.log('WEATHER API SAYS....', jsonData.query.results.channel.item.forecast[0].text)
		      return forecast
		    }
			})
	})
}
*/
// CHECK IF URL IS AN IMAGE FILE
var checkURL = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};
