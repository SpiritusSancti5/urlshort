'use strict';

var express = require('express');
var app = express();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var body_parser = require('body-parser');
var validUrl = require("valid-url");
var cors = require('cors');

mongoose.Promise = Promise;

// Basic Configuration 
var port = process.env.PORT || 3000;
var urlList = require('./schema.js');

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGO_URI)

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(body_parser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


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

app.get('/new/*', function(req,res) {
    var newUrl = req.params.url;
    
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



app.listen(port, function () {
  console.log('Node.js listening ...');
});