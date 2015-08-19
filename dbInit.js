var pg = require('pg');
var client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err) {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  client.query("CREATE TABLE IF NOT EXISTS msgs (id SERIAL NOT NULL, body varchar, score int)",
    function (err, result) {
      client.end();
      if (err) {
        return console.error('error running query', err);
      }
    });
});
