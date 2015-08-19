var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000
var pg = require('pg');

app.use(express.static('public'));
// Set up handlebars engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err;

    // Read messages from DB
    client
      .query('SELECT * FROM msgs;', function (err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }

        res.render('home', {
          rowsJson: encodeURIComponent(JSON.stringify(result.rows))
        });
      });
  });
});

io.on('connection', function(socket){
  socket.on('add topic', function(msg){
    // Save to DB
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) throw err;
      client
        .query('INSERT INTO msgs (body, score) VALUES ($1, 0) RETURNING id',
          [msg],
          function (err, result) {
            done();
            if (err) {
              return console.error('error running query', err);
            }

            io.emit('add topic', {id: result.rows[0].id, body: msg, score: 0});
          });
    });

  });
  socket.on('like changed', function(data){
    var msgid = data['id'];
    var delta = data['delta'];

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) throw err;
      client
        .query('UPDATE msgs SET score = score + $1 WHERE id = $2 RETURNING score',
          [delta, msgid],
          function (err, result) {
            done();
            if (err) {
              return console.error('error running query', err);
            }

            io.emit('like changed', {id: msgid, score: result.rows[0].score});
          });
    });
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
