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

		
		console.log('WIT.JS:Delete old context')
		if (context.loc){
			delete context.loc
			console.log('WIT.JS:Deleting loc')
		}

		if (context.logSpend){
			delete context.logSpend
			console.log('WIT.JS:Deleting logSpend')
		}

		if (context.amt){
			delete context.amt
			console.log('WIT.JS:Deleting logSpend')
		}

		console.log('WIT.JS:WIT WANTS TO TALK TO:', context._fbid_)
		console.log('WIT.JS:WIT HAS SOMETHING TO SAY:', message)
		console.log('WIT.JS:WIT HAS A CONTEXT:', context)


		// Pass message to FB
		FB.newMessage(context._fbid_, message)	

		cb()
		
	},

	getFlight(sessionId, context, entities, message, cb) {
		console.log('GetFlight success')

	},

	merge(sessionId, context, entities, message, cb) {
		console.log('WIT.JS: Calling Merge')
		// Reset the amount
		
	  delete context.cat;
    const category = firstEntityValue(entities, 'category');
    if (category) {
      context.cat = category;
      console.log('WIT.JS: Merge amount')
    }
		/*
		delete context.forecast

		// Retrive the location entity and store it in the context field
		var loc = firstEntityValue(entities, 'location')
		if (loc) {
			context.loc = loc
			console.log('WIT.JS:Merge location',loc)
		}

		// Reset the cutepics story
		delete context.pics

		// Retrieve the category
		var category = firstEntityValue(entities, 'category')
		if (category) {
			context.cat = category
			console.log('WIT.JS:Merge caterory',cat)
		}

		// Retrieve the sentiment
		var sentiment = firstEntityValue(entities, 'sentiment')
		if (sentiment) {
			context.ack = sentiment === 'positive' ? 'Glad your liked it!' : 'Aww, that sucks.'
		} else {
			delete context.ack
		}
		*/
		cb(context)
	},

	error(sessionId, context, error) {
		console.log("WIT.JS: Error",error.message)
	},

	// list of functions Wit.ai can execute
	
	['logSpend'](sessionId, context, cb) {
		console.log('WIT.JS: Update context.logSpend')
		context.logSpend = 'Logged'

		// Insert API call to save the amount_of_money

		cb(context)
	},
	

	['fetch-weather'](sessionId, context, cb) {
		// Here we can place an API call to a weather service
		// if (context.loc) {
		// 	getWeather(context.loc)
		// 		.then(function (forecast) {
		// 			context.forecast = forecast || 'sunny'
		// 		})
		// 		.catch(function (err) {
		// 			console.log(err)
		// 		})
		// }
		console.log('WIT.JS: Update context.forecast')
		context.forecast = 'Sunny'

		cb(context)
	},


	['getFlight'](sessionId, context, cb) {
		// Here we can place an API call to a weather service
		// if (context.loc) {
		// 	getWeather(context.loc)
		// 		.then(function (forecast) {
		// 			context.forecast = forecast || 'sunny'
		// 		})
		// 		.catch(function (err) {
		// 			console.log(err)
		// 		})
		// }
		console.log('WIT.JS: Getflight')
		context.flight_details = 'Sunny'

		cb(context)
	},

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
}

// LIST OF ALL PICS
var allPics = {
  corgis: [
    'http://i.imgur.com/uYyICl0.jpeg',
    'http://i.imgur.com/useIJl6.jpeg',
    'http://i.imgur.com/LD242xr.jpeg',
    'http://i.imgur.com/Q7vn2vS.jpeg',
    'http://i.imgur.com/ZTmF9jm.jpeg',
    'http://i.imgur.com/jJlWH6x.jpeg',
		'http://i.imgur.com/ZYUakqg.jpeg',
		'http://i.imgur.com/RxoU9o9.jpeg',
  ],
  racoons: [
    'http://i.imgur.com/zCC3npm.jpeg',
    'http://i.imgur.com/OvxavBY.jpeg',
    'http://i.imgur.com/Z6oAGRu.jpeg',
		'http://i.imgur.com/uAlg8Hl.jpeg',
		'http://i.imgur.com/q0O0xYm.jpeg',
		'http://i.imgur.com/BrhxR5a.jpeg',
		'http://i.imgur.com/05hlAWU.jpeg',
		'http://i.imgur.com/HAeMnSq.jpeg',
  ],
  default: [
    'http://blog.uprinting.com/wp-content/uploads/2011/09/Cute-Baby-Pictures-29.jpg',
  ],
};
