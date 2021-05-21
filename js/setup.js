
const sqlite3 = require('sqlite3')

// destructuring
const sqlite = require('sqlite')
const open = sqlite.open;

async function app() {

	const db = await open({
		filename: 'kittens.db',
		driver: sqlite3.Database
	});


	db.on('trace', function(data) {
		console.log(data);
	});


	// ensure that foreign keys are on
	await db.exec('PRAGMA foreign_keys = ON;');

	await db.migrate();

	db.close();

}

app();