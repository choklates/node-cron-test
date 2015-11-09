var fs = require('fs');
var express = require('express');
var app = express();
var CronJob = require('cron').CronJob;

var num = 0;

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.send(num.toString());
});

app.listen(app.get('port'), function() {
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
        console.log(count);
      });
    });
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

job.start();
