var express = require('express');
var  path = require('path');
var http=require('http');
var  group = require('./server/routes/groups.js');
var  config = require('./server/routes/config.js');
var app = express();
var clientDir = path.join(__dirname, 'client');
var cacheGroup = require('./server/routes/cacheGroup');
var chat = require('./server/routes/chat');
cacheGroup.init();
setTimeout(function(){cacheGroup.query();},1000);
//cacheGroup.query();
group.tatistical();

app.configure(function() {
  app.set('port',config.port);
  app.use(express.bodyParser());
  app.use(express.static(clientDir)) 
});

app.get('/', function(req, res) {
  res.sendfile(path.join(clientDir, 'index.html'));
})

app.get('/groups/all', group.findAll);
app.get('/groups/:id', group.findById);
app.post('/groups/add', group.add);
app.put('/groups/edit/:id', group.update);
app.put('/groups/delete/:id', group.delete);
//app.put('/groups/titleToString/:id', group.titleToString);

var server =http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

chat.start(server);