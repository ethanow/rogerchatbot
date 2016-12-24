// module model.js
var UserSchema = mongoose.Schema({
  fbID: String
})


var User = mongoose.model('User',UserSchema)