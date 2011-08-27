
/**
 * Module dependencies.
 */

var express = require('express'),
    nko = require('nko')('sWq0rm8zUcxb3Isa'),
    RedisStore = require('connect-redis')(express),
    scraper = require('./lib/scraper');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'mesolabs',
    store: new RedisStore()
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.post('/', function(req, res) {
  var userId = req.body.userId;
  var url = req.body.url;
  console.log(userId + ": " + url);
  scraper(url, function(err, $) {
    if (err) return console.log('ERROR:' + err);
    console.log($('title').text().trim());
  });
  res.send(200);
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
