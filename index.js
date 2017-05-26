var express = require('express');
var app = express();
var body_parser = require('body-parser');
var cors = require('cors');
var validUrl = require("valid-url");

var mongoose = require('mongoose');
mongoose.Promise = Promise;
// var mongoURL = process.env.MONGOLAB_URI || "mongodb://localhost:27017/url";

var urlList = require('./schema.js');

var port = process.env.PORT || 8080;

app.use('/', express.static(__dirname + '/page'));
app.use(body_parser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/url')

app.get('/new/:newUrl(*)', function(req,res) {
    var newUrl = req.params.newUrl;
    
    if(validUrl.isUri(newUrl)){
      var short = Math.floor(Math.random()*55555).toString();
      var data = new urlList(
        {
           original: newUrl,
           short: short
        }
      );
      
      data.save(function(err){
        if(err){
          return res.send('Error saving to database.')
        }
      });
      
      return res.json(data);
    } 
    
      var data = new urlList({
        original: 'Incomplete or Invalid Url',
        short: 'N/A'
      });
    
    return res.json(data); 
      
  
});


app.get('/:storedUrl', function(req, res, next){
  var short = req.params.storedUrl;
  
  urlList.findOne({'short': short}, function(err, data){
    if(err) {
        return res.status(404).send("Error reading database");
    } else {
        
        if (data && data.original.length) {
            res.redirect(data.original);
        } else {
            res.status(404).send("Invalid Short URL");
        }
            
    }
  });
  
});

app.listen(port, function(){
  console.log("Listening on port: " + port);
});