const sqlite = require('sqlite3');

const db = new sqlite.Database('log.db');

db.serialize(() => {

  const prep = db.prepare('insert into log values (?, ?, ?)');
  prep.run(['RRRR', 12345.6789, 27]);
  prep.run(['RRRR', 15453.6435, 28]);
  prep.run(['AAAA', 15653.6534, 21]);
  prep.finalize();

});

db.close();


