var fs           = require('fs');
var express      = require('express');
var app          = express();
var http         = require('http').Server(app);
var io           = require('socket.io')(http);
var CronJob      = require('cron').CronJob;
var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();
var num = 0;

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', { num: num });
});

emitter.on('tick', function() {
  io.emit('message', num);
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var job = new CronJob({
  cronTime: '*/5 * * * * *', // everyday at 10 second intervals
  onTick: function() {
    var log = 'count.txt';

    fs.readFile(log, 'utf-8', function(err, count) {
      if (err) return console.log(err);
      count = count ? parseInt(count) + 1 : 0;

      fs.writeFile(log, count, function (err) {
        if (err) return console.log(err);
        num = count;
        emitter.emit('tick');
      });
    });
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

job.start();
