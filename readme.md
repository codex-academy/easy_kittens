# Easier kittens

`'Taming that NodeJS callbacks kittens.'` - Kittens are cute, but they got nails!

Exploring:

* Callbacks
* Promises
* async/await

## The brief

Your local kitten cattery needs to send a daily email report. That looks like this:

`We have 3 kittens arriving on Monday.
5 kittens are staying longer than 3 days
And we have 13 kittens booked for the week.`

Write a function called `createReport` that reads data from a PostgreSQL table and create the report above.

The function take two parameters the `weekDay` and the `duration` it will check for.

Calling it like this:

```javascript
const reportString = createReport('Monday', 5);
```

Should return a report containing the number of kittens booked in for `Monday` that is staying `5` days or longer.

```javascript

// find ll the kittens coming on Tuesday staying 3 days or longer
const tuesdayReport = createReport('Tuesday', 3);

// find all kittens coming on Friday staying 2 days or longer
const fridayReport = createReport('Friday', 2);

```


The function takes two parameters `weekDay` (the week day) and `duration` (how long a kitten is booked in for). 

## Setup

### Create the database

Create a PostgreSQL database called `easy_kittens`:

Using these commands"

```sql
sudo -u postgres createdb easy_kittens;
```

### Create a database user

> **Note:** You could use a different username to accesst the database. The standard codeX username is `coder` hence these instructions are using it.


You should already have a `coder` user if you are using a codeX laptop. The username used to access a PostgreSQL database needs to be an actual username on your server or PC.

If not do this:

```
sudo -u postgres createuser coder -P;
```

Enter the password `pg123` when prompted after executing the `createuser` command. 

Now run *psql* as the *postgres* user:

```
sudo -u postgres psql;
```

### Grant the user access to the database

Grant the `coder` user access to the `easy_kittens` database by running this command: 

```
grant all privileges on database easy_kittens to coder;
```

No exit from the `psql` session as the `postgres` user by typing `\q` and pressing `enter`

### Create the tables

Now run `psql` in the root of this project using:

```
psql easy_kittens
```

Run the database scripts to create the `kittens` table in `psql`:

```
\i sql/001-create-kittens-table.sql
```

And to add data to the database:

```
\i sql/002-create-kittens-data.sql
```

After running these scripts there should be data in the kittens tables:

Run this query to check.

```
select * from kittens;
```

## Accessing a PostgreSQL database from NodeJS

For NodeJS to access PostgreSQL we need to install a `npm` module.

There are 2 possible npm modules:

* [node-postgres](https://www.npmjs.com/package/pg)
* [pg-promise](https://www.npmjs.com/package/pg-promise)

We are using [node-postgres](https://www.npmjs.com/package/pg) as it gives us easy access to `callbacks` & `promises`.

Setup you project:

```
npm init --y
```

And install node-postgres:

```
npm install --save pg
```

Create a new file called `index.js` and add this code into it.

```javascript
const pg = require("pg");
const Pool = pg.Pool;
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/easy_kittens';

const dbPool = new Pool({
	connectionString,
});
```

You can run the sql queries using the `dbPool.query` method.


### From callbacks to async/await via Promises

Exploring callbacks & promises to appreciate `async/await` gaining some understanding along the way.

### Callbacks

NodeJS is fundamentally non-blocking and use callbacks alot to prevent any code blocking in the process of waiting for a reply.

What are callbacks? You can read more [here](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/).

Let's use the `setTimeout` as an example to think about `callbacks` and asyncronous functions.

```javascript
setTimeout(function(){
	console.log("This print last")
}, 500);

console.log("This prints first");
```

You will note that the message in the callback function of the setTimeout function prints after the message below it. In this example the setTimeout function controls the duration when the callback is called.

When using it with the PostgreSQL driver - we pass a sql query to the database driver and a callback function. PostgreSQL will execute the query and once the result is available call the callback function with the result from the database. Our program can do other things in the meantime while it's waiting for a response from the database. This is one of the main things that makes NodeJS fast and efficient. But it makes code quite hard to read.


The call the the database below send 2 parameters into the `query` method:

* the query to run on the database,
* and the function to call once the database completed the query.

```javascript

dbPool.query("select count(*) from kittens", function(err, result){
	// this get called once the query completed running
	console.log("PostgreSQL responded");
	if (err) {
		console.log("Something went wrong:")
		console.log(err);
	} else {
		// Print a message of the number of kittens in the database
		console.log(`There are ${result.rows[0].count} kittens`);
	}
});

console.log("The query was sent to PostgreSQL");
// note that result is not available here.
console.log(result)
```

To call the other two queries we need for our report:

```sql
select count(*) from kittens where week_day = 'Monday'
select count(*) from kittens where duration > 5
```

Both of these will need to be in their own call to `dbPool.query` each one with each own callback.

As we would like to use the result from all three queries in one report things get a bit tricky quickly.

The easiest way we can do this with callbacks is to call the one query within the callback of the other query... Something like this:


```javascript
dbPool.query(queryOne, function(err, resultOne){
	dbPool.query(queryTwo, function(err, resultTwo){
		dbPool.query(queryThree, function(err, resultThree){
			// at this point you will have access to the results from all three queries
		});	
	});
});
```

The one tricky thing now is that the result for the queries can't be returned using a `return` statement as a return statement is `syncronous` and we need an asyncronous way of returning the result. For that we will use a callback function of our own.

We will create `createReport` like this:

```javascript
function createReport(weekDay, duration, cb) {

}
```

To call it will look like this:

```javascript

createReport("Monday", 3, function(err, result){
	if (err) {
		console.log(err);
	} else{
		console.log(result);
	}
});
```

Under the hood it will look like this:

```javascript
function createReport(weekDay, duration, cb) {

	// connect to the database

	dbPool.query(queryOne, function(err, resultOne){
		dbPool.query(queryTwo, function(err, resultTwo){
			dbPool.query(queryThree, function(err, resultThree){
				// at this point you will have access to the results from all three queries
				cb(null, reportString)
			});	
		});
	});
}
```

### Promises

[Promises](https://www.youtube.com/watch?v=yXTdFRSR7jU) is [an attempt]() to make it easier to work with asynchronous code and callbacks.

[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) are built into JavaScript and you can create your own ones if you need to. But for this excercise creating them is not important, we will just focussing on consuming them as the PostgreSQL drivers `query` method already returns a Promise.

Instead of using a callback to get the result from the database we can use a callback.

We can change this call to the database  that's using a callback to:

```javascript
	dbPool.query("select count(*) from kittens", function(err, result){
		// this get called once the query completed running
		console.log("PostgreSQL responded");
		if (err) {
			console.log("Something went wrong:")
			console.log(err);
		} else {
			// Print a message of the number of kittens in the database
			console.log(`There are ${result.rows[0].count} kittens`);
		}
	});
```

To one using a Promise like this:

```javascript
	dbPool
		.query("select count(*) from kittens")
		.then(function(result){
			console.log("PostgreSQL responded");
			console.log(`There are ${result.rows[0].count} kittens`);
		})
		.catch(function(err){
			console.log("Something went wrong:")
			console.log(err);
		});
```

Note that the success call and the error call is now in seperate functions.

There are lots of ways that Promises can be used. But one thing they give us is composability at this stage.

We can use the [Promise.all](https://www.freecodecamp.org/news/promise-all-in-javascript-with-example-6c8c5aea3e32/) built in method to run multiple promises and get a reply when all the promises complete or when there were an error.

We can use `Promise.all` to cleanup the nested callbacks that we created earlier to be able to run all three the sql queries we need to run:

We can change code like this:

```javascript
	dbPool.query(queryOne, function(err, resultOne){
		dbPool.query(queryTwo, function(err, resultTwo){
			dbPool.query(queryThree, function(err, resultThree){
				// at this point you will have access to the results from all three queries
			});	
		});
	});
```

To code like this:


```javascript
	const sqlQueries = [dbPool.query(queryOne),
		dbPool.query(queryTwo),
		dbPool.query(queryThree)];
	Promise
		.all(sqlQueries)
		.then(function(results){
			// all the results from the databases
			console.log(results)
		})
		.catch(function(err){
			// there might be an error here
			console.log(err);
		});
```

We can make `createReport` return a `Promise`.

To call it will look like this:

```javascript
createReport("Monday", 3)
	.then(function(result){
		console.log(result);
	})
	.catch(function(err){
		console.log(err);
	});
```

Inside the `createReport` function will look like this:

```javascript
function createReport(weekDay, duration) {
	const sqlQueries = [dbPool.query(queryOne),
		dbPool.query(queryTwo),
		dbPool.query(queryThree)];
	return Promise
		.all(sqlQueries);
}
```

Promises makes querying PostgreSQL much easier, but we can still do better still.

### Async


`async/await` is even a better way to use asyncronous code in NodeJS - we can use it if the function we are calling in NodeJS returns a Promise.


The `query` method on the PosgreSQL drivers `pool` object does.

So we can write code like this:

```
	const resultsOne = await dbPool.query(queryOne);
	const resultsTwo = await dbPool.query(queryTwo);
	const resultsThree = await dbPool.query(queryThree);
```

You will note that there are no `callback` functions any more! 

BUT note that `await` needs to be in a function marked as `async` as the code is still fundamentaly asyncronous... the JavaScript compiler is just doing some fancy things behind the scenes.

So the code should look like this:

```javascript

async function createReport(weekDay, duration) {

	const resultsOne = await dbPool.query(queryOne);
	const resultsTwo = await dbPool.query(queryTwo);
	const resultsThree = await dbPool.query(queryThree);

	const result = `We have ${kittenArrivingCount} kittens arriving on Monday.
${stayingLongerCount} kittens are staying longer than 3 days
And we have ${bookingCount} kittens booked for the week.`;

	return result;
}
```

Using `async/await` makes querying PostgreSQL much easier. Just be sure to to leave out the `await` keyword as you will get unexpected results.

Note that functions marked as `async` return a promise by default.

You can also use the `try\catch` block to catch exceptions.

```javascript

async function createReport(weekDay, duration) {
	try{

		const resultsOne = await dbPool.query(queryOne);
		const resultsTwo = await dbPool.query(queryTwo);
		const resultsThree = await dbPool.query(queryThree);
	
		const result = `We have ${kittenArrivingCount} kittens arriving on Monday.
	${stayingLongerCount} kittens are staying longer than 3 days
	And we have ${bookingCount} kittens booked for the week.`;
	
		return result;
	} catch (err){
		console.log(err)
		return "Something went wrong";
	}
}
```






















