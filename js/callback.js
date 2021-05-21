
const sqlite3 = require('sqlite3')

// destructuring
const sqlite = require('sqlite')
const open = sqlite.open;

async function app() {



	let db = new sqlite3.Database('./kittens.db', (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Connected to the kittens database.');

		db.all('select * from kittens', function (err, results) {
			console.log(results);
		});

	});

	// // ensure that foreign keys are on
	// await db.exec('PRAGMA foreign_keys = ON;');

	// await db.migrate();

	db.close();

}

app();