var mongoose = require('mongoose');
mongoose.Promise = Promise;
var Schema = mongoose.Schema;

var urlSchema = new Schema({
        original: String,
        short: String
});

var modelClass = mongoose.model('schema', urlSchema);

module.exports = modelClass;