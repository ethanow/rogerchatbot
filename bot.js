'use strict'

var Config = require('./config')
var wit = require('./services/wit').getWit()

// LETS SAVE USER SESSIONS
var sessions = {}

var findOrCreateSession = function (fbid) {
  var sessionId

  // DOES USER SESSION ALREADY EXIST?
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // YUP
      sessionId = k
    }
  })

  // No session so we will create one
  if (!sessionId) {
    sessionId = new Date().toISOString()
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }
  }

  return sessionId
}

var read = function (sender, message, reply) {
	// Let's find the user
	var sessionId = findOrCreateSession(sender)
	console.log ('BOT.JS:user is:',sessionId.fbid)
	var fbid_temp = sessionId.fbid
	//console.log('BOT.JS:Starting context is',context)

	if (message === 'hello') {
		// Let's reply back hello
		message = 'Hello yourself! I am a chat bot. You can say "show me pics of corgis"'
		reply(sender, message)
	} else {
		console.log('BOT.JS:Received message',message)
		// Let's forward the message to the Wit.ai bot engine
		// This will run all actions until there are no more actions left to do
		wit.runActions(
			sessionId, // the user's current session by id
			message,  // the user's message
			sessions[sessionId].context, // the user's session state
			function (error, context) { // callback
			if (error) {
				console.log('BOT.JS: Oops! Got an error from Wit:', error)
			} else {
				// Wit.ai ran all the actions
				// Now it needs more messages
				console.log('BOT.JS:Waiting for further messages')
				fbid_temp = sessions[sessionId].context._fbid_
				// Based on the session state, you might want to reset the session
				// Example:
				// if (context['done']) {
				// 	delete sessions[sessionId]
				// }

				// clear context
				// context = {}
				console.log('BOT.JS:Now context to',context)
				// Updating the user's current session state
				sessions[sessionId].context = {}
				sessions[sessionId].context._fbid_ = fbid_temp


				console.log('BOT.JS:Updated context to',context)
			}
		})
	}
}



module.exports = {
	findOrCreateSession: findOrCreateSession,
	read: read,
}


